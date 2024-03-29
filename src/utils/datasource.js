import store from '@/store/'
import { sep } from 'path'
import { EpsLin } from '@/utils/epslin'
import { Midi } from '@/utils/midi'
import { Helpers } from '@/utils/helpers'
import { FileSystem } from '@/utils/filesystem'
import { EnsoniqDeviceType } from '@/utils/ensoniqDeviceType'

export const DataSource = {

  // Storage

  getDirectoryInfoFromEnsoniqMedia (path) {
    return EpsLin.getDir(path)
  },

  getMediaList (mediaDirectory) {
    const mediaList = require('fs').readdirSync(mediaDirectory)

    const list = mediaList.map((name, index) => {
      const dict = {}
      dict.id = index
      dict.name = name
      return dict
    })
    store.commit('app/updateMediaList', list)
  },

  sendToEnsoniq (path, idx, filename, pos) {
    return this.getInstrumentFromEnsoniqMedia(path, idx)
      .then(() => this.clearEnsoniqStorage())
      .then(() => this.putInstrumentToEnsoniqStorage(filename))
      .then(() => Helpers.delay(300))
      .then(() => this.requestInstrumentLoad(1, pos))
      .catch((e) => { console.error(e); throw e })
      .finally(() => this.deleteFileInWorkingDirectory(filename))
  },

  getInstrumentFromEnsoniqMedia (path, idx) {
    console.log('DataSource: getInstrumentFromEnsoniqMedia')
    return EpsLin.getEfe(path, idx)
  },

  deleteFileInWorkingDirectory (filename) {
    console.log('DataSource: deleteFileInWorkingDirectory')
    const workingDirectory = store.getters['settings/workingDirectory']
    return new Promise((resolve, reject) => {
      try {
        require('fs').unlinkSync(workingDirectory + sep + filename)
        resolve()
      } catch (err) {
      // handle the error
        console.error('cannot delete file:' + filename + ' - Reason: ' + err)
        reject(err)
      }
    })
  },

  clearEnsoniqStorage () {
    console.log('DataSource: ClearEnsoniqStorage')
    return EpsLin.eraseEfe()
  },

  putInstrumentToEnsoniqStorage (filename) {
    console.log('DataSource: putInstrumentToEnsoniqMedia')
    return EpsLin.putEfe(filename)
  },

  getEnsoniqDevices () {
    return Object.keys(EnsoniqDeviceType).filter(key => typeof EnsoniqDeviceType[key] === 'string').map(key => {
      return { id: key, name: EnsoniqDeviceType[key] }
    })
  },

  // Midi

  getMidiPorts () {
    return Midi.getPorts()
  },

  requestInstrumentLoad (idx, pos) {
    console.log('DataSource: requestInstrumentLoad')
    const deviceType = store.getters['settings/ensoniqDevice']
    console.warn(deviceType)
    const outputId = store.getters['settings/midiOutput'].id
    return Midi.changeStorageDevice(outputId, deviceType)
      .then(() => Midi.deleteInstrument(outputId, pos))
      .then(() => EnsoniqDeviceType.isEPS16(deviceType) ? Midi.createInstrumentPlaceholder(outputId, pos) : Promise.resolve()) // For EPS16, prepare placeholder instrument
      .then(() => EnsoniqDeviceType.isEPS16(deviceType) ? Midi.prepareInstrumentPlaceholder(outputId, pos) : Promise.resolve()) // For EPS16, prepare placeholder instrument
      .then(() => Midi.prepareLoadInstrument(outputId))
      .then(() => Midi.programChange(outputId, idx, pos))
      .then(() => Helpers.delay(EnsoniqDeviceType.isEPS(deviceType) ? 500 : 10)) // EPS is slow.. add delay
      .then(() => this.getInstrumentData(pos))
      .catch((e) => { console.error('DataSource: requestInstrumentLoad:' + e); throw e })
  },

  getInstrumentData (pos) {
    const deviceType = store.getters['settings/ensoniqDevice']
    console.warn('deviceType:' + deviceType)
    console.warn('Value:' + EnsoniqDeviceType.getValue(deviceType))

    const outputId = store.getters['settings/midiOutput'].id
    return new Promise((resolve, reject) => {
      console.log('call midi.getinstdata')
      Midi.getInstrumentData(outputId, deviceType, pos,
        (position, name) => {
          store.commit('app/updateDeviceLoadedInstrument', { pos: pos, name: name })
          resolve(name)
        },
        (err) => {
          console.error('DataSource: getInstrumentData (pos=' + pos + ') - error:' + err)
          reject(err)
        })
    }).then(() => Helpers.delay(EnsoniqDeviceType.isEPS(deviceType) ? 200 : 10)) // EPS is slow.. add delay
  },

  deleteInstrument (pos) {
    const outputId = store.getters['settings/midiOutput'].id
    return Midi.deleteInstrument(outputId, pos)
      .then(() => this.getInstrumentData(pos))
  },

  copyInstrument (from, to) {
    const outputId = store.getters['settings/midiOutput'].id
    return Midi.deleteInstrument(outputId, to)
      .then(() => Midi.prepareCopyInstrument(outputId, from))
      .then(() => Midi.copyInstrument(outputId, from, to))
      .then(() => this.getInstrumentData(to))
  },

  playInstrument (pos, note, volume) {
    const outputId = store.getters['settings/midiOutput'].id
    return Midi.playInstrument(outputId, pos, note, volume)
  },

  getAllInstrumentData () {
    return Helpers.delay(200)
      .then(() => DataSource.getInstrumentData(1))
      .then(() => DataSource.getInstrumentData(2))
      .then(() => DataSource.getInstrumentData(3))
      .then(() => DataSource.getInstrumentData(4))
      .then(() => DataSource.getInstrumentData(5))
      .then(() => DataSource.getInstrumentData(6))
      .then(() => DataSource.getInstrumentData(7))
      .then(() => DataSource.getInstrumentData(8))
  },

  clearAllInstrumentData () {
    store.commit('app/updateDeviceLoadedInstrument', { pos: 1, name: null })
    store.commit('app/updateDeviceLoadedInstrument', { pos: 2, name: null })
    store.commit('app/updateDeviceLoadedInstrument', { pos: 3, name: null })
    store.commit('app/updateDeviceLoadedInstrument', { pos: 4, name: null })
    store.commit('app/updateDeviceLoadedInstrument', { pos: 5, name: null })
    store.commit('app/updateDeviceLoadedInstrument', { pos: 6, name: null })
    store.commit('app/updateDeviceLoadedInstrument', { pos: 7, name: null })
    store.commit('app/updateDeviceLoadedInstrument', { pos: 8, name: null })
  },

  getCurrentMidiInputName () {
    const inputId = store.getters['settings/midiInput'].id
    if (inputId === undefined) return '-'
    return Midi.getInputName(inputId)
  },

  getCurrentMidiOutputName () {
    const outputId = store.getters['settings/midiOutput'].id
    if (outputId === undefined) return '-'
    return Midi.getOutputName(outputId)
  },

  // Settings

  loadSettings () {
    if (localStorage.getItem('settings')) {
      const allSettings = JSON.parse(localStorage.getItem('settings'))
      if (allSettings !== undefined) {
        store.commit('settings/setAllSettings', allSettings)
      }
    }
    console.warn('Settings loaded!')
    return Promise.resolve()
  },

  saveSettings () {
    localStorage.setItem('settings', JSON.stringify(store.getters['settings/allSettings']))
    const electron = require('electron')
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')
    console.log(userDataPath)
    console.log(localStorage.getItem('settings'))
  },

  initializeMidi () {
    console.warn('Initialize midi')
    console.log(store.getters['settings/midiOutput'].id)

    return Helpers.delay(100)
      .then(() => { return Midi.initialize(store.getters['settings/midiInput'].id) })
  },

  initializeEpsLin () {
    if (Helpers.isWindows()) return
    const epslin = store.getters['settings/workingDirectory'] + sep + store.getters['settings/epslin']
    if (FileSystem.isExecutable(epslin)) return
    console.warn('Initialize epslin executable rights')
    console.log(epslin)
    FileSystem.chmod(epslin, '500')
    return Promise.resolve()
  },

  initialize () {
    return this.loadSettings()
      .then(() => Helpers.delay(1000))
      .then(() => DataSource.initializeEpsLin())
      .then(() => DataSource.initializeMidi())
  }
}
