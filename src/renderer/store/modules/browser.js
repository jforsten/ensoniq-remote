import { spawn } from 'child_process'

export default {
  namespaced: true,

  state: {
    items: [],
    currentPath: '/',
    currentMedia: './TheArtOfTranswaves.iso',
    mediaList: ['./TheArtOfTranswaves.iso', './PellePiano_Demos.iso']
  },

  getters: {
    items: state => `${state.items}`,
    currentPath: state => `${state.currentPath}`,
    currentMedia: state => `${state.currentMedia}`,
    mediaList: state => `${state.mediaList}`
  },

  mutations: {
    updateItems (state, items) {
      state.items = items
    },
    updateCurrentPath (state, path) {
      state.currentPath = path
    },
    updateCurrentMedia (state, media) {
      state.currentMedia = media
    },
    updateMediaList (state) {
      var fs = require('fs')
      var files = fs.readdirSync('/Users/jforsten/Projects/EpsLin')

      var path = require('path')
      var EXTENSION = '.iso'

      var mediaList = files.filter(function (file) {
        return path.extname(file).toLowerCase() === EXTENSION
      })
      state.mediaList = mediaList
    }
  },

  actions: {

    updateItems (context, items) {
      context.commit('updateItems', items)
    },

    updateCurrentPath (context, path) {
      context.commit('updateCurrentPath', path)
    },

    updateCurrentMedia (context, media) {
      context.commit('updateCurrentMedia', media)
    },

    updateMediaList (context) {
      context.commit('updateMediaList')
    },

    goDir ({commit, state}, dirId) {
      console.log('goDir' + dirId)

      if (dirId === '..') {
        var pathParts = state.currentPath.split('/')
        pathParts.pop()
        pathParts = pathParts.join('/')
        var path = pathParts
        if (path === '') path = '/'
        commit('updateCurrentPath', path)

        const p = spawn('./epslin', ['-J', '-d' + path, state.currentMedia], { cwd: '/Users/jforsten/Projects/EpsLin' })
        p.stdout.on('data', (data) => { commit('updateItems', JSON.parse(data).items) })
        p.stderr.on('data', (data) => { console.log('stderr: ' + data) })
        return
      }

      if (dirId === '/') {
        commit('updateCurrentPath', '/')
      } else if (state.currentPath === '/') {
        commit('updateCurrentPath', '/' + dirId)
      } else {
        commit('updateCurrentPath', state.currentPath + '/' + dirId)
      }

      const p = spawn('./epslin', ['-J', '-d' + state.currentPath, state.currentMedia], { cwd: '/Users/jforsten/Projects/EpsLin' })
      p.stdout.on('data', (data) => { commit('updateItems', JSON.parse(data).items) })
      p.stderr.on('data', (data) => { console.log('stderr: ' + data) })
    },

    goParentDir ({commit, state}) {
      var pathParts = state.currentPath.split('/')
      pathParts.pop()
      pathParts = pathParts.join('/')
      var path = pathParts
      if (path === '') path = '/'
      commit('updateCurrentPath', path)

      const p = spawn('./epslin', ['-J', '-d' + path, state.currentMedia], { cwd: '/Users/jforsten/Projects/EpsLin' })
      p.stdout.on('data', (data) => { commit('updateItems', JSON.parse(data).items) })
      p.stderr.on('data', (data) => { console.log('stderr: ' + data) })
    }
  }
}
