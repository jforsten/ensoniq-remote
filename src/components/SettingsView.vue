<template>
  <v-container
    fill-height
    fluid
    justify-start
  >
    <v-row dense>
      <v-col cols="12">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
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
            </v-flex>-->
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
                :rules="[rules.midiIn]"
                required
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
                :rules="[rules.midiOut]"
                required
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
                <v-col cols="12">
                  <v-text-field
                    v-model="currentMediaDirectory"
                    prepend-icon="mdi-folder-outline"
                    label="Ensoniq media directory"
                    append-icon="mdi-dots-horizontal"
                    @click:append="selectMediaFolder"
                    :rules="[rules.required, rules.mediaDirectory]"
                    required
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="currentEnsoniqStorageDevice"
                    prepend-icon="mdi-transit-connection-variant"
                    label="Linked Ensoniq Storage Device"
                    @blur="checkAccessRights"
                    :rules="[rules.required, rules.linkedDevice]"
                    required
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
            <v-btn
              class="px-2 mx-2"
              @click="save()"
            >Save</v-btn>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      max-width="500"
      persistent
    >
      <v-card color="grey darken-3">
        <v-card-title class="headline">Fix device permissions?</v-card-title>
        <v-card-text>
          Permission to read and write <strong>{{currentEnsoniqStorageDevice}}</strong> is required.<br>
          Allow changes to device access permissions?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            @click="dialog = false; fixLinkDevicePermissions()"
          >
            Proceed
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { DataSource } from '@/utils/datasource'
import { FileSystem } from '@/utils/filesystem'
import { Helpers } from '@/utils/helpers'

// import { Error } from '@/utils/error'

export default {
  data () {
    return {
      midiInputs: [],
      midiOutputs: [],
      dialog: false,
      valid: true,
      rules: {
        required: value => !!value || 'Required.',
        midiOut: value => !!value || 'Midi output is required',
        midiIn: value => !!value || 'Midi input is required',
        linkedDevice: value => {
          if (Helpers.isWindows()) return true
          return (
            (FileSystem.exists(value) && !FileSystem.isDirectory(value)) ||
            'Device not found!'
          )
        },
        mediaDirectory: value => {
          return (
            (FileSystem.exists(value) && FileSystem.isDirectory(value)) ||
            'Directory not found!'
          )
        }
      }
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
        console.log('Trying to find saved midi input:')
        console.log(this.midiInput)
        console.log(this.midiInputs)

        if (this.midiInputs.find(item => (item.name === this.midiInput.name && item.id === this.midiInput.id)) !== undefined) {
          return this.midiInput.id
        }
        return ''
      },
      set (value) {
        var input = this.midiInputs.find(item => item.id === value)
        this.updateMidiInput(input)
      }
    },

    currentMidiOutput: {
      get () {
        console.log('Trying to find saved midi output:')
        console.log(this.midiOutput)

        if (this.midiOutputs.find(item => (item.name === this.midiOutput.name && item.id === this.midiOutput.id)) !== undefined) {
          return this.midiOutput.id
        }
        return ''
      },
      set (value) {
        var output = this.midiOutputs.find(item => item.id === value)
        this.updateMidiOutput(output)
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
        if (this.ensoniqDisks !== undefined) {
          return this.ensoniqDisks.join('\n')
        }
        return ''
      },
      set (value) {
        this.updateEnsoniqDisks(value.split('\n').filter(v => v !== ''))
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
        if (result.filePaths.length > 0) {
          console.log('selectMediaFolder -> result', result)

          this.currentMediaDirectory = result.filePaths[0]
        }
      })
    },

    checkAccessRights (event) {
      console.log(event)
      console.log(this.currentEnsoniqStorageDevice)

      if (Helpers.isWindows()) return

      if (
        FileSystem.exists(this.currentEnsoniqStorageDevice) &&
        !FileSystem.isDirectory(this.currentEnsoniqStorageDevice)
      ) {
        if (!FileSystem.hasAccess(this.currentEnsoniqStorageDevice)) {
          this.dialog = true
        }
      }
    },

    fixLinkDevicePermissions () {
      FileSystem.sudo('chmod 666 ' + this.currentEnsoniqStorageDevice)
    },

    save () {
      DataSource.saveSettings()
      this.readMidiPorts()
    },

    delay (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },

  mounted () {
    DataSource.initialize()
      .then(() => { this.readMidiPorts() })
      .then(() => { this.$refs.form.validate() })
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
