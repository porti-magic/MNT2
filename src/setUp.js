const fs = require('fs')
const path = require('path')
const { ipcMain, app } = require('electron')
const { SaveTorneo, ReadFile, EditTorneo, GetTorneo, GetNextTorneos } = require('./FilesUtilities.js')
const { OpenEdit, OpenResults, OpenMainPage } = require('./Navigation.js')

function CreateDataFiles () {
  const basetPath = app.getPath('userData')
  const dataDir = path.join(basetPath, 'data')
  if (!fs.existsSync(dataDir) && process.env.NODE_ENV !== 'development') {
    fs.mkdirSync(dataDir)
    fs.writeFileSync(path.join(dataDir, 'EventIndex.json'), '{}')
    const penalidades = {
      LevesTiempo: 10,
      Gravestiempo: 60,
      ExtraLeveCantidad: 6,
      ExtraLeveTiempo: 60,
      ExtraGraveCantidad: 3,
      ExtraGraveTiempo: -1000000

    }
    fs.writeFileSync(path.join(dataDir, 'penalidades.json'), JSON.stringify(penalidades))
    fs.mkdirSync(path.join(dataDir, 'Torneos'))
  }
}

function SetUpIpcMain (win) {
  ipcMain.on('SaveTorneo', (evet, data) => {
    SaveTorneo(data)
    OpenMainPage(win).then(() => win.webContents.send('saved-torneo', data))
  })

  ipcMain.on('EditTorneo', (evet, originalData, data) => {
    EditTorneo(originalData, data)
    OpenMainPage(win).then(() => win.webContents.send('saved-torneo', data))
  })

  ipcMain.on('EvaluateTorneo', (evet, data) => {
    SaveTorneo(data)
    OpenResults(win, data)
  })

  ipcMain.on('OpenEditTorneo', (event, name) => {
    const data = GetTorneo(name)
    OpenEdit(win, data)
  })

  ipcMain.handle('ReadFile', (event, path) => {
    return ReadFile(path)
  })

  ipcMain.handle('GetNextTorneos', (event, amount) => { return GetNextTorneos(amount) })
}

module.exports = { CreateDataFiles, SetUpIpcMain }
