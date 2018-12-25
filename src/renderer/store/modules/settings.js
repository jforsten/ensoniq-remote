import WebMidi from '../../../webmidi'

export default {
  namespaced: true,

  state: {
    midiInputs: {},
    midiOutputs: {}
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
    }

  },

  actions: {
    midiPortsUpdate (context) {
      console.log('midiupdate called')
      var midiInputs = []
      var midiOutputs = []

      WebMidi.enable(function (err) {
        if (err) {
          console.log('WebMidi could not be enabled.', err)
          context.commit('updateMidiPorts', midiInputs, midiOutputs)
        } else {
          console.log('WebMidi enabled!')
          console.log('Midi ins:' + WebMidi.inputs.length)
          console.log(WebMidi.inputs)
          console.log(WebMidi.inputs[0].name)
          console.log(WebMidi.outputs)
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
          context.commit('updateMidiInputs', JSON.stringify(midiInputs))
          context.commit('updateMidiOutputs', JSON.stringify(midiOutputs))
        }
      }, true)
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
            commit('updateMidiPorts', midiInputs, midiOutputs)
            reject(err)
          } else {
            console.log('WebMidi enabled!')
            console.log('Midi ins:' + WebMidi.inputs.length)
            console.log(WebMidi.inputs)
            console.log(WebMidi.inputs[0].name)
            console.log(WebMidi.outputs)
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
            commit('updateMidiInputs', JSON.stringify(midiInputs))
            commit('updateMidiOutputs', JSON.stringify(midiOutputs))
            resolve()
          }
        }, true)
      })
    }
  }
}
