//Keep edit, View, window
//Keep File?
/*Add:
    Torneo
        Crear
        Editar
        Evaluar*/

const { app, Menu } = require('electron')
const { SelectTorneoToEdit, GetNextTorneos, GetPenalidades } = require('./FilesUtilities.js')
const { OpenEdit, OpenEvaluar, OpenResults, OpenMainPage } = require('./Navigation.js')


const isMac = process.platform === 'darwin';
const isProd = process.env.NODE_ENV != 'development';

const SetMenu = (win) => {
    const template = [
        // { role: 'appMenu' }
        ...(isMac
            ? [{
                label: app.name,
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            }]
            : []),
        //{ role: 'fileMenu' },
        {
            label: '&File',
            submenu: [
                {
                    label: '&Inicio',
                    click: () => { OpenMainPage(win, GetNextTorneos(10)) }
                },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        { role: 'editMenu' },
        isProd ? {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        } : { role: 'viewMenu' },
        { role: 'windowMenu' },
        {
            label: '&Torneo',
            submenu: [
                {
                    label: '&Crear',
                    click: () => { win.loadFile('src/pages/CrearTorneo.html') }
                },
                {
                    label: '&Editar',
                    click: () => {
                        var data = SelectTorneoToEdit(win)
                        if (data) {
                            OpenEdit(win, data)
                        }
                    }
                },
                {
                    label: 'E&valuar',
                    click: () => {
                        var data = SelectTorneoToEdit(win)
                        var penalidadesJson = GetPenalidades()
                        if (data) {
                            OpenEvaluar(win, data, penalidadesJson)
                        }
                    }
                },
                {
                    label: '&Resultados',
                    click: () => {
                        var data = SelectTorneoToEdit(win)
                        if (data) {
                            OpenResults(win, data)
                        }
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

module.exports = { SetMenu }
