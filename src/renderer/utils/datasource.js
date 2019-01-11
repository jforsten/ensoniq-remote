import { spawn } from 'child_process'
import store from '../store/'

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
    var mediaExtension = store.getters['settings/mediaExtension']

    var fs = require('fs')
    var files = fs.readdirSync(mediaDirectory)

    var path = require('path')

    var mediaList = files.filter(function (file) {
      return path.extname(file).toLowerCase() === mediaExtension
    })

    return mediaList.map((name, index) => {
      var dict = {}
      dict['id'] = index
      dict['name'] = name
      return dict
    })
  }

}
