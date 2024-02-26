const form = document.getElementById('NuevoTorneoForm')
const guardarBtn = document.getElementById('GurdarBtn')
const nameInput = document.getElementById('inputNombre')
const dateInput = document.getElementById('inputFecha')
const participantsInput = document.getElementById('inputParticipante')
const invalidFileAlert = document.getElementById('invalidFileAlert')
const saveSucess = document.getElementById('saveSucess')
let participants = []
let originalName = ''

window.onload = function () {
  guardarBtn.addEventListener('click', () => {
    form.classList.add('was-validated')
    SaveTorneo()
  })

  participantsInput.addEventListener('input', () => {
    const path = participantsInput.files[0].path
    loadCSV(path)
  })
}

window.ElectronAPI.onSaveTorneo((value) => {
  if (!value) {
    saveSucess.hidden = false
  }
})

window.ElectronAPI.onEditTorneo((value) => {
  nameInput.value = value.name
  dateInput.value = value.date
  CreateTable(value.participants)
  originalName = value.name
})

function loadCSV (path) {
  window.ElectronAPI.readFile(path)
    .then((data) => {
      invalidFileAlert.hidden = true
      CreateTable(data)
    })
    .catch((err) => {
      console.log(err)
      invalidFileAlert.hidden = false
      DeleteTable()
    })
}

function SaveTorneo () {
  const data = {}
  data.name = nameInput.value
  data.date = dateInput.value
  data.participants = participants
  window.ElectronAPI.editTorneo(originalName, data)
}

function CreateTable (data) {
  DeleteTable()
  const tbody = document.getElementsByTagName('tbody')[0]
  for (const p of data) {
    const row = tbody.insertRow()

    const numCell = row.insertCell()
    numCell.innerHTML = p.Numero

    const nameCell = row.insertCell()
    nameCell.innerHTML = p.Nombre

    const catCell = row.insertCell()
    catCell.innerHTML = p.Categoria
  }
  participants = data
}

function DeleteTable () {
  const oldTbody = document.getElementsByTagName('tbody')[0]
  const tbody = document.createElement('tbody')
  oldTbody.parentNode.replaceChild(tbody, oldTbody)
}
