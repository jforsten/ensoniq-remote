import store from '../store/'
import { spawn } from 'child_process'
import { sep } from 'path'

export const EpsLin = {
  // Properties
  get media () {
    var currentMedia = store.getters['browser/currentMedia']
    var mediaDirectory = store.getters['settings/mediaDirectory']
    return mediaDirectory + sep + currentMedia
  },

  get epslin () {
    return store.getters['settings/epslin']
  },

  get workingDirectory () {
    return store.getters['settings/workingDirectory']
  },

  // Methods
  wrapper (args) {
    return new Promise((resolve, reject) => {
      const p = spawn(this.epslin, args, { cwd: this.workingDirectory })
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

  getDir (path) {
    return this.wrapper([
      '-J',
      '-d' + path,
      this.media
    ])
  }
}
