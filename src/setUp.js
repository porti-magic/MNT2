const fs = require('fs')
const path = require('path');
const { ipcMain, app } = require('electron')
const { SaveTorneo, ReadFile, EditTorneo, GetTorneo } = require('./FilesUtilities.js')
const { OpenEdit, OpenResults } = require('./Navigation.js')

function CreateDataFiles() {
    const basetPath = app.getPath('userData');
    var dataDir = path.join(basetPath, 'data')
    if (!fs.existsSync(dataDir) && process.env.NODE_ENV != 'development') {
        fs.mkdirSync(dataDir);
        fs.writeFileSync(path.join(dataDir, 'EventIndex.json'), '{}')
        var penalidades = {
            "LevesTiempo": 10,
            "Gravestiempo": 60,
            "ExtraLeveCantidad": 6,
            "ExtraLeveTiempo": 60,
            "ExtraGraveCantidad": 3,
            "ExtraGraveTiempo": -1000000

        }
        fs.writeFileSync(path.join(dataDir, 'penalidades.json'), JSON.stringify(penalidades))
        fs.mkdirSync(path.join(dataDir, 'Torneos'));
    }
}

function SetUpIpcMain(win) {
    ipcMain.on('SaveTorneo', (evet, data) => {
        var saved = SaveTorneo(data)
        if (!saved) {
            OpenEdit(win, data).then(() => win.webContents.send('save-torneo', saved))

        }
        else {
            win.webContents.send('save-torneo', saved)
        }
    });

    ipcMain.on('EditTorneo', (evet, originalData, data) => {
        var saved = EditTorneo(originalData, data)
        if (!saved) {
            OpenEdit(win, data).then(() => win.webContents.send('save-torneo', saved))

        }
        else {
            win.webContents.send('save-torneo', saved)
        }
    });

    ipcMain.on('EvaluateTorneo', (evet, data) => {
        var saved = SaveTorneo(data)
        if (!saved) {
            OpenResults(win, data)
        }
    });

    ipcMain.on('OpenEditTorneo', (event, name) => {
        var data = GetTorneo(name)
        OpenEdit(win, data)
    });

    ipcMain.handle('ReadFile', (event, path) => {
        return ReadFile(path)
    });
}

module.exports = { CreateDataFiles, SetUpIpcMain }