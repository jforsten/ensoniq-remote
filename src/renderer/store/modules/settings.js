// import { stat } from "fs"

export default {
  namespaced: true,

  state: {
    ensoniqDevice: 'ASR10',
    baseChannel: 1,
    midiInput: undefined,
    midiOutput: undefined,
    mediaDirectory: '/Users/jforsten/Projects/epslin/media',
    workingDirectory: './workingDir',
    ensoniqStorageDevice: '/dev/ensoniqDevice',
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
        epslin: state.epslin
      }
    },
    ensoniqDevice: state => `${state.ensoniqDevice}`,
    baseChannel: state => `${state.baseChannel}`,
    midiInput: state => `${state.midiInput}`,
    midiOutput: state => `${state.midiOutput}`,
    epslin: state => `${state.epslin}`,
    ensoniqStorageDevice: state => `${state.ensoniqStorageDevice}`,
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
      state.epslin = settings.epslin
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
    },
    updateWorkingDirectory (state, path) {
      state.workingDirectory = path
    },
    updateEnsoniqStorageDevice (state, path) {
      state.ensoniqStorageDevice = path
    },
    updateEpslin (state, path) {
      state.epslin = path
    }
  },

  actions: {
    setAllSettings ({commit}, settings) {
      commit('setAllSettings', settings)
    },
    updateEnsoniqDevice ({commit}, dev) {
      commit('updateEnsoniqDevice', dev)
    },
    updateBaseChannel ({commit}, channel) {
      commit('updateBaseChannel', channel)
    },
    updateMidiInput ({commit}, id) {
      commit('updateMidiInput', id)
    },
    updateMidiOutput ({commit}, id) {
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
    updateEpslin (context, path) {
      context.commit('updateEpslin', path)
    }
  }
}
