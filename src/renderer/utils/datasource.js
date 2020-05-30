import store from '../store/'

import { spawn } from 'child_process'
import WebMidi from '../../webmidi'

export const DataSource = {

  // Storage

  fetchData (path) {
    var epslin = store.getters['settings/epslin']
    var currentMedia = store.getters['browser/currentMedia']
    var workingDirectory = store.getters['settings/workingDirectory']
    var mediaDirectory = store.getters['settings/mediaDirectory']

    return new Promise((resolve, reject) => {
      const p = spawn(epslin, ['-J', '-d' + path, mediaDirectory + '\\' + currentMedia], { cwd: workingDirectory })
      p.stdout.on('data', (data) => {
        var jsonString = new TextDecoder('utf-8').decode(data)
        jsonString = jsonString.split('\\').join('\\\\')
        resolve(JSON.parse(jsonString).items)
      })
      p.stderr.on('data', (data) => {
        console.error('stderr: ' + data)
        reject(data)
      })
    })
  },

  getMediaList () {
    var mediaDirectory = store.getters['settings/mediaDirectory']

    var fs = require('fs')
    var mediaList = fs.readdirSync(mediaDirectory)

    return mediaList.map((name, index) => {
      var dict = {}
      dict['id'] = index
      dict['name'] = name
      return dict
    })
  },

  getInstrumentFromEnsoniqMedia () { },

  clearWorkingDir () { },

  clearEnsoniqStorage () { },

  putInstrumentToEnsoniqStorage () {
    var epslin = store.getters['settings/epslin']
    // var currentMedia = store.getters['browser/currentMedia']
    var workingDirectory = store.getters['settings/workingDirectory']
    // var mediaDirectory = store.getters['settings/mediaDirectory']
    var ensoniqStorageDevice = store.getters['settings/ensoniqStorageDevice']

    return new Promise((resolve, reject) => {
      const p = spawn(epslin, [ensoniqStorageDevice], { cwd: workingDirectory })
      p.stdout.on('data', (data) => {
        var str = new TextDecoder('utf-8').decode(data)
        console.log(str)
        resolve()
      })
      p.stderr.on('data', (data) => {
        console.error('stderr: ' + data)
        reject(data)
      })
    })
  },

  // Midi

  getMidiPorts () {
    console.log('getMidiPorts')
    return new Promise((resolve, reject) => {
      if (WebMidi.enabled) {
        resolve({ins: DataSource.internalGetMidiIns(), outs: DataSource.internalGetMidiOuts()})
        return
      }
      WebMidi.enable(function (err) {
        if (err) {
          console.error('WebMidi could not be enabled.', err)
          reject(err)
        } else {
          resolve({ins: DataSource.internalGetMidiIns(), outs: DataSource.internalGetMidiOuts()})
        }
      }, true)
    })
  },

  internalGetMidiIns () {
    return WebMidi.inputs.map(i => {
      var dict = {}
      dict['id'] = i.id
      dict['name'] = i.name
      return dict
    })
  },

  internalGetMidiOuts () {
    return WebMidi.outputs.map(i => {
      var dict = {}
      dict['id'] = i.id
      dict['name'] = i.name
      return dict
    })
  },

  sendLoadInstrumentCmdViaMidi () { },

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
  }

}
