// import { spawn } from 'child_process'
import { Helpers } from '../../utils/helpers.js'
import { DataSource } from '../../utils/datasource'

export default {
  namespaced: true,

  state: {
    items: [],
    currentPath: '/',
    currentPathName: '/',
    currentMedia: '',
    mediaList: [],
    mediaDirectory: '/Users/jforsten/Projects/EpsLin/disks',
    epslin: '/Users/jforsten/Projects/EpsLin/epslin',
    workingDirectory: '/Users/jforsten/Projects/EpsLin',
    mediaExtension: '.img'
  },

  getters: {
    epslin: state => `${state.epslin}`,
    workingDirectory: state => `${state.workingDirectory}`,
    mediaDirectory: state => `${state.mediaDirectory}`,

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
        // parent dir
        commit('updateCurrentPath', Helpers.parent_dir(state.currentPath))
        commit('updateCurrentPathName', Helpers.parent_dir(state.currentPathName))
      } else {
        if (dirId === '/') {
          // root dir
          commit('updateCurrentPath', '/')
          commit('updateCurrentPathName', '/')
        } else if (state.currentPath === '/') {
          // from root dir
          commit('updateCurrentPath', '/' + dirId)
          name = state.items.find(function (item) { return item.index === dirId }).name.trim()
          commit('updateCurrentPathName', '/' + Helpers.capital_letter(name))
        } else {
          // "normal" case
          commit('updateCurrentPath', state.currentPath + '/' + dirId)
          name = state.items.find(function (item) { return item.index === dirId }).name.trim()
          commit('updateCurrentPathName', state.currentPathName + '/' + Helpers.capital_letter(name))
        }
      }
      DataSource.fetchData(state.currentPath).then(items => { commit('updateItems', items) })
    },

    goParentDir ({commit, state}) {
      commit('updateCurrentPath', Helpers.parent_dir(state.currentPath))
      commit('updateCurrentPathName', Helpers.parent_dir(state.currentPathName))
      DataSource.fetchData(state.currentPath).then(items => { commit('updateItems', items) })
    }
  }
}
