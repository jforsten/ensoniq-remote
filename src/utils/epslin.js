import store from '@/store/'
import { spawn } from 'child_process'
// import { execFile } from 'child_process'

// Internal properties

const settings = {
  get epslinExecutable () { return store.getters['settings/epslin'] },
  get workingDirectory () { return store.getters['settings/workingDirectory'] },
  get ensoniqStorageDevice () { return store.getters['settings/ensoniqStorageDevice'] },
  get media () {
    const currentMedia = store.getters['app/currentMedia']
    console.log(currentMedia)
    return currentMedia
  }
}

// Internal methods

// ExecFile version is unreliable in Windows so continue to investigate...
/*
const epslin = function (args, expectJson = false) {
  return new Promise((resolve, reject) => {
    console.log('ExecFile')
    execFile(settings.epslinExecutable, args, { cwd: settings.workingDirectory },
      (error, stdout, stderr) => {
        if (error) {
          console.error(error)
          reject(error)
          return
        }
        var jsonString = stdout // new TextDecoder('utf-8').decode(stdout)
        console.log(jsonString)
        jsonString = jsonString.split('\\').join('\\\\')
        try {
          var ret = JSON.parse(jsonString)
          console.log('JSON')
          resolve(ret)
        } catch (e) {
          if (expectJson === false) {
            console.warn('NO JSON')
            resolve()
          } else {
            console.error('ERROR in JSON')
            reject(stdout)
          }
        }
      })
  })
}
*/

const epslin = function (args, expectJson = false) {
  return new Promise((resolve, reject) => {
    // Cannot use "on exit/close" (does not work in Win) so hackish solution to use just stdout callback
    const p = spawn(settings.epslinExecutable, args, { cwd: settings.workingDirectory })

    p.stdout.on('data', (data) => {
      let jsonString = new TextDecoder('utf-8').decode(data)
      jsonString = jsonString.split('\\').join('\\\\')
      try {
        const ret = JSON.parse(jsonString)
        resolve(ret)
      } catch (e) {
        if (expectJson === false) {
          resolve()
        } else {
          reject(data)
        }
      }
    })

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

  putEfe (filename, idx = 1) {
    console.log('EpsLin: putEfe filename:' + filename + ' to idx: ' + idx)
    return epslin([
      '-p' + idx,
      settings.ensoniqStorageDevice,
      filename
    ])
  },

  eraseEfe (idx = 1) {
    console.log('EpsLin: clearEfe at idx:' + idx)
    return epslin([
      '-e' + idx,
      settings.ensoniqStorageDevice
    ])
  }
}
