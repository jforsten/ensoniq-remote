// import { stat } from "fs"

export default {
  namespaced: true,

  state: {
    ensoniqDevice: undefined,
    midiInput: undefined,
    midiOutput: undefined,
    mediaDirectory: '/Users/jforsten/Projects/epslin/media',
    workingDirectory: '/Users/jforsten/Projects/epslin/temp',
    ensoniqStorageDevice: '/dev/ensoniqDevice',
    epslin: '/Users/jforsten/Projects/epslin/epslin'
  },

  getters: {
    allSettings: state => {
      return {
        ensoniqDevice: state.ensoniqDevice,
        midiInput: state.midiInput,
        midiOutput: state.midiOutput,
        mediaDirectory: state.mediaDirectory,
        workingDirectory: state.workingDirectory,
        ensoniqStorageDevice: state.ensoniqStorageDevice,
        epslin: state.epslin
      }
    },
    ensoniqDevice: state => `${state.ensoniqDevice}`,
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
    updateMidiInput ({commit}, id) {
      commit('updateMidiInput', id)
    },
    updateEnsoniqDevice ({commit}, dev) {
      commit('updateEnsoniqDevice', dev)
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
