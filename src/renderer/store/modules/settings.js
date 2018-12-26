import WebMidi from '../../../webmidi'

export default {
  namespaced: true,

  state: {
    midiInputs: [],
    midiOutputs: [],
    midiInput: undefined,
    midiOutput: undefined
  },

  getters: {
    midiInputs: state => {
      console.log('getter:' + state.midiInputs)
      return state.midiInputs
    },
    midiOutputs: state => {
      console.log('getter:' + state.midiOutputs)
      return state.midiOutputs
    }
  },

  mutations: {
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
    }
  },

  actions: {
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
    }
  }
}
