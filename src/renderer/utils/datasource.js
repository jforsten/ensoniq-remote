import store from '../store/'
import { sep } from 'path'
import { EpsLin } from './epslin'
import { Midi } from './midi'
import { Helpers } from './helpers'

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

  sendToEnsoniq (path, idx, filename, pos, callback) {
    /*
    return this.getInstrumentFromEnsoniqMedia(path, idx)
      .then(() => this.clearEnsoniqStorage())
      .then(() => this.putInstrumentToEnsoniqStorage(filename))
      .then(() => this.requestInstrumentLoad(1, pos))
      .then(() => this.deleteFileInWorkingDirectory(filename))
      */
    return this.requestInstrumentLoad(1, pos, callback)
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

  requestInstrumentLoad (idx, pos, callback) {
    // var inputId = store.getters['settings/midiInput']
    var outputId = store.getters['settings/midiOutput']
    // return Midi.programChange(outputId, idx, pos)
    // return Midi.loadGlobalParameters(outputId)
    // Midi.setupInput(inputId)
    return Midi.getInstumentData(outputId, pos - 1, callback)
  },

  getInstrumentData (pos) {
    console.log('getInstrument - ' + pos)
    var outputId = store.getters['settings/midiOutput']
    var promise = new Promise((resolve) => {
      Midi.getInstumentData(outputId, pos, (pos, name) => {
        console.log('CALLBACK for pos:' + pos)
        resolve(name)
      })
    })
    return Helpers.promiseTimeout(5000, promise)
  },

  getAllInstrumentData () {
    var names = [null, null, null, null, null, null, null, null]
    return DataSource.getInstrumentData(1)
      .then((name) => { names[0] = name })
      .then(() => DataSource.getInstrumentData(2))
      .then((name) => { names[1] = name })
      .then(() => DataSource.getInstrumentData(3))
      .then((name) => { names[2] = name })
      .then(() => DataSource.getInstrumentData(4))
      .then((name) => { names[3] = name })
      .then(() => DataSource.getInstrumentData(5))
      .then((name) => { names[4] = name })
      .then(() => DataSource.getInstrumentData(6))
      .then((name) => { names[5] = name })
      .then(() => DataSource.getInstrumentData(7))
      .then((name) => { names[6] = name })
      .then(() => DataSource.getInstrumentData(8))
      .then((name) => { names[7] = name; return names })
  },

  getCurrentMidiInputName () {
    var inputId = store.getters['settings/midiInput']
    if (inputId === undefined) return '-'
    return Midi.getInputName(inputId)
  },

  getCurrentMidiOutputName () {
    var outputId = store.getters['settings/midiOutput']
    if (outputId === undefined) return '-'
    return Midi.getOutputName(outputId)
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
    return Helpers.delay(500)
      .then(() => { return Midi.initialize(inputId) })
      .then(() => { return Midi.initialize(inputId) })
  }

}
