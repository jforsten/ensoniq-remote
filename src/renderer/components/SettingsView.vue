<template>
  <v-layout
    column
    justify-center
  >
    <v-flex xs12>
      <v-flex xs6>
        Settings
      </v-flex>
      <v-flex xs6>
        <v-card>
          <v-select
            v-model="currentMidiInput"
            :items="midiInputs"
            item-text="name"
            item-value="id"
            box
            autofocus
            label="MIDI Input"
          />
        </v-card>
      </v-flex>
      <v-flex
        xs6
        mt-4
      >
        <v-card>
          <v-select
            v-model="currentMidiOutput"
            :items="midiOutputs"
            item-text="name"
            item-value="id"
            box
            autofocus
            label="MIDI Output"
          />
        </v-card>
      </v-flex>
      <v-btn @click="setup()">Vue</v-btn>
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
    ...mapState('settings', ['midiInputs', 'midiOutputs', 'midiInput', 'midiOutput']),

    currentMidiInput: {
      get () { return this.midiInput },
      set (value) { this.selectMidiInput(value) }
    },

    currentMidiOutput: {
      get () { return this.midiOutput },
      set (value) { this.selectMidiOutput(value) }
    }

  },
  methods: {
    ...mapActions({
      selectMidiInput: 'settings/selectMidiInput',
      selectMidiOutput: 'settings/selectMidiOutput'
    }),
    setup () {

    }
  },
  created () {
    console.log('CREATED')
  },

  mounted () {
    console.log('MOUNTED')
    this.$store.dispatch('settings/asyncMidiPortsUpdate').then(() => {
      console.log('then: ok')
      this.setup()
    }).catch(err => {
      console.log('catch: ' + err)
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