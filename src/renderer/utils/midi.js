import WebMidi from '../../webmidi'

export const Midi = {

  getPorts () {
    return new Promise((resolve, reject) => {
      if (WebMidi.enabled) {
        resolve({ins: this.internalGetMidiIns(), outs: this.internalGetMidiOuts()})
        return
      }
      WebMidi.enable(function (err) {
        if (err) {
          console.error('WebMidi could not be enabled.', err)
          reject(err)
        } else {
          resolve({ins: this.internalGetMidiIns(), outs: this.internalGetMidiOuts()})
        }
      }, true)
    })
  },

  internalGetMidiIns () {
    return WebMidi.inputs.map(i => {
      var dict = {}
      dict['id'] = i.id
      dict['name'] = i.name
      return dict
    })
  },

  internalGetMidiOuts () {
    return WebMidi.outputs.map(i => {
      var dict = {}
      dict['id'] = i.id
      dict['name'] = i.name
      return dict
    })
  },

  sendLoadInstrumentCmdViaMidi (pos) {
    return new Promise((resolve, reject) => {
      console.log('Send midi to load inst to pos ' + pos)
      resolve()
    })
  }
}
