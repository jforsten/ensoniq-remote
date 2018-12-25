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
            v-model="midiInput"
            :items="midiInputs.map(i => { return i.name })"
            box
            autofocus
            label="MIDI Input"
          />
        </v-card>
      </v-flex>
       <v-flex xs6 mt-4>
        <v-card>
          <v-select
            v-model="midiOutput"
            :items="midiOutputs.map(i => { return i.name })"
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
export default {

  data () {
    return {
      midiInput: '',
      midiInputs: [],
      midiOutput: '',
      midiOutputs: []
    }
  },
  computed: {
    midiInputss: function () {
      var inputs = this.$store.getters['settings/midiInputs']
      console.log('MIDI INPUTS:' + inputs)
      return inputs
    }
  },
  methods: {
    setup () {
      var jsonInputs = this.$store.getters['settings/midiInputs']
      console.log('SV: json:' + jsonInputs)
      this.midiInputs = JSON.parse(jsonInputs)
      jsonInputs = this.$store.getters['settings/midiOutputs']
      console.log('SV: json:' + jsonInputs)
      this.midiOutputs = JSON.parse(jsonInputs)
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