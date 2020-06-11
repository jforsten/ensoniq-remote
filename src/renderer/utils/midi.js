import WebMidi from '../../webmidi'

var input

export const Midi = {

  test () {

  },

  setup () {
    input = WebMidi.getInputByName('USB Uno MIDI Interface')
    console.log('input:' + input.name)
    WebMidi.addListener('connected', function (e) {
      console.log('connected:' + input.name)
      input.addListener('pitchbend', 'all', function (e) {
        console.log('Pitch value: ' + e.value)
      })
      input.addListener('sysex', 'all', function (e) {
        console.log('sysex input:')
        console.log(e)
      })
      console.log('Added listeners')
    })
  },

  enable () {
    if (WebMidi.enabled) {
      console.log('enabled')
      console.log('input--:' + input.name)
      console.log('enable - enabled:' + WebMidi.enabled)
      console.log('sysex:' + WebMidi.sysexEnabled)
      console.log('inputs:' + WebMidi.inputs)
      console.log('outputs:' + WebMidi.outputs)
      setTimeout(this.setup, 100)
      return
    }
    WebMidi.enable((err) => {
      if (err) {
        console.error('WebMidi could not be enabled.', err)
      } else {
        console.log('enable - enabled:' + WebMidi.enabled)
        console.log('sysex:' + WebMidi.sysexEnabled)
        console.log('inputs:' + WebMidi.inputs)
        console.log('outputs:' + WebMidi.outputs)
        setTimeout(this.setup, 100)
      }
    }, true)
  },

  getPorts () {
    return new Promise((resolve, reject) => {
      resolve({ins: Midi.internalGetMidiIns(), outs: Midi.internalGetMidiOuts()})
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

  setupInput (inputId) {
    WebMidi.removeListener()
    console.log('inputId:' + inputId)
    var input = WebMidi.getInputById(inputId)
    console.log('input:' + input.name)

    try {
      input.addListener('sysex', 'all', function (e) {
        console.log('sysex input:')
        console.log(e)
      })
      input.addListener('pitchbend', 'all', function (e) {
        console.log('Pitch value: ' + e.value)
      })
      console.log('Listener added!')
    } catch (err) {
      console.log('err:' + err)
    }
  },

  programChange (outputId, idx, pos) {
    return new Promise((resolve) => {
      console.log('outputId:' + outputId)
      var output = WebMidi.getOutputById(outputId)
      console.log('output:' + output)
      console.log('ProgramChange - idx:' + idx + ' pos:' + pos + ' ...')
      try {
        output.sendProgramChange(idx, pos)
        console.log('..Sent!')
      } catch (err) {
        console.log('Midi error:' + err)
      }
      resolve()
    })
  },

  loadGlobalParameters (outputId) {
    return new Promise((resolve) => {
      console.log('outputId:' + outputId)
      var output = WebMidi.getOutputById(outputId)
      console.log('output:' + output)
      try {
        this.sendVirtualKey(output, 0x00)
          .then(() => this.delay(200))
          .then(() => this.sendVirtualKey(output, 0x11))
          .then(() => this.delay(200))
          .then(() => this.sendVirtualKey(output, 0x15))
          .then(() => this.delay(200))
          .then(() => this.sendVirtualKey(output, 0x33))
          .then(() => this.delay(200))
          .then(() => this.sendVirtualKey(output, 0x25))
          .then(() => this.delay(200))
          .then(() => {
            console.log('..Sent!')
            resolve()
          })
      } catch (err) {
        console.log('Midi error:' + err)
        resolve()
      }
    })
  },

  getInstumentData (outputId, pos) {
    return new Promise((resolve) => {
      console.log('outputId:' + outputId)
      var output = WebMidi.getOutputById(outputId)
      console.log('output:' + output)
      try {
        this.getInstrument(output, pos)
          .then(() => this.delay(500))
          .then(() => this.sendStatusOk(output))
          .then(() => this.delay(500))
          .then(() => {
            console.log('..Sent!')
            resolve()
          })
      } catch (err) {
        console.log('Midi error:' + err)
        resolve()
      }
    })
  },

  sendVirtualKey (output, key) {
    return new Promise((resolve) => {
      output.sendSysex([0x0f, 0x03], [0x00, 0x40, 0x00, key])
      resolve()
    })
  },

  getInstrument (output, pos) {
    return new Promise((resolve) => {
      output.sendSysex([0x0f, 0x03], [0x00, 0x03, 0x00, pos, 0x00, 0x00, 0x00, 0x01])
      resolve()
    })
  },

  sendStatusOk (output) {
    return new Promise((resolve) => {
      output.sendSysex([0x0f, 0x03], [0x00, 0x01, 0x00, 0x00])
      resolve()
    })
  },

  delay (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
