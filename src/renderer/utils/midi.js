
const MIDI_STATE = {
  IDLE: 0,
  GET_INSTRUMENT_SENT: 1,
  PUT_INSTRUMENT_RECEIVED: 2,
  GET_INSTRUMENT_WAITING_DISK_ACCESS: 3,
  GET_INSTRUMENT_READY_FOR_RESPONSE: 4
}

var midi = null
var midiState = MIDI_STATE.IDLE
var midiOut = null
var putInstrumentPos = -1
var getInstrumentTimerId = null
var getInstrumentDataCallback = function (pos, name) { }
var getInstrumentFailureCallback = function (pos, name) { }

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
    console.log(input.value.name + ' ' + input.value.id)
  }
  console.log('OUTPUTS:')
  for (var output = allOutputs.next(); output && !output.done; output = allOutputs.next()) {
    console.log(output.value.name + ' ' + output.value.id)
  }
}

function gotMIDImessage (messageData) {
  var name = ''

  // In case of disk access, Ensoniq returns "disk access in progress" = 0x14
  if (
    (midiState === MIDI_STATE.GET_INSTRUMENT_SENT || midiState === MIDI_STATE.GET_INSTRUMENT_WAITING_DISK_ACCESS) &&
    messageData.data[0] === 0xF0 &&
    messageData.data[1] === 0x0F &&
    messageData.data[4] === 0x01 &&
    messageData.data[6] === 0x14
  ) {
    midiState = MIDI_STATE.GET_INSTRUMENT_WAITING_DISK_ACCESS
    setTimeout(() => { getInstrument(midiOut, putInstrumentPos) }, 1000)
    clearTimeout(getInstrumentTimerId)
    getInstrumentTimerId = setTimeout(() => { getInstrumentFailureCallback('Timeout') }, 3000)
    return
  }

  // In case of empty inst pos, Ensoniq returns "invalid instrument" = 0x05
  if (
    midiState === MIDI_STATE.GET_INSTRUMENT_SENT &&
    messageData.data[0] === 0xF0 &&
    messageData.data[1] === 0x0F &&
    messageData.data[4] === 0x01 &&
    messageData.data[6] === 0x05
  ) {
    midiState = MIDI_STATE.IDLE
    clearTimeout(getInstrumentTimerId)
    getInstrumentDataCallback(putInstrumentPos, null)
    return
  }

  // Status ok, Ensoniq returns "ack" = 0x00
  if (
    (midiState === MIDI_STATE.GET_INSTRUMENT_SENT || midiState === MIDI_STATE.GET_INSTRUMENT_WAITING_DISK_ACCESS) &&
      messageData.data[0] === 0xF0 &&
      messageData.data[1] === 0x0F &&
      messageData.data[4] === 0x01 &&
      messageData.data[6] === 0x00
  ) {
    midiState = MIDI_STATE.GET_INSTRUMENT_READY_FOR_RESPONSE
    return
  }

  // Put instrument command - contains the position
  if (
    midiState === MIDI_STATE.GET_INSTRUMENT_READY_FOR_RESPONSE &&
    messageData.data[0] === 0xF0 &&
    messageData.data[1] === 0x0F &&
    messageData.data[4] === 0x0C
  ) {
    putInstrumentPos = messageData.data[6] + 1
    midiState = MIDI_STATE.PUT_INSTRUMENT_RECEIVED
    sendStatusOk(midiOut)
    return
  }

  // Instrument data
  if (
    midiState === MIDI_STATE.PUT_INSTRUMENT_RECEIVED &&
    messageData.data[0] === 0xF0 &&
    messageData.data[1] === 0x0F &&
    messageData.data.length === 974
  ) {
    var offset = 4
    for (var i = 0; i < 12; i++) {
      var char = (messageData.data[offset + i * 3] << 4) + (messageData.data[offset + (i * 3) + 1] >> 2)
      name += String.fromCharCode(char)
    }
    midiState = MIDI_STATE.IDLE
    clearTimeout(getInstrumentTimerId)
    getInstrumentDataCallback(putInstrumentPos, name)
    putInstrumentPos = -1
  }
}

function onMIDIFailure () {
  console.warn('Not recognising MIDI controller')
}

function getOutputById (outputId) {
  return midi.outputs.get(outputId)
}

function getInputById (inputId) {
  return midi.inputs.get(inputId)
}

function getOutputNameById (outputId) {
  if (midi === null || outputId === undefined) { return '' }
  return midi.outputs.get(outputId).name
}

function getInputNameById (inputId) {
  console.warn('id:' + inputId)
  if (midi === null || inputId === undefined) { return '' }
  console.log(midi.inputs)
  var input = midi.inputs.get(inputId)
  console.log(input)
  console.log(input.name)
  return input.name
}

function sendProgramChange (output, idx, pos) {
  output.send([0xC0 + pos, idx])
}

function sendSysex (output, data) {
  output.send(data)
}

function sendVirtualKey (output, key) {
  return new Promise((resolve) => {
    sendSysex(output, [0xf0, 0x0f, 0x03, 0x00, 0x40, 0x00, key, 0xf7])
    resolve()
  })
}

function getInstrument (output, pos) {
  return new Promise((resolve) => {
    sendSysex(output, [0xf0, 0x0f, 0x03, 0x00, 0x03, 0x00, pos - 1, 0x00, 0x00, 0x00, 0x01, 0xf7])
    midiState = MIDI_STATE.GET_INSTRUMENT_SENT
    resolve()
  })
}

function sendStatusOk (output) {
  return new Promise((resolve) => {
    sendSysex(output, [0xf0, 0x0f, 0x03, 0x00, 0x01, 0x00, 0x00, 0xf7])
    resolve()
  })
}

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Public API
export const Midi = {

  initialize (inputId) {
    console.log('Midi: Initialize with input id:' + inputId)
    return init().then(() => addInputListener(getInputById(inputId)))
  },

  close () {
    close()
  },

  getPorts () {
    return new Promise((resolve) => {
      resolve({ins: Midi.internalGetMidiIns(), outs: Midi.internalGetMidiOuts()})
    })
  },

  getInputName (inputId) {
    return getInputNameById(inputId)
  },

  getOutputName (outputId) {
    return getOutputNameById(outputId)
  },

  setGetInstrumentDataCallback (callback) {
    getInstrumentDataCallback = callback
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
    return new Promise((resolve, reject) => {
      try {
        var output = getOutputById(outputId)
        sendProgramChange(output, idx, pos - 1)
        setTimeout(() => { resolve() }, 300)
      } catch (err) {
        console.error('Midi error:' + err)
        reject(err)
      }
    }).then(() => delay(200))
  },

  prepareLoadInstrument (outputId) {
    return new Promise((resolve, reject) => {
      var output = getOutputById(outputId)
      try {
        sendVirtualKey(output, 0x14) // LOAD
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, 0x17)) // INSTRUMENT
          .then(() => delay(200))
          .then(() => {
            resolve()
          })
      } catch (err) {
        console.error('Midi error:' + err)
        reject(err)
      }
    })
  },

  loadGlobalParameters (outputId) {
    return new Promise((resolve, reject) => {
      var output = getOutputById(outputId)
      try {
        sendVirtualKey(output, 0x00) // INST 1
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, 0x11)) // COMMAND
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, 0x15)) // SYSTEM
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, 0x33)) // ENV3
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, 0x25)) // ENTER
          .then(() => delay(200))
          .then(() => {
            resolve()
          })
      } catch (err) {
        console.error('Midi error:' + err)
        reject(err)
      }
    })
  },

  getInstumentData (outputId, pos, success, failure) {
    putInstrumentPos = pos
    getInstrumentDataCallback = success
    getInstrumentFailureCallback = failure

    var output = getOutputById(outputId)
    midiOut = output

    getInstrumentTimerId = setTimeout(() => { failure('Timeout') }, 3000)

    try {
      getInstrument(output, pos)
    } catch (err) {
      console.error('Midi error:' + err)
      clearTimeout(getInstrumentTimerId)
      failure(err)
    }
  }
}
