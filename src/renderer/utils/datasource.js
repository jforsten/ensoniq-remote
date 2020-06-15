import store from '../store/'
import { sep } from 'path'
import { EpsLin } from './epslin'
import { Midi } from './midi'

export const DataSource = {

  // Storage

  getDirectoryInfoFromEnsoniaMedia (path) {
    return EpsLin.getDir(path)
  },

  getMediaList () {
    var mediaDirectory = store.getters['settings/mediaDirectory']
    var mediaList = require('fs').readdirSync(mediaDirectory)

    return mediaList.map((name, index) => {
      var dict = {}
      dict['id'] = index
      dict['name'] = name
      return dict
    })
  },

  sendToEnsoniq (path, idx, filename, pos) {
    /*
    return this.getInstrumentFromEnsoniqMedia(path, idx)
      .then(() => this.clearEnsoniqStorage())
      .then(() => this.putInstrumentToEnsoniqStorage(filename))
      .then(() => this.requestInstrumentLoad(1, pos))
      .then(() => this.deleteFileInWorkingDirectory(filename))
      */
    return this.requestInstrumentLoad(1, pos)
  },

  getInstrumentFromEnsoniqMedia (path, idx) {
    return EpsLin.getEfe(path, idx)
  },

  deleteFileInWorkingDirectory (filename) {
    var workingDirectory = store.getters['settings/workingDirectory']
    return new Promise((resolve, reject) => {
      try {
        require('fs').unlinkSync(workingDirectory + sep + filename)
        resolve()
      } catch (err) {
      // handle the error
        console.log('cannot delete file:' + filename + ' - Reason: ' + err)
        reject(err)
      }
    })
  },

  clearEnsoniqStorage () {
    return EpsLin.clearEfes()
  },

  putInstrumentToEnsoniqStorage (filename) {
    return EpsLin.putEfe(filename)
  },

  // Midi

  getMidiPorts () {
    return Midi.getPorts()
  },

  requestInstrumentLoad (idx, pos) {
    // var inputId = store.getters['settings/midiInput']
    var outputId = store.getters['settings/midiOutput']
    // return Midi.programChange(outputId, idx, pos)
    // return Midi.loadGlobalParameters(outputId)
    // Midi.setupInput(inputId)
    return Midi.getInstumentData(outputId, pos - 1)
  },

  // Settings

  loadSettings () {
    if (localStorage.getItem('settings')) {
      var allSettings = JSON.parse(localStorage.getItem('settings'))
      if (allSettings !== undefined) {
        store.dispatch('settings/setAllSettings', allSettings)
      }
    }
  },

  saveSettings () {
    localStorage.setItem('settings', JSON.stringify(store.getters['settings/allSettings']))
  },

  initializeMidi () {
    var inputId = store.getters['settings/midiInput']
    // TODO: Why first Midi init does not return inputs/outputs?
    setTimeout(() => { Midi.initialize(inputId).then(() => { Midi.initialize(inputId) }) }, 100)
  }

}
