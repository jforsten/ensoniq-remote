import { DataSource } from '@/utils/datasource'

export default {
  namespaced: true,

  state: {
    ensoniqDevice: 'ASR10',
    baseChannel: 1,
    midiInput: { id: undefined, name: '' },
    midiOutput: { id: undefined, name: '' },
    mediaDirectory: '/Users/jforsten/Projects/epslin/media',
    workingDirectory: './workingDir',
    ensoniqStorageDevice: '/dev/ensoniqDevice',
    ensoniqDisks: [],
    epslin: 'epslin'
  },

  getters: {
    allSettings: state => {
      return {
        ensoniqDevice: state.ensoniqDevice,
        baseChannel: state.baseChannel,
        midiInput: state.midiInput,
        midiOutput: state.midiOutput,
        mediaDirectory: state.mediaDirectory,
        workingDirectory: state.workingDirectory,
        ensoniqStorageDevice: state.ensoniqStorageDevice,
        ensoniqDisks: state.ensoniqDisks,
        epslin: state.epslin
      }
    },
    ensoniqDevice: state => `${state.ensoniqDevice}`,
    baseChannel: state => `${state.baseChannel}`,
    midiInput: state => { return state.midiInput },
    midiOutput: state => { return state.midiOutput },
    epslin: state => `${state.epslin}`,
    ensoniqStorageDevice: state => `${state.ensoniqStorageDevice}`,
    ensoniqDisks: state => `${state.ensoniqDisks}`,
    workingDirectory: state => `${state.workingDirectory}`,
    mediaDirectory: state => `${state.mediaDirectory}`
  },

  mutations: {
    setAllSettings (state, settings) {
      state.ensoniqDevice = settings.ensoniqDevice
      state.baseChannel = settings.baseChannel
      state.midiInput = settings.midiInput
      state.midiOutput = settings.midiOutput
      state.mediaDirectory = settings.mediaDirectory
      state.workingDirectory = settings.workingDirectory
      state.ensoniqStorageDevice = settings.ensoniqStorageDevice
      state.ensoniqDisks = settings.ensoniqDisks
      state.epslin = settings.epslin
      DataSource.getMediaList(settings.mediaDirectory)
    },
    updateEnsoniqDevice (state, dev) {
      state.ensoniqDevice = dev
    },
    updateBaseChannel (state, channel) {
      state.baseChannel = channel
    },
    updateMidiInput (state, input) {
      state.midiInput = input
    },
    updateMidiOutput (state, output) {
      state.midiOutput = output
    },
    updateMediaDirectory (state, path) {
      state.mediaDirectory = path
      DataSource.getMediaList(path)
    },
    updateWorkingDirectory (state, path) {
      state.workingDirectory = path
    },
    updateEnsoniqStorageDevice (state, path) {
      state.ensoniqStorageDevice = path
    },
    updateEnsoniqDisks (state, list) {
      state.ensoniqDisks = list
    },
    updateEpslin (state, path) {
      state.epslin = path
    }
  },

  actions: {
    setAllSettings ({ commit }, settings) {
      commit('setAllSettings', settings)
    },
    updateEnsoniqDevice ({ commit }, dev) {
      commit('updateEnsoniqDevice', dev)
    },
    updateBaseChannel ({ commit }, channel) {
      commit('updateBaseChannel', channel)
    },
    updateMidiInput ({ commit }, id) {
      commit('updateMidiInput', id)
    },
    updateMidiOutput ({ commit }, id) {
      commit('updateMidiOutput', id)
    },
    updateMediaDirectory (context, path) {
      context.commit('updateMediaDirectory', path)
    },
    updateWorkingDirectory (context, path) {
      context.commit('updateWorkingDirectory', path)
    },
    updateEnsoniqStorageDevice (context, path) {
      context.commit('updateEnsoniqStorageDevice', path)
    },
    updateEnsoniqDisks (context, list) {
      context.commit('updateEnsoniqDisks', list)
    },
    updateEpslin (context, path) {
      context.commit('updateEpslin', path)
    }
  }
}