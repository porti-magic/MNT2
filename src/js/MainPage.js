import { addSpinner, deleteSpinner } from './spinner.js'
import { createToast, showToast } from './toast.js'

const spinnerId = addSpinner(document.body)

const ProximoTorneoName = document.getElementById('ProximoTorneoName')
const ProximoTorneoFecha = document.getElementById('ProximoTorneoFecha')
const ProximoTorneoDiasRestantes = document.getElementById('ProximoTorneoDiasRestantes')
const ProximoTorneoEditar = document.getElementById('ProximoTorneoEditar')
const MainContent = document.getElementById('mainContent')
const NoDataToDisplay = document.getElementById('NoDataToDisplay')

window.onload = function () {
  window.ElectronAPI.getNextTorneos(10)
    .then((value) => {
      if (value.length > 0) {
        MainContent.hidden = false

        const timeDifference = value[0].date.setHours(0, 0, 0, 0) - (new Date().setHours(0, 0, 0, 0))
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

        ProximoTorneoName.innerText = value[0].name
        ProximoTorneoFecha.innerText = `${value[0].date.getDate()}/${value[0].date.getMonth() + 1}/${value[0].date.getFullYear()}`
        ProximoTorneoEditar.addEventListener('click', () => window.ElectronAPI.openEditTorneo(value[0].name))
        ProximoTorneoDiasRestantes.innerText = Math.ceil(daysRemaining)

        CreateTable(value)
      } else {
        NoDataToDisplay.hidden = false
      }
      deleteSpinner(spinnerId)
    })
}

window.ElectronAPI.onSaveTorneo((value) => {
  console.log(value)
  if (value) {
    const toasId = createToast({
      id: 'SavedSuccessfulToast',
      header: 'Torneo Guardado',
      time: 'just now',
      body: `el torneos "${value.name}" se guardo correctamente!`
    })
    showToast(toasId)
  }
})

function CreateTable (events) {
  const tbody = document.getElementsByTagName('tbody')[0]
  for (const e of events) {
    const row = tbody.insertRow()
    row.classList.add('row')

    const nameCell = row.insertCell()
    nameCell.innerHTML = e.name
    nameCell.classList.add('col-5')

    const dateCell = row.insertCell()
    dateCell.innerHTML = `${e.date.getDate()}/${e.date.getMonth() + 1}/${e.date.getFullYear()}`
    dateCell.classList.add('col-5')

    const buttons = row.insertCell()
    buttons.innerHTML = `<button id="edit${e.name}" class="btn btn-primary float-end">Editar</button>`
    buttons.classList.add('col-2')

    buttons.firstElementChild.addEventListener('click', () => window.ElectronAPI.openEditTorneo(e.name))
  }
}
