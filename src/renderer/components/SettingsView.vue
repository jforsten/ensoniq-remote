<template>
  <v-layout
    column
    justify-center
  >
    <v-flex xs12>
      <v-flex
        xs6
        my-3
      >
        <div class="headline">Settings</div>
      </v-flex>
      <v-flex
        xs6
        mt-5
        mb-4
      >
        <div class="subheading">MIDI</div>
      </v-flex>

      <v-layout row>
        <v-flex
          xs6
          mx-4
        >
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
        <v-flex
          xs6
          mx-3
        >
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
      <v-flex mt-5>

      </v-flex>
      <v-flex
        xs6
        mt-4
        mb-2
      >
        <div class="subheading">FILE PATHS</div>
      </v-flex>
      <v-layout fluid>
        <v-flex xs12>

          <v-flex
            xs12
            mx-4
          >
            <v-text-field
              v-model="currentMediaDirectory"
              prepend-icon="mdi-folder-outline"
              label="Ensoniq media directory"
            />
            <v-text-field
              v-model="currentWorkingDirectory"
              prepend-icon="mdi-folder-outline"
              label="Working directory"
            />
            <v-text-field
              v-model="currentEpslinPath"
              prepend-icon="mdi-link"
              label="Path to EpsLin executable"
            />
          </v-flex>

        </v-flex>
      </v-layout>
      <!-- <v-btn @click="setup()">Vue</v-btn> -->
    </v-flex>
  </v-layout>
</template>

     
<script>

import { mapState, mapActions } from 'Vuex'

export default {

  data () {
    return {

    }
  },
  computed: {
    ...mapState('settings', [
      'midiInputs',
      'midiOutputs',
      'midiInput',
      'midiOutput',
      'mediaDirectory',
      'workingDirectory',
      'epslin'
    ]),

    currentMidiInput: {
      get () { return this.midiInput },
      set (value) { this.selectMidiInput(value) }
    },

    currentMidiOutput: {
      get () { return this.midiOutput },
      set (value) { this.selectMidiOutput(value) }
    },

    currentMediaDirectory: {
      get () { return this.mediaDirectory },
      set (value) { this.updateMediaDirectory(value) }
    },

    currentWorkingDirectory: {
      get () { return this.workingDirectory },
      set (value) { this.updateWorkingDirectory(value) }
    },

    currentEpslinPath: {
      get () { return this.epslin },
      set (value) { this.updateEpslin(value) }
    }

  },
  methods: {
    ...mapActions({
      selectMidiInput: 'settings/selectMidiInput',
      selectMidiOutput: 'settings/selectMidiOutput',
      updateMediaDirectory: 'settings/updateMediaDirectory',
      updateWorkingDirectory: 'settings/updateWorkingWDirectory',
      updateEpslin: 'settings/updateEpslin'
    }),
    setup () { }
  },

  mounted () {
    this.$store.dispatch('settings/asyncMidiPortsUpdate').then(() => {
      this.setup()
    }).catch(err => {
      console.error('catch: ' + err)
    })
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