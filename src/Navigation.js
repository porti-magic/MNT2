function OpenEdit (win, data) {
  return win.loadFile('src/pages/EditarTorneo.html').then(() => { win.webContents.send('edit-torneo', data) })
}

function OpenEvaluar (win, data, penalidadesJson) {
  return win.loadFile('src/pages/Evaluar.html').then(() => { win.webContents.send('evaluar-torneo', data, penalidadesJson) })
}

function OpenResults (win, data) {
  return win.loadFile('src/pages/Resultados.html').then(() => { win.webContents.send('show-results', data) })
}

function OpenMainPage (win) {
  return win.loadFile('src/pages/MainPage.html')
}

module.exports = { OpenEdit, OpenEvaluar, OpenResults, OpenMainPage }
