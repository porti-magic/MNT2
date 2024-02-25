const { app, BrowserWindow } = require('electron')
const { SetMenu } = require('./menues.js')
const path = require('path')
const { CreateDataFiles, SetUpIpcMain } = require('./setUp.js')
const { GetNextTorneos } = require('./FilesUtilities.js')
const { OpenMainPage } = require('./Navigation.js')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.resolve(__dirname, 'preload.js')
        }
    })

    SetUpIpcMain(win);

    win.maximize()
    var NextTorneos = GetNextTorneos(10)
    OpenMainPage(win, NextTorneos)
    SetMenu(win)

    
}

app.whenReady().then(() => {
    if (require('electron-squirrel-startup')) app.quit();

    CreateDataFiles();

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
