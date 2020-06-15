
var midi = null

function init () {
  if (midi !== null) close()
  return navigator.requestMIDIAccess({ sysex: true })
    .then(onMIDISuccess, onMIDIFailure)
    .then(() => delay(500))
}

function close () {
  var allInputs = midi.inputs.values()
  for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    input.value.onmidimessage = null
  }
}

function addInputListener (input) {
  if (input === undefined) {
    console.log('Midi: No input to add listener!')
    return
  }
  close()
  input.onmidimessage = gotMIDImessage
  console.log('Midi: Added listener to input:' + input.name)
}

// on success
function onMIDISuccess (midiData) {
  console.log('MIDI success')
  // this is all our MIDI data
  midi = midiData
  var allInputs = midi.inputs.values()
  var allOutputs = midi.outputs.values()

  console.log('INPUTS:')
  for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    // input.value.onmidimessage = gotMIDImessage
    console.log(input.value.name + ' ' + input.value.id)
  }
  console.log('OUTPUTS:')
  for (var output = allOutputs.next(); output && !output.done; output = allOutputs.next()) {
    console.log(output.value.name + ' ' + output.value.id)
  }
}

function gotMIDImessage (messageData) {
  console.log('data:' + messageData.data)
  var name = ''
  if (
    messageData.data[0] === 0xF0 &&
    messageData.data[1] === 0x0F &&
    messageData.data.length === 974
  ) {
    var offset = 4
    for (var i = 0; i < 12; i++) {
      var char = (messageData.data[offset + i * 3] << 4) + (messageData.data[offset + (i * 3) + 1] >> 2)
      // console.log('char:' + String.fromCharCode(char))
      name += String.fromCharCode(char)
    }
    console.log('Name:' + name)
  }
}

// on failure
function onMIDIFailure () {
  console.warn('Not recognising MIDI controller')
}

function getOutputById (outputId) {
  return midi.outputs.get(outputId)
}

function getInputById (inputId) {
  return midi.inputs.get(inputId)
}

function sendProgramChange (output, idx, pos) {
  output.send([0xC0 + pos, idx])
}

function sendSysex (output, data) {
  output.send(data)
}

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const Midi = {

  initialize (inputId) {
    console.log('Midi: Initialize with input id:' + inputId)
    return init().then(() => addInputListener(getInputById(inputId)))
  },

  close () {
    close()
  },

  getPorts () {
    return new Promise((resolve, reject) => {
      resolve({ins: Midi.internalGetMidiIns(), outs: Midi.internalGetMidiOuts()})
    })
  },

  internalGetMidiIns () {
    var inputs = []
    midi.inputs.forEach(function (port) {
      var dict = {}
      dict['id'] = port.id
      dict['name'] = port.name
      console.log(port)
      inputs.push(dict)
    })
    return inputs
  },

  internalGetMidiOuts () {
    var outputs = []
    midi.outputs.forEach(function (port) {
      var dict = {}
      dict['id'] = port.id
      dict['name'] = port.name
      console.log(port)
      outputs.push(dict)
    })
    return outputs
  },

  programChange (outputId, idx, pos) {
    return new Promise((resolve) => {
      console.log('outputId:' + outputId)
      console.log('ProgramChange - idx:' + idx + ' pos:' + pos + ' ...')
      try {
        var output = getOutputById(outputId)
        sendProgramChange(output, idx, pos)
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
      var output = getOutputById(outputId)
      console.log('output:' + output)
      try {
        this.sendVirtualKey(output, 0x00)
          .then(() => delay(200))
          .then(() => this.sendVirtualKey(output, 0x11))
          .then(() => delay(200))
          .then(() => this.sendVirtualKey(output, 0x15))
          .then(() => delay(200))
          .then(() => this.sendVirtualKey(output, 0x33))
          .then(() => delay(200))
          .then(() => this.sendVirtualKey(output, 0x25))
          .then(() => delay(200))
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
      var output = getOutputById(outputId)
      console.log('output:' + output)
      try {
        this.getInstrument(output, pos)
          .then(() => delay(500))
          .then(() => this.sendStatusOk(output))
          .then(() => delay(500))
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
      sendSysex(output, [0xf0, 0x0f, 0x03, 0x00, 0x40, 0x00, key, 0xf7])
      resolve()
    })
  },

  getInstrument (output, pos) {
    return new Promise((resolve) => {
      sendSysex(output, [0xf0, 0x0f, 0x03, 0x00, 0x03, 0x00, pos, 0x00, 0x00, 0x00, 0x01, 0xf7])
      resolve()
    })
  },

  sendStatusOk (output) {
    return new Promise((resolve) => {
      sendSysex(output, [0xf0, 0x0f, 0x03, 0x00, 0x01, 0x00, 0x00, 0xf7])
      resolve()
    })
  }
}
