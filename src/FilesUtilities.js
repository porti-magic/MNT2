const fs = require('fs')
const path = require('path')
const { dialog, app } = require('electron')

const isDev = process.env.NODE_ENV === 'development'

const basetPath = isDev ? path.dirname(__dirname) : app.getPath('userData')
const dataDir = path.join(basetPath, 'data')
const indexDirectory = path.join(dataDir, 'EventIndex.json')
const torneosDir = path.join(dataDir, 'Torneos')

function SaveTorneo (jsonData) {
  if (!fs.existsSync(torneosDir)) {
    fs.mkdirSync(torneosDir)
  }
  const filePath = path.join(torneosDir, jsonData.name + '.json')
  const stringData = JSON.stringify(jsonData)

  fs.writeFileSync(filePath, stringData)

  const index = GetIndexData()
  index[jsonData.name] = jsonData.date

  fs.writeFileSync(indexDirectory, JSON.stringify(index))
}

function EditTorneo (originalName, jsonData) {
  const newPath = path.join(torneosDir, jsonData.name + '.json')

  fs.renameSync(path.join(torneosDir, originalName + '.json'), newPath)

  DeleteFromIndex(originalName)

  SaveTorneo(jsonData)
}

function DeleteFromIndex (originalName) {
  const index = GetIndexData()

  delete index[originalName]

  fs.writeFileSync(indexDirectory, JSON.stringify(index))
}

function GetIndexData () {
  let index = {}
  if (fs.existsSync(indexDirectory)) {
    const indexString = fs.readFileSync(indexDirectory).toString()
    index = JSON.parse(indexString)
  }

  return index
}

function ReadFile (path) {
  let csvData = fs.readFileSync(path, 'utf8')

  // Split on row
  csvData = csvData.split('\r\n')

  // Get first row for column headers
  const headers = csvData.shift().split(',')
  const json = []
  csvData.forEach(function (d) {
    // Loop through each row
    const tmp = {}
    const rows = d.split(',')

    for (let i = 0; i < headers.length; i++) {
      tmp[headers[i]] = rows[i]
    }

    // Define the expected keys
    const expectedKeys = ['Nombre', 'Numero', 'Categoria']

    // Check if all expected keys exist
    for (const key of expectedKeys) {
      if (!tmp.hasOwnProperty(key)) {
        throw new Error(`Missing key: ${key}`)
      }
    }

    // Check for extra keys
    for (const key in tmp) {
      if (!expectedKeys.includes(key)) {
        throw new Error(`Unexpected key: ${key}`)
      }
    }

    tmp.Leves = []
    tmp.Graves = []
    tmp.TotalTiempo = 0

    // Add object to list
    json.push(tmp)
  })

  return json
}

function ReadJSON (path) {
  const stringData = fs.readFileSync(path).toString()
  const data = JSON.parse(stringData)
  return data
}

function SelectTorneoToEdit (win) {
  const filePath = dialog.showOpenDialogSync(win, {
    defaultPath: torneosDir,
    properties: ['openFile'],
    filters: [{ name: 't', extensions: 'json' }]
  })

  if (filePath) {
    const data = ReadJSON(filePath[0])
    return data
  }

  return filePath
}

function GetPenalidades () {
  const filePath = path.resolve(dataDir, 'penalidades.json')
  const json = ReadJSON(filePath)
  return json
}

function GetNextTorneos (amount) {
  const index = GetIndexData()

  const sortedIndex = Object.entries(index)
    .map(([name, dateStr]) => ({ name, date: new Date(Date.UTC(...parseDate(dateStr))) }))
    .sort((a, b) => a.date - b.date)
  function parseDate (dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number)
    return [year, month - 1, day + 1] // Month is zero-based
  }

  const currentDate = new Date()
  const nextEvents = sortedIndex.filter(event => event.date >= currentDate).slice(0, amount)
  return nextEvents
}

function GetTorneo (name) {
  const json = ReadJSON(path.join(torneosDir, name + '.json'))
  return json
}

module.exports = { SaveTorneo, ReadFile, SelectTorneoToEdit, EditTorneo, GetNextTorneos, ReadJSON, GetPenalidades, GetTorneo }
