import WebMidi from '../../../webmidi'

export default {
  namespaced: true,

  state: {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@morningstar.com',
    midiInputs: {},
    midiOutputs: []
  },

  getters: {
    fullname: state => `${state.firstname} ${state.lastname} ${state.email}`,
    midiInputs: state => {
      console.log('getter:' + state.midiInputs)
      return state.midiInputs
    },
    midiOutputs: state => `${state.midiOutputs}`
  },

  mutations: {
    updatemail (state, email) {
      state.email = email
    },
    updateMidiPorts (state, inputs) {
      state.midiInputs = inputs
    }
  },

  actions: {
    emailupdate (context, email) {
      context.commit('updatemail', email)
    },
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
          midiOutputs = WebMidi.outputs
          context.commit('updateMidiPorts', JSON.stringify(midiInputs))
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
            midiOutputs = WebMidi.outputs
            commit('updateMidiPorts', JSON.stringify(midiInputs))
            resolve()
          }
        }, true)
      })
    }
  }
}
