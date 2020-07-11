<template>
  <v-container fill-height fluid justify-start>
    <v-row dense>
      <v-col cols="12">
        <v-col>
          <div class="headline">Settings</div>
        </v-col>
        <v-col>
          <div class="subheading">Device setup</div>
        </v-col>
        <v-row>
          <v-col cols="4">
            <v-select
              v-model="currentEnsoniqDevice"
              :items="ensoniqDevices"
              item-text="name"
              item-value="id"
              prepend-icon="mdi-piano"
              filled
              label="Ensoniq device type"
            />
          </v-col>
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
        </v-flex> -->
        </v-row>
        <v-col>
          <div class="subheading">MIDI Connection</div>
        </v-col>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="currentMidiInput"
              :items="midiInputs"
              item-text="name"
              item-value="id"
              prepend-icon="mdi-midi-port"
              filled
              label="MIDI Input"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="currentMidiOutput"
              :items="midiOutputs"
              item-text="name"
              item-value="id"
              prepend-icon="mdi-midi-port"
              filled
              label="MIDI Output"
            />
          </v-col>
        </v-row>
        <v-row class="pr-3">
          <v-spacer></v-spacer>
          <v-btn @click="readMidiPorts()">Refresh Midi ports</v-btn>
        </v-row>
        <v-col>
          <div class="subheading">File paths</div>
        </v-col>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="10">
                <v-text-field
                  v-model="currentMediaDirectory"
                  prepend-icon="mdi-folder-outline"
                  label="Ensoniq media directory"
                />
              </v-col>
              <v-col cols="2">
                <v-btn block @click="selectMediaFolder">
                  select
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10">
                <v-text-field
                  v-model="currentEnsoniqStorageDevice"
                  prepend-icon="mdi-transit-connection-variant"
                  label="Linked Ensoniq Storage Device"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-col>
          <div class="subheading">Other Ensoniq Storage devices</div>
        </v-col>
        <v-row>
          <v-col cols="6">
            <v-textarea
              v-model="currentEnsoniqDisks"
              prepend-icon="mdi-harddisk"
              outlined
              rows="3"
              row-height="25"
              no-resize
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row class="pt-4">
          <v-spacer></v-spacer>
          <v-btn class="px-2 mx-2" @click="save()">Save</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
      'ensoniqDisks',
      'epslin'
    ]),

    ensoniqDevices: {
      get () {
        return DataSource.getEnsoniqDevices()
      }
    },

    midiChannels: {
      get () {
        return Array.from(new Array(16), (x, i) => i + 1)
      }
    },

    currentEnsoniqDevice: {
      get () {
        return this.ensoniqDevice
      },
      set (value) {
        this.updateEnsoniqDevice(value)
      }
    },

    currentBaseChannel: {
      get () {
        return this.baseChannel
      },
      set (value) {
        this.updateBaseChannel(value)
      }
    },

    currentMidiInput: {
      get () {
        return this.midiInput
      },
      set (value) {
        this.updateMidiInput(value)
      }
    },

    currentMidiOutput: {
      get () {
        return this.midiOutput
      },
      set (value) {
        this.updateMidiOutput(value)
      }
    },

    currentMediaDirectory: {
      get () {
        return this.mediaDirectory
      },
      set (value) {
        this.updateMediaDirectory(value)
      }
    },

    currentWorkingDirectory: {
      get () {
        return this.workingDirectory
      },
      set (value) {
        this.updateWorkingDirectory(value)
      }
    },

    currentEnsoniqStorageDevice: {
      get () {
        return this.ensoniqStorageDevice
      },
      set (value) {
        this.updateEnsoniqStorageDevice(value)
      }
    },

    currentEnsoniqDisks: {
      get () {
        return this.ensoniqDisks.join('\n')
      },
      set (value) {
        this.updateEnsoniqDisks(value.split('\n').filter((v) => v !== ''))
      }
    },

    currentEpslinPath: {
      get () {
        return this.epslin
      },
      set (value) {
        this.updateEpslin(value)
      }
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
      updateEnsoniqDisks: 'settings/updateEnsoniqDisks',
      updateEpslin: 'settings/updateEpslin'
    }),

    selectMidiInput (id) {
      var input = this.midiInputs.find(function (item) {
        return item.id === id
      })
      this.currentMidiInput = input
    },

    selectMidiOutput (id) {
      var output = this.midiOutputs.find(function (item) {
        return item.id === id
      })
      this.currentMidiOutput = output
    },

    readMidiPorts () {
      DataSource.getMidiPorts()
        .then(ports => {
          console.log(ports)
          this.midiInputs = ports.ins
          this.midiOutputs = ports.outs
        })
        .catch(err => {
          console.error('catch: ' + err)
        })
    },

    selectMediaFolder () {
      const { dialog } = require('electron').remote
      dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
        this.currentMediaDirectory = result.filePaths[0]
      })
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
