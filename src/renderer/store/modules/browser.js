import { Helpers } from '../../utils/helpers.js'
import { DataSource } from '../../utils/datasource'

export default {
  namespaced: true,

  state: {
    items: [],
    currentPath: '/',
    currentPathName: '/',
    currentMediaId: '',
    currentMedia: '',
    mediaList: []
  },

  getters: {
    items: state => `${state.items}`,
    currentPath: state => `${state.currentPath}`,
    currentMediaId: state => `${state.currentMediaId}`,
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
    updateCurrentMediaId (state, id) {
      state.currentMediaId = id
      state.currentMedia = state.mediaList.find(item => { return item.id === state.currentMediaId }).name
    },
    updateMediaList (state) {
      // ToDo change so that DataSource will call action..
      state.mediaList = DataSource.getMediaList()
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

    updateMediaList (context) {
      context.commit('updateMediaList')
    },

    goDir ({commit, state}, dirId) {
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
