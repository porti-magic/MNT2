const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ElectronAPI', {
  readFile: (path) => ipcRenderer.invoke('ReadFile', path),
  saveTorneo: (data) => ipcRenderer.send('SaveTorneo', data),
  evaluateTorneo: (data) => ipcRenderer.send('EvaluateTorneo', data),
  editTorneo: (originalName, data) => ipcRenderer.send('EditTorneo', originalName, data),
  getNextTorneos: (amount) => ipcRenderer.invoke('GetNextTorneos', amount),
  openEditTorneo: (name) => ipcRenderer.send('OpenEditTorneo', name),
  onSaveTorneo: (callback) => ipcRenderer.on('saved-torneo', (_event, value) => callback(value)),
  onEditTorneo: (callback) => ipcRenderer.on('edit-torneo', (_event, value) => callback(value)),
  onEvaluarTorneo: (callback) => ipcRenderer.on('evaluar-torneo', (_event, value, penalidadesJson) => callback(value, penalidadesJson)),
  onShowResults: (callback) => ipcRenderer.on('show-results', (_event, value) => callback(value))

})
