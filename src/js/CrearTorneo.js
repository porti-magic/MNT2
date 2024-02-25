var form = document.getElementById('NuevoTorneoForm')
var guardarBtn = document.getElementById('GurdarBtn')
var nameInput = document.getElementById('inputNombre')
var dateInput = document.getElementById('inputFecha')
var participantsInput = document.getElementById('inputParticipante')
var gurdarBtn = document.getElementById('GurdarBtn')
var invalidFileAlert = document.getElementById("invalidFileAlert")
var saveFailed = document.getElementById("saveFailed")
var participants = []

window.onload = function () {
    guardarBtn.addEventListener('click', () => {
        form.classList.add('was-validated')
        SaveTorneo()
    })

    participantsInput.addEventListener('input', () => {
        var path = participantsInput.files[0].path
        loadCSV(path)
    })
}

window.ElectronAPI.onSaveTorneo((value) => {
    if (value) {
        saveFailed.hidden = false
    }
})

function loadCSV(path) {
    window.ElectronAPI.readFile(path)
        .then((data) => {
            invalidFileAlert.hidden = true
            CreateTable(data)
            guardarBtn.disabled = false
        })
        .catch((err) => {
            console.log(err)
            invalidFileAlert.hidden = false
            DeleteTable()
            guardarBtn.disabled = true
        })
}

function SaveTorneo() {
    var data = {}
    data.name = nameInput.value
    data.date = dateInput.value
    data.participants = participants
    window.ElectronAPI.saveTorneo(data)
}

function CreateTable(data) {
    DeleteTable()
    const tbody = document.getElementsByTagName("tbody")[0]
    for (p of data) {

        const row = tbody.insertRow()
        
        const numCell = row.insertCell();
        numCell.innerHTML = p.Numero;

        const nameCell = row.insertCell();
        nameCell.innerHTML = p.Nombre;

        const catCell = row.insertCell();
        catCell.innerHTML = p.Categoria;
    }

    participants = data
}

function DeleteTable() {
    const oldTbody = document.getElementsByTagName("tbody")[0]
    const tbody = document.createElement("tbody")
    oldTbody.parentNode.replaceChild(tbody, oldTbody);
}