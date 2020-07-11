<template>
    <v-row class="pt-0 pb-0 pl-6 pr-4">
    <font class="caption" color="grey">
      <v-icon small color="grey darken-2">mdi-piano</v-icon>
      {{ ensoniqDevice }}
    </font>
    <v-divider class="mx-4" vertical />
    <font class="caption" color="grey">
      <v-icon small color="grey darken-2">mdi-login-variant</v-icon>
      {{ midiInputName }}
    </font>
    <v-divider class="mx-4" vertical />
    <font class="caption" color="grey">
      <v-icon small color="grey darken-2">mdi-logout-variant</v-icon>
      {{ midiOutputName }}
    </font>
    <v-divider class="mx-4" vertical />
    <v-spacer></v-spacer>
    <font color="grey" class="pr-2 text-caption">Version 0.9</font>
</v-row>
</template>

<script>
import { mapState } from 'vuex'
import { DataSource } from '@/utils/datasource'

export default {
  name: 'FooterView',
  computed: {
    ...mapState('settings', [
      'ensoniqDevice'
    ]),

    midiInputName: {
      get () {
        var input = DataSource.getCurrentMidiInputName()
        if (input === null || input === undefined || input === '') return '<none>'
        return input
      }
    },
    midiOutputName: {
      get () {
        var output = DataSource.getCurrentMidiOutputName()
        if (output === null || output === undefined || output === '') return '<none>'
        return output
      }
    }
  }
}
</script>
