
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
      resolve({ ins: internalGetMidiIns(), outs: internalGetMidiOuts() })
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

  programChange (outputId, idx, pos) {
    return new Promise((resolve, reject) => {
      try {
        const output = getOutputById(outputId)
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
      const output = getOutputById(outputId)
      try {
        sendVirtualKey(output, BUTTON.LOAD_MODE)
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, BUTTON.INSTRUMENT))
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
      const output = getOutputById(outputId)
      try {
        sendVirtualKey(output, BUTTON.INSTRUMENT_1)
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, BUTTON.COMMAND_MODE))
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, BUTTON.SYSTEM_MIDI))
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, BUTTON.ENV3_3))
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, BUTTON.ENTER_YES))
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

  changeStorageDevice (outputId, deviceType) {
    console.warn(deviceType)
    return new Promise((resolve, reject) => {
      const output = getOutputById(outputId)
      try {
        sendVirtualKey(output, BUTTON.COMMAND_MODE)
          .then(() => delay(200))
          // NOTE: Different key combos for different device types
          .then(() => sendVirtualKey(output, deviceType === 'EPS' ? BUTTON.EFFECTS : BUTTON.SYSTEM_MIDI))
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, deviceType === 'EPS' ? BUTTON.LFO_7 : BUTTON.FILTER_5))
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, BUTTON.ENTER_YES))
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, BUTTON.ENTER_YES))
          .then(() => delay(500))
          .then(() => {
            resolve()
          })
      } catch (err) {
        console.error('Midi error:' + err)
        reject(err)
      }
    })
  },

  createInstrumentPlaceholder (outputId, pos) {
    console.log('create instrument placeholder: pos=' + pos)
    return new Promise((resolve, reject) => {
      const output = getOutputById(outputId)
      try {
        createInstrument(output, pos)
          .then(() => delay(300))
          .then(() => {
            resolve()
          })
      } catch (err) {
        console.error('Midi error:' + err)
        reject(err)
      }
    })
  },

  prepareInstrumentPlaceholder (outputId, pos) {
    console.log('prepare instrument placeholder: pos=' + pos)
    return new Promise((resolve, reject) => {
      const output = getOutputById(outputId)
      try {
        setParameter(output, pos, 0, 6, pos - 1)
          .then(() => delay(300))
          .then(() => {
            resolve()
          })
      } catch (err) {
        console.error('Midi error:' + err)
        reject(err)
      }
    })
  },

  getFreeMemory (outputId) {
    const output = getOutputById(outputId)
    getParameter(output, 0, 0x34, 0x00)
  },

  getInstumentData (outputId, deviceType, pos, success, failure) {
    putInstrumentPos = pos
    getInstrumentDataCallback = success
    getInstrumentFailureCallback = failure
    retryCount = 0

    const output = getOutputById(outputId)
    midiOut = output

    const retryFunction = () => {
      retryCount++
      console.warn('RETRY GetInstrument') // For EPS, retry as there sometimes very slow respose
      getInstrumentTimerId = setTimeout(() => {
        if (retryCount < MAX_RETRY_COUNT) {
          retryFunction()
        } else {
          failure('Timeout - pos=' + pos)
        }
      }, TIMEOUT_IN_MS)
      getInstrument(output, pos)
    }

    getInstrumentTimerId = setTimeout(() => {
      if (deviceType === 'EPS') {
        retryFunction()
      } else {
        failure('Timeout - pos=' + pos)
      }
    }, TIMEOUT_IN_MS)

    try {
      getInstrument(output, pos)
    } catch (err) {
      console.error('Midi error:' + err)
      clearTimeout(getInstrumentTimerId)
      failure(err)
    }
  },

  deleteInstrument (outputId, pos) {
    return new Promise((resolve, reject) => {
      try {
        const output = getOutputById(outputId)
        deleteInstrument(output, pos)
        setTimeout(() => { resolve() }, 300)
      } catch (err) {
        console.error('Midi error:' + err)
        reject(err)
      }
    }).then(() => delay(200))
  },

  prepareCopyInstrument (outputId, from) {
    return new Promise((resolve, reject) => {
      const output = getOutputById(outputId)
      try {
        sendVirtualKey(output, BUTTON.INSTRUMENT)
          .then(() => delay(200))
          .then(() => sendVirtualKey(output, BUTTON.INSTRUMENT_1 + (from - 1)))
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

  copyInstrument (outputId, from, to) {
    return new Promise((resolve, reject) => {
      try {
        const output = getOutputById(outputId)
        copyInstrument(output, from, to)
        setTimeout(() => { resolve() }, 300)
      } catch (err) {
        console.error('Midi error:' + err)
        reject(err)
      }
    }).then(() => delay(200))
  },

  playInstrument (outputId, pos, note, volume) {
    return new Promise((resolve, reject) => {
      const output = getOutputById(outputId)
      try {
        noteOn(output, pos - 1, note, volume)
        resolve()
      } catch (err) {
        console.error('Midi error:' + err)
        reject(err)
      }
    })
  }
}

// Virtual button press codes
const BUTTON = {
  INSTRUMENT_1: 0x00,
  INSTRUMENT_2: 0x01,
  INSTRUMENT_3: 0x02,
  INSTRUMENT_4: 0x03,
  INSTRUMENT_5: 0x04,
  INSTRUMENT_6: 0x05,
  INSTRUMENT_7: 0x06,
  INSTRUMENT_8: 0x07,
  AUDIO_TRACK_A: 0x08, // only ASR10
  AUDIO_TRACK_B: 0x09, // only ASR10
  SAMPLE: 0x10,
  COMMAND_MODE: 0x11,
  EFFECT_SELECT_BYPASS: 0x12, // for EPS16/ASR10, for EPS: KEY_RANGE
  EDIT_MODE: 0x13,
  LOAD_MODE: 0x14,
  SYSTEM_MIDI: 0x15, // for EPS16/ASR10, for EPS: MIDI
  SEQ_SONG: 0x16,
  INSTRUMENT: 0x17,
  EFFECTS: 0x18, // for EPS16/ASR10, for EPS: SYSTEM
  ARROW_UP: 0x20,
  ARROW_DOWN: 0x21,
  ARROW_LEFT: 0x22,
  CANCEL_NO: 0x23,
  ARROW_RIGHT: 0x24,
  ENTER_YES: 0x25,
  TRACK_0: 0x30,
  ENV1_1: 0x31,
  ENV2_2: 0x32,
  ENV3_3: 0x33,
  PITCH_4: 0x34,
  FILTER_5: 0x35,
  AMP_6: 0x36,
  LFO_7: 0x37,
  WAVE_8: 0x38,
  LAYER_9: 0x39
}

const TIMEOUT_IN_MS = 5000
const RETRY_TIME_IN_MS = 1000
const MAX_RETRY_COUNT = 3
let retryCount = 0

const MIDI_STATE = {
  IDLE: 0,
  GET_INSTRUMENT_SENT: 1,
  PUT_INSTRUMENT_RECEIVED: 2,
  GET_INSTRUMENT_WAITING_DISK_ACCESS: 3,
  GET_INSTRUMENT_READY_FOR_RESPONSE: 4
}

let midi = null
let midiState = MIDI_STATE.IDLE
let midiOut = null
const baseChannel = 1
let putInstrumentPos = -1
let getInstrumentTimerId = null
let getInstrumentDataCallback = function () { }
let getInstrumentFailureCallback = function () { }

function init () {
  if (midi !== null) close()
  return navigator.requestMIDIAccess({ sysex: true })
    .then(onMIDISuccess, onMIDIFailure)
    .then(() => delay(50))
}

function close () {
  const allInputs = midi.inputs.values()
  for (let input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    input.value.onmidimessage = null
  }
}

function internalGetMidiIns () {
  const inputs = []
  midi.inputs.forEach(function (port) {
    const dict = {}
    dict.id = port.id
    dict.name = port.name
    console.log(port)
    inputs.push(dict)
  })
  return inputs
}

function internalGetMidiOuts () {
  const outputs = []
  midi.outputs.forEach(function (port) {
    const dict = {}
    dict.id = port.id
    dict.name = port.name
    console.log(port)
    outputs.push(dict)
  })
  return outputs
}

function onStateChange (event) {
  const port = event.port
  const state = port.state
  const name = port.name
  const type = port.type
  if (type === 'input') console.log('name', name, 'port', port, 'state', state)
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
  const allInputs = midi.inputs.values()
  const allOutputs = midi.outputs.values()

  midi.onstatechange = onStateChange

  console.log(midiData)

  console.log('INPUTS:')
  for (let input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    console.log(input.value.name + ' ' + input.value.id)
  }
  console.log('OUTPUTS:')
  for (let output = allOutputs.next(); output && !output.done; output = allOutputs.next()) {
    console.log(output.value.name + ' ' + output.value.id)
  }
}

function isExpectedSysex (messageData, cmd = null, value = null) {
  return messageData.data[0] === 0xF0 &&
         messageData.data[1] === 0x0F &&
         messageData.data[2] === 0x03 &&
         messageData.data[3] === (baseChannel - 1) &&
         (cmd == null ? true : messageData.data[4] === cmd) &&
         // messageData.data[5] === 0x00 &&
         (value == null ? true : messageData.data[6] === value)
}

function gotMIDImessage (messageData) {
  console.log(messageData)
  let name = ''
  // In case of disk access, Ensoniq returns "disk access in progress" = 0x14
  if (
    (midiState === MIDI_STATE.GET_INSTRUMENT_SENT || midiState === MIDI_STATE.GET_INSTRUMENT_WAITING_DISK_ACCESS) &&
    isExpectedSysex(messageData, 0x01, 0x14)
  ) {
    console.warn('Disk access...')
    midiState = MIDI_STATE.GET_INSTRUMENT_WAITING_DISK_ACCESS
    setTimeout(() => { getInstrument(midiOut, putInstrumentPos) }, RETRY_TIME_IN_MS)
    clearTimeout(getInstrumentTimerId)
    getInstrumentTimerId = setTimeout(() => { getInstrumentFailureCallback('Timeout') }, TIMEOUT_IN_MS)
    return
  }

  // In case of empty inst pos, Ensoniq returns "invalid instrument" = 0x05
  if (
    midiState === MIDI_STATE.GET_INSTRUMENT_SENT &&
    isExpectedSysex(messageData, 0x01, 0x05)
  ) {
    console.warn('Invalid instrument pos=' + putInstrumentPos)
    midiState = MIDI_STATE.IDLE
    clearTimeout(getInstrumentTimerId)
    getInstrumentDataCallback(putInstrumentPos, null)
    return
  }

  // Status ok, Ensoniq returns "ack" = 0x00
  if (
    (midiState === MIDI_STATE.GET_INSTRUMENT_SENT || midiState === MIDI_STATE.GET_INSTRUMENT_WAITING_DISK_ACCESS) &&
    isExpectedSysex(messageData, 0x01, 0x00)
  ) {
    console.log('ACK pos=' + putInstrumentPos)
    midiState = MIDI_STATE.GET_INSTRUMENT_READY_FOR_RESPONSE
    return
  }

  // Put instrument command - contains the position
  if (
    midiState === MIDI_STATE.GET_INSTRUMENT_READY_FOR_RESPONSE &&
    isExpectedSysex(messageData, 0x0C)
  ) {
    console.log('PUT inst received - pos=' + putInstrumentPos)
    putInstrumentPos = messageData.data[6] + 1
    midiState = MIDI_STATE.PUT_INSTRUMENT_RECEIVED
    sendStatusOk(midiOut)
    return
  }

  // Instrument data
  if (
    midiState === MIDI_STATE.PUT_INSTRUMENT_RECEIVED &&
    isExpectedSysex(messageData)
  ) {
    console.log('Inst DATA received - pos=' + putInstrumentPos)
    const offset = 4
    for (let i = 0; i < 12; i++) {
      const char = (messageData.data[offset + i * 3] << 4) + (messageData.data[offset + (i * 3) + 1] >> 2)
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
  const output = midi.outputs.get(outputId)
  if (output === undefined) { return '' }
  return output.name
}

function getInputNameById (inputId) {
  if (midi === null || inputId === undefined) { return '' }
  const input = midi.inputs.get(inputId)
  if (input === undefined) { return '' }
  return input.name
}

function noteOn (output, channel, note, volume) {
  console.warn('Note on')
  console.warn([0x90 + channel, note, volume])
  output.send([0x90 + channel, note, volume])
}

function sendProgramChange (output, idx, channel) {
  output.send([0xC0 + channel, idx])
}

function sendSysex (output, data) {
  if (output === undefined) return
  output.send(data)
}

function sendVirtualKey (output, key) {
  return new Promise((resolve) => {
    sendSysex(output, [
      0xf0, 0x0f, 0x03, 0x00,
      0x40, 0x00, key,
      0xf7
    ])
    resolve()
  })
}

function getParameter (output, pos, paramHi, paramLo) {
  return new Promise((resolve) => {
    sendSysex(output, [
      0xf0, 0x0f, 0x03, 0x00,
      0x08,
      0x00, pos - 1,
      0x00, 0x00,
      0x00, 0x01,
      paramHi, paramLo,
      0xf7
    ])
    // midiState = MIDI_STATE.GET_INSTRUMENT_SENT
    resolve()
  })
}

function setParameter (output, pos, paramHi, paramLo, val) {
  return new Promise((resolve) => {
    sendSysex(output, [
      0xf0, 0x0f, 0x03, 0x00,
      0x11,
      0x00, pos - 1,
      0x00, 0x00,
      0x00, 0x01,
      paramHi, paramLo,
      0x00, 0x00, 0x00, val,
      0xf7
    ])
    // midiState = MIDI_STATE.GET_INSTRUMENT_SENT
    resolve()
  })
}

function getInstrument (output, pos) {
  return new Promise((resolve) => {
    sendSysex(output, [
      0xf0, 0x0f, 0x03, 0x00,
      0x03, 0x00, pos - 1, 0x00, 0x00, 0x00, 0x01,
      0xf7
    ])
    midiState = MIDI_STATE.GET_INSTRUMENT_SENT
    resolve()
  })
}

function sendStatusOk (output) {
  return new Promise((resolve) => {
    sendSysex(output, [
      0xf0, 0x0f, 0x03, 0x00,
      0x01, 0x00, 0x00,
      0xf7
    ])
    resolve()
  })
}

function createInstrument (output, pos) {
  return new Promise((resolve) => {
    sendSysex(output, [
      0xf0, 0x0f, 0x03, 0x00,
      0x15, 0x00, pos - 1, 0x00, 0x00, 0x00, 0x01,
      0xf7
    ])
    resolve()
  })
}

function deleteInstrument (output, pos) {
  return new Promise((resolve) => {
    sendSysex(output, [
      0xf0, 0x0f, 0x03, 0x00,
      0x1c, 0x00, pos - 1, 0x00, 0x00, 0x00, 0x01,
      0xf7
    ])
    resolve()
  })
}

function copyInstrument (output, from, to) {
  console.log('from:' + from + ' to:' + to)
  return new Promise((resolve) => {
    sendSysex(output, [
      0xf0, 0x0f, 0x03, 0x00,
      0x12, 0x00, from - 1, 0x00, 0x00, 0x00, 0x01, 0x00, to - 1, 0x00, 0x00, 0x00, 0x00,
      0xf7
    ])
    resolve()
  })
}

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
