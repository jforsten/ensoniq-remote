export const FileSystem = {
  ls (path) {
    require('fs').readdirSync(path)
  },
  rm (path) {
    require('fs').unlinkSync(path)
  },
  chmod (path, mode) {
    require('fs').chmodSync(path, mode)
  },
  exists (path) {
    try {
      var fs = require('fs')
      fs.accessSync(path, fs.constants.F_OK)
      console.log('file exists')
      return true
    } catch (err) {
      console.error(path + ' - file not found!')
      return false
    }
  },
  isDirectory (path) {
    return require('fs').lstatSync(path).isDirectory()
  },
  hasAccess (path) {
    try {
      var fs = require('fs')
      fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK)
      console.log('can read/write')
      return true
    } catch (err) {
      console.error('no access to ' + path)
      return false
    }
  },
  sudo (cmd) {
    var sudo = require('sudo-prompt')
    var options = {
      name: 'Ensoniq Remote'
    }
    sudo.exec(cmd, options,
      function (error, stdout, stderr) {
        if (error) throw error
        console.log('stdout: ' + stdout)
      }
    )
  }
}