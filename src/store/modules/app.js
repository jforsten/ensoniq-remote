import { Helpers } from '@/utils/helpers.js'
import { DataSource } from '@/utils/datasource'
import { Error } from '@/utils/error'
import Vue from 'vue'
import { sep } from 'path'
import store from '@/store/'

export default {
  namespaced: true,

  state: {
    items: [],
    currentPath: '/',
    currentPathName: '/',
    currentMediaId: '',
    currentMedia: '',
    currentMediaLabel: '',
    mediaList: [],
    deviceLoadedInstruments: [null, null, null, null, null, null, null, null],
    errorMessage: ''
  },

  getters: {
    items: state => `${state.items}`,
    currentPath: state => `${state.currentPath}`,
    currentMediaId: state => `${state.currentMediaId}`,
    currentMedia: state => `${state.currentMedia}`,
    currentMediaLabel: state => `${state.currentMediaLabel}`,
    mediaList: state => `${state.mediaList}`,
    deviceLoadedInstruments: state => `${state.deviceLoadedInstruments}`,
    errorMessage: state => `${state.errorMessage}`
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
    updateCurrentMediaId (state, id) {
      state.currentMediaId = id
      // Update also current media path
      state.currentMedia = store.getters['settings/mediaDirectory'] + sep + state.mediaList.find(item => { return item.id === state.currentMediaId }).name
    },
    updateCurrentMedia (state, name) {
      state.currentMedia = name
    },
    updateCurrentMediaLabel (state, label) {
      state.currentMediaLabel = label
    },
    updateMediaList (state, mediaList) {
      state.mediaList = mediaList
    },
    updateDeviceLoadedInstruments (state, instruments) {
      state.deviceLoadedInstruments = instruments
    },
    updateDeviceLoadedInstrument (state, data) {
      console.log(data)
      Vue.set(state.deviceLoadedInstruments, data.pos - 1, data.name)
    },
    updateErrorMessage (state, message) {
      state.errorMessage = message
    }
  },

  actions: {
    updateItems (context, items) {
      context.commit('updateItems', items)
    },

    updateCurrentPath (context, path) {
      context.commit('updateCurrentPath', path)
    },

    updateCurrentMediaId (context, id) {
      context.commit('updateCurrentMediaId', id)
    },

    updateCurrentMedia (context, name) {
      context.commit('updateCurrentMedia', name)
    },

    updateCurrentMediaLabel (context, label) {
      context.commit('updateCurrentMediaLabel', label)
    },

    updateMediaList (context, mediaList) {
      context.commit('updateMediaList', mediaList)
    },

    updateDeviceLoadedInstruments (context, instruments) {
      context.commit('updateDeviceLoadedInstruments', instruments)
    },

    updateErrorMessage (context, message) {
      context.commit('updateErrorMessage', message)
    },

    goDir ({ commit, state }, dirId) {
      let name
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
      DataSource.getDirectoryInfoFromEnsoniaMedia(state.currentPath).then(data => {
        commit('updateItems', data.items)
        commit('updateCurrentMediaLabel', data.label)
      }).catch(err => {
        console.log(err)
        Error.show(err)
      })
    },

    goParentDir ({ commit, state }) {
      commit('updateCurrentPath', Helpers.parent_dir(state.currentPath))
      commit('updateCurrentPathName', Helpers.parent_dir(state.currentPathName))
      DataSource.getDirectoryInfoFromEnsoniaMedia(state.currentPath).then(data => {
        commit('updateItems', data.items)
        commit('updateCurrentMediaLabel', data.label)
      }).catch(err => {
        console.log(err)
        Error.show(err)
      })
    }
  }
}
