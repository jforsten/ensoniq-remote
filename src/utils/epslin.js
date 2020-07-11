import store from '@/store/'
import { spawn } from 'child_process'
// import { sep } from 'path'

// Internal properties

var settings = {
  get epslinExecutable () { return store.getters['settings/epslin'] },
  get workingDirectory () { return store.getters['settings/workingDirectory'] },
  get ensoniqStorageDevice () { return store.getters['settings/ensoniqStorageDevice'] },
  get media () {
    var currentMedia = store.getters['app/currentMedia']
    console.log(currentMedia)
    // var mediaDirectory = store.getters['settings/mediaDirectory']
    return currentMedia // mediaDirectory + sep + currentMedia
  }
}

// Internal methods

const epslin = function (args, expectJson = false) {
  return new Promise((resolve, reject) => {
    const p = spawn(settings.epslinExecutable, args, { cwd: settings.workingDirectory })
    if (expectJson === false) {
      p.on('exit', () => {
        resolve()
      })
    } else {
      p.stdout.on('data', (data) => {
        var jsonString = new TextDecoder('utf-8').decode(data)
        jsonString = jsonString.split('\\').join('\\\\')
        resolve(JSON.parse(jsonString))
      })
    }
    p.stderr.on('data', (data) => {
      console.error('stderr: ' + data)
      reject(data)
    })
  })
}

// External API

export const EpsLin = {

  // Methods

  getDir (path) {
    console.log('EpsLin: getDir path:' + path)
    return epslin([
      '-J',
      '-d' + path,
      settings.media
    ], true)
  },

  getEfe (path, idx) {
    console.log('EpsLin: getEfe path:' + path + ' idx:' + idx)
    return epslin([
      '-d' + path,
      '-g' + idx,
      settings.media
    ])
  },

  putEfe (filename) {
    console.log('EpsLin: putEfe filename:' + filename)
    return epslin([
      '-p1',
      settings.ensoniqStorageDevice,
      filename
    ])
  },

  eraseEfe () {
    console.log('EpsLin: clearEfes')
    return epslin([
      '-e1',
      settings.ensoniqStorageDevice
    ])
  }
}
