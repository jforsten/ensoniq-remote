module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        win: {
          extraResources: ['./workingDir_win32/**'],
          requestedExecutionLevel: 'highestAvailable'
        },
        mac: {
          extraResources: ['./workingDir_darwin/**']
        },
        linux: {
          extraResources: ['./workingDir_linux/**']
        }
      }
    }
  }
}
