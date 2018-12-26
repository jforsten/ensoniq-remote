import { spawn } from 'child_process'
import { Helpers } from '../../utils/helpers.js'

export default {
  namespaced: true,

  state: {
    items: [],
    currentPath: '/',
    currentPathName: '/',
    currentMedia: '',
    mediaList: [],
    mediaDirectory: '/Users/jforsten/Projects/EpsLin',
    epslin: '/Users/jforsten/Projects/EpsLin/epslin',
    workingDirectory: '/Users/jforsten/Projects/EpsLin',
    mediaExtension: '.iso'
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
    updateCurrentPathName (state, path) {
      state.currentPathName = path
    },
    updateCurrentMedia (state, media) {
      state.currentMedia = media
    },
    updateMediaList (state) {
      var fs = require('fs')
      var files = fs.readdirSync(state.mediaDirectory)

      var path = require('path')
      var EXTENSION = state.mediaExtension

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
      var name

      if (dirId === '..') {
        var pathParts = state.currentPath.split('/')
        pathParts.pop()
        pathParts = pathParts.join('/')
        var path = pathParts
        if (path === '') path = '/'

        commit('updateCurrentPath', path)

        const p = spawn(state.epslin, ['-J', '-d' + path, state.currentMedia], { cwd: state.workingDirectory })
        p.stdout.on('data', (data) => { commit('updateItems', JSON.parse(data).items) })
        p.stderr.on('data', (data) => { console.log('stderr: ' + data) })

        pathParts = state.currentPathName.split('/')
        pathParts.pop()
        pathParts = pathParts.join('/')
        path = pathParts
        if (path === '') path = '/'

        commit('updateCurrentPathName', path)
        return
      }

      if (dirId === '/') {
        commit('updateCurrentPath', '/')
        commit('updateCurrentPathName', '/')
      } else if (state.currentPath === '/') {
        commit('updateCurrentPath', '/' + dirId)
        name = state.items.find(function (item) { return item.index === dirId }).name.trim()
        commit('updateCurrentPathName', '/' + Helpers.capital_letter(name))
      } else {
        commit('updateCurrentPath', state.currentPath + '/' + dirId)
        name = state.items.find(function (item) { return item.index === dirId }).name.trim()
        commit('updateCurrentPathName', state.currentPathName + '/' + Helpers.capital_letter(name))
      }

      const p = spawn(state.epslin, ['-J', '-d' + state.currentPath, state.currentMedia], { cwd: state.workingDirectory })
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

      const p = spawn(state.epslin, ['-J', '-d' + path, state.currentMedia], { cwd: state.workingDirectory })
      p.stdout.on('data', (data) => { commit('updateItems', JSON.parse(data).items) })
      p.stderr.on('data', (data) => { console.log('stderr: ' + data) })
    }
  }
}
