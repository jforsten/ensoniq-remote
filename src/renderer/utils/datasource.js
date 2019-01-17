import store from '../store/'

import { spawn } from 'child_process'
import WebMidi from '../../webmidi'

export const DataSource = {

  fetchData (path) {
    var epslin = store.getters['settings/epslin']
    var currentMedia = store.getters['browser/currentMedia']
    var workingDirectory = store.getters['settings/workingDirectory']
    var mediaDirectory = store.getters['settings/mediaDirectory']

    return new Promise((resolve, reject) => {
      const p = spawn(epslin, ['-J', '-d' + path, mediaDirectory + '/' + currentMedia], { cwd: workingDirectory })
      p.stdout.on('data', (data) => {
        resolve(JSON.parse(data).items)
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

  getMidiPorts () {
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
  }
}
