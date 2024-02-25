var nombreDelTorneoField = document.getElementById('name')
var juezIdField = document.getElementById('juezID')
var siguienteBtn = document.getElementById('SiguienteBtn')
var TerminarBtn = document.getElementById('TerminarBtn')

var juezId = 0
var participants
var nombreDelTorneo
var fecha

var penalidades = {}

window.ElectronAPI.onEvaluarTorneo((value, penalidadesJson) => {
    nombreDelTorneo = value.name
    nombreDelTorneoField.innerText = nombreDelTorneo
    fecha = value.date
    participants = value.participants
    penalidades = penalidadesJson
    CreateTable()
})

window.onload = function () {
    siguienteBtn.addEventListener('click', () => {
        CreateTable()
    })

    TerminarBtn.addEventListener('click', () => {
        SaveEvaluation()
    })
}

function CreateTable(){
    DeleteTable()

    juezId++
    juezIdField.innerText = juezId


    var tbody = document.getElementsByTagName('tbody')[0]
    for (let p of participants) {
        const row = tbody.insertRow()

        const numCell = row.insertCell();
        numCell.innerHTML = p.Numero;

        const nameCell = row.insertCell();
        nameCell.innerHTML = p.Nombre;

        const catCell = row.insertCell();
        catCell.innerHTML = p.Categoria;

        const levCell = row.insertCell();
        levCell.innerHTML = `<input type="number" id="leve${p.Numero}" class="form-control" aria-describedby="leve" value=0 min=0>`
        levCell.firstChild.addEventListener('change', (event) => {
            addFalta(p, Number(event.target.value), 'leve')
        })
        p.Leves.push(0)

        const graCell = row.insertCell();
        graCell.innerHTML = `<input type="number" id="grave${p.Numero}" class="form-control" aria-describedby="graves" value=0 min=0>`
        graCell.firstChild.addEventListener('change', (event) => {
            addFalta(p, Number(event.target.value), 'grave')
        })
        p.Graves.push(0)
    }
}

function addFalta(participant, amount, fieldName) {
    var field = fieldName === 'leve' ? participant.Leves : participant.Graves
    field.pop()
    field.push(amount)
}

function DeleteTable() {
    const oldTbody = document.getElementsByTagName('tbody')[0]
    const newtbody = document.createElement("tbody")
    oldTbody.parentNode.replaceChild(newtbody, oldTbody);
}

function SaveEvaluation() {
    CalculateTime()

    var data = {}
    data.name = nombreDelTorneo
    data.date = fecha
    data.participants = participants

    window.ElectronAPI.evaluateTorneo(data)
}

function CalculateTime() {
    for (let p of participants) {
        var totalLeves = p.Leves.reduce((partialSum, a) => partialSum + a, 0)
        var totalGraves = p.Graves.reduce((partialSum, a) => partialSum + a, 0)
        var totalTiempo = (totalLeves * penalidades.LevesTiempo)
            + (Math.floor(totalLeves / penalidades.ExtraLeveCantidad) * penalidades.ExtraLeveTiempo)
            + (totalGraves * penalidades.Gravestiempo)
            + (Math.floor(totalGraves / penalidades.ExtraGraveCantidad) * penalidades.ExtraGraveTiempo)
        p.TotalTiempo = totalTiempo
    }
}