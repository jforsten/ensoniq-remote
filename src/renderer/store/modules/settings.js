import WebMidi from '../../../webmidi'

export default {
  namespaced: true,

  state: {
    midiInputs: [],
    midiOutputs: [],
    midiInput: undefined,
    midiOutput: undefined,

    mediaDirectory: '/Users/jforsten/Projects/epslin/media',
    workingDirectory: '/Users/jforsten/Projects/epslin/temp',
    epslin: '/Users/jforsten/Projects/epslin/epslin'
  },

  getters: {

    allSettings: state => {
      return {
        midiInput: state.midiInput,
        midiOutput: state.midiOutput,
        mediaDirectory: state.mediaDirectory,
        workingDirectory: state.workingDirectory,
        epslin: state.epslin
      }
    },

    midiInputs: state => {
      console.log('getter:' + state.midiInputs)
      return state.midiInputs
    },
    midiOutputs: state => {
      console.log('getter:' + state.midiOutputs)
      return state.midiOutputs
    },
    epslin: state => `${state.epslin}`,
    workingDirectory: state => `${state.workingDirectory}`,
    mediaDirectory: state => `${state.mediaDirectory}`
  },

  mutations: {
    setAllSettings (state, settings) {
      state.midiInput = settings.midiInput
      state.midiOutput = settings.midiOutput
      state.mediaDirectory = settings.mediaDirectory
      state.workingDirectory = settings.workingDirectory
      state.epslin = settings.epslin
    },

    updateMidiInputs (state, inputs) {
      state.midiInputs = inputs
    },
    updateMidiOutputs (state, outputs) {
      state.midiOutputs = outputs
    },
    selectMidiInput (state, id) {
      var input = state.midiInputs.find(function (item) { return item.id === id })
      state.midiInput = input
    },
    selectMidiOutput (state, id) {
      var output = state.midiOutputs.find(function (item) { return item.id === id })
      state.midiOutput = output
    },
    updateMediaDirectory (state, path) {
      state.mediaDirectory = path
    },
    updateWorkingDirectory (state, path) {
      state.workingDirectory = path
    },
    updateEpslin (state, path) {
      state.epslin = path
    }
  },

  actions: {

    setAllSettings ({commit}, settings) {
      commit('setAllSettings', settings)
    },

    selectMidiInput ({commit}, id) {
      commit('selectMidiInput', id)
    },

    selectMidiOutput ({commit}, id) {
      commit('selectMidiOutput', id)
    },

    asyncMidiPortsUpdate ({ commit }) {
      console.log('midiupdate called 1')

      return new Promise((resolve, reject) => {
        console.log('midiupdate called 2')
        var midiInputs = []
        var midiOutputs = []

        if (WebMidi.enabled) {
          resolve()
          return
        }

        WebMidi.enable(function (err) {
          if (err) {
            console.log('WebMidi could not be enabled.', err)
            commit('updateMidiInputs', midiInputs)
            commit('updateMidiOutputs', midiOutputs)
            reject(err)
          } else {
            midiInputs = WebMidi.inputs.map(i => {
              var dict = {}
              dict['id'] = i.id
              dict['name'] = i.name
              return dict
            })
            midiOutputs = WebMidi.outputs.map(i => {
              var dict = {}
              dict['id'] = i.id
              dict['name'] = i.name
              return dict
            })
            commit('updateMidiInputs', midiInputs)
            commit('updateMidiOutputs', midiOutputs)
            resolve()
          }
        }, true)
      })
    },
    updateMediaDirectory (context, path) {
      context.commit('updateMediaDirectory', path)
    },
    updateWorkingDirectory (context, path) {
      context.commit('updateWorkingDirectory', path)
    },
    updateEpslin (context, path) {
      context.commit('updateEpslin', path)
    }
  }
}
