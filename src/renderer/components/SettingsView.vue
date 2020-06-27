<template>
  <v-layout column justify-center>
    <v-flex xs12>
      <v-flex xs6 my-3>
        <div class="headline">Settings</div>
      </v-flex>
      <v-flex xs6 mt-3 mb-4>
        <div class="subheading">Device setup</div>
      </v-flex>
       <v-layout row>
        <v-flex xs3 mx-4>
          <v-select
            v-model="currentEnsoniqDevice"
            :items="ensoniqDevices"
            item-text="name"
            item-value="id"
            prepend-icon="mdi-piano"
            box
            label="Ensoniq device type"
          />
        </v-flex>
       <!--  <v-flex
          xs2
          mx-4
        >
          <v-select
            v-model="currentBaseChannel"
            :items="midiChannels"
            item-text="name"
            item-value="id"
            prepend-icon="mdi-midi"
            box
            label="Base channel"
          />
        </v-flex>
 -->
       </v-layout>
      <v-flex xs6 mt-3 mb-4>
        <div class="subheading">MIDI Connection</div>
      </v-flex>
      <v-layout row>
        <v-flex xs6 mx-4>
          <v-select
            v-model="currentMidiInput"
            :items="midiInputs"
            item-text="name"
            item-value="id"
            prepend-icon="mdi-midi-port"
            box
            label="MIDI Input"
          />
        </v-flex>
        <v-flex xs6 mx-3>
          <v-select
            v-model="currentMidiOutput"
            :items="midiOutputs"
            item-text="name"
            item-value="id"
            prepend-icon="mdi-midi-port"
            box
            label="MIDI Output"
          />
        </v-flex>
      </v-layout>
      <v-flex mt-3>
      </v-flex>
      <v-flex xs6 mt-3 mb-2>
        <div class="subheading">File paths</div>
      </v-flex>
      <v-layout>
        <v-flex xs12>
          <v-layout row>
            <v-flex xs11 mx-4>
              <v-text-field
                v-model="currentMediaDirectory"
                prepend-icon="mdi-folder-outline"
                label="Ensoniq media directory"
              />
            </v-flex>
            <v-flex xs1 mx-4>
              <v-btn 
                block
                @click="selectMediaFolder"
              >
              select
              </v-btn>
            </v-flex>   
          </v-layout>
          <!-- <v-layout row>
            <v-flex xs11 mx-4>
              <v-text-field
                v-model="currentWorkingDirectory"
                prepend-icon="mdi-folder-outline"
                label="Working directory"
              />
            </v-flex>
          </v-layout> -->
          <v-layout row>
            <v-flex xs12 mx-4>
              <v-text-field
                v-model="currentEnsoniqStorageDevice"
                prepend-icon="mdi-transit-connection-variant"
                label="Ensoniq Storage Device"
              />
            </v-flex>
          </v-layout>
          <!-- <v-layout row>
            <v-flex xs8 mx-4>
              <v-text-field
                v-model="currentEpslinPath"
                prepend-icon="mdi-engine"
                label="Path to EpsLin executable"
              />
            </v-flex>
          </v-layout> -->
        </v-flex>
      </v-layout>
      <v-btn @click="readMidiPorts()">Refresh Midi ports</v-btn> 
       <v-btn @click="save()">Save</v-btn> 
    </v-flex>
  </v-layout>
</template>

     
<script>

import { mapState, mapActions } from 'Vuex'
import { DataSource } from '../utils/datasource'

export default {

  data () {
    return {
      midiInputs: [],
      midiOutputs: []
    }
  },
  computed: {
    ...mapState('settings', [
      'ensoniqDevice',
      'baseChannel',
      'midiInput',
      'midiOutput',
      'mediaDirectory',
      'workingDirectory',
      'ensoniqStorageDevice',
      'epslin'
    ]),

    ensoniqDevices: {
      get () { return DataSource.getEnsoniqDevices() }
    },

    midiChannels: {
      get () { return Array.from(new Array(16), (x, i) => i + 1) }
    },

    currentEnsoniqDevice: {
      get () { return this.ensoniqDevice },
      set (value) { this.updateEnsoniqDevice(value) }
    },

    currentBaseChannel: {
      get () { return this.baseChannel },
      set (value) { this.updateBaseChannel(value) }
    },

    currentMidiInput: {
      get () { return this.midiInput },
      set (value) { this.updateMidiInput(value) }
    },

    currentMidiOutput: {
      get () { return this.midiOutput },
      set (value) { this.updateMidiOutput(value) }
    },

    currentMediaDirectory: {
      get () { return this.mediaDirectory },
      set (value) { this.updateMediaDirectory(value) }
    },

    currentWorkingDirectory: {
      get () { return this.workingDirectory },
      set (value) { this.updateWorkingDirectory(value) }
    },

    currentEnsoniqStorageDevice: {
      get () { return this.ensoniqStorageDevice },
      set (value) { this.updateEnsoniqStorageDevice(value) }
    },

    currentEpslinPath: {
      get () { return this.epslin },
      set (value) { this.updateEpslin(value) }
    }

  },
  methods: {
    ...mapActions({
      updateEnsoniqDevice: 'settings/updateEnsoniqDevice',
      updateBaseChannel: 'settings/updateBaseChannel',
      updateMediaDirectory: 'settings/updateMediaDirectory',
      updateWorkingDirectory: 'settings/updateWorkingDirectory',
      updateMidiInput: 'settings/updateMidiInput',
      updateMidiOutput: 'settings/updateMidiOutput',
      updateEnsoniqStorageDevice: 'settings/updateEnsoniqStorageDevice',
      updateEpslin: 'settings/updateEpslin'
    }),

    selectMidiInput (id) {
      var input = this.midiInputs.find(function (item) { return item.id === id })
      this.currentMidiInput = input
    },

    selectMidiOutput (id) {
      var output = this.midiOutputs.find(function (item) { return item.id === id })
      this.currentMidiOutput = output
    },

    readMidiPorts () {
      DataSource.getMidiPorts().then(ports => {
        console.log(ports)
        this.midiInputs = ports.ins
        this.midiOutputs = ports.outs
      }).catch(err => {
        console.error('catch: ' + err)
      })
    },

    selectMediaFolder () {
      const { dialog } = require('electron').remote
      this.currentMediaDirectory = dialog.showOpenDialog({ properties: ['openDirectory'] })
    },

    save () {
      DataSource.saveSettings()
    },

    delay (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },

  mounted () {
    console.log('settings mounted')
    DataSource.initializeMidi()
    this.readMidiPorts()
  }
}
</script>

<style scoped>
img {
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>