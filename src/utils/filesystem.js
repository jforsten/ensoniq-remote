export const filesystem = {
  ls (path) {
    require('fs').readdirSync(path)
  },
  rm (path) {
    require('fs').unlinkSync(path)
  },
  chmod (path, mode) {
    require('fs').chmodSync(path, mode)
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
