import { addSpinner, deleteSpinner } from './spinner.js'

const spinnerId = addSpinner(document.body)

const nombreDelTorneoField = document.getElementById('name')
const juezIdField = document.getElementById('juezID')
const siguienteBtn = document.getElementById('SiguienteBtn')
const TerminarBtn = document.getElementById('TerminarBtn')

let juezId = 0
let participants
let nombreDelTorneo
let fecha

let penalidades = {}

window.ElectronAPI.onEvaluarTorneo((value, penalidadesJson) => {
  nombreDelTorneo = value.name
  nombreDelTorneoField.innerText = nombreDelTorneo
  fecha = value.date
  participants = value.participants
  penalidades = penalidadesJson
  CreateTable()
  deleteSpinner(spinnerId)
})

window.onload = function () {
  siguienteBtn.addEventListener('click', () => {
    CreateTable()
  })

  TerminarBtn.addEventListener('click', () => {
    SaveEvaluation()
  })
}

function CreateTable () {
  DeleteTable()

  juezId++
  juezIdField.innerText = juezId

  const tbody = document.getElementsByTagName('tbody')[0]
  for (const p of participants) {
    const row = tbody.insertRow()

    const numCell = row.insertCell()
    numCell.innerHTML = p.Numero

    const nameCell = row.insertCell()
    nameCell.innerHTML = p.Nombre

    const catCell = row.insertCell()
    catCell.innerHTML = p.Categoria

    const levCell = row.insertCell()
    levCell.innerHTML = `<input type="number" id="leve${p.Numero}" class="form-control" aria-describedby="leve" value=0 min=0>`
    levCell.firstChild.addEventListener('change', (event) => {
      addFalta(p, Number(event.target.value), 'leve')
    })
    p.Leves.push(0)

    const graCell = row.insertCell()
    graCell.innerHTML = `<input type="number" id="grave${p.Numero}" class="form-control" aria-describedby="graves" value=0 min=0>`
    graCell.firstChild.addEventListener('change', (event) => {
      addFalta(p, Number(event.target.value), 'grave')
    })
    p.Graves.push(0)
  }
}

function addFalta (participant, amount, fieldName) {
  const field = fieldName === 'leve' ? participant.Leves : participant.Graves
  field.pop()
  field.push(amount)
}

function DeleteTable () {
  const oldTbody = document.getElementsByTagName('tbody')[0]
  const newtbody = document.createElement('tbody')
  oldTbody.parentNode.replaceChild(newtbody, oldTbody)
}

function SaveEvaluation () {
  CalculateTime()

  const data = {}
  data.name = nombreDelTorneo
  data.date = fecha
  data.participants = participants

  window.ElectronAPI.evaluateTorneo(data)
}

function CalculateTime () {
  for (const p of participants) {
    const totalLeves = p.Leves.reduce((partialSum, a) => partialSum + a, 0)
    const totalGraves = p.Graves.reduce((partialSum, a) => partialSum + a, 0)
    const totalTiempo = (totalLeves * penalidades.LevesTiempo) +
            (Math.floor(totalLeves / penalidades.ExtraLeveCantidad) * penalidades.ExtraLeveTiempo) +
            (totalGraves * penalidades.Gravestiempo) +
            (Math.floor(totalGraves / penalidades.ExtraGraveCantidad) * penalidades.ExtraGraveTiempo)
    p.TotalTiempo = totalTiempo
  }
}
