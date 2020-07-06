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
export default {
  name: 'FooterView',
  props: {
    ensoniqDevice: String,
    midiInputName: String,
    midiOutputName: String
  }
}
</script>
