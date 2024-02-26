const nombreDelTorneoField = document.getElementById('name')

let participants

window.ElectronAPI.onShowResults((value) => {
  nombreDelTorneoField.innerText = value.name
  participants = value.participants
  CreateTable()
})

function CreateTable () {
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
    levCell.innerHTML = p.Leves.reduce((partialSum, a) => partialSum + a, 0)

    const graCell = row.insertCell();
    graCell.innerHTML = p.Graves.reduce((partialSum, a) => partialSum + a, 0)

    const ttCell = row.insertCell()
    ttCell.innerHTML = p.TotalTiempo >= 0 ? p.TotalTiempo : 'Descalificado'
  }
}