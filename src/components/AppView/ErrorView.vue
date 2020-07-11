<template>
  <v-snackbar
    v-model="snackbar"
    :multi-line="multiLine"
    :timeout="timeout"
    color="error"
    transition="slide-y-reverse-transition"
  >
    <v-icon class="pr-2" small>{{ alertIcon }}</v-icon>
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="snackbar = false" icon>
        <v-icon small>{{ closeIcon }}</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ErrorView',
  data () {
    return {
      text: '',
      multiLine: false,
      snackbar: false,
      timeout: 10000,
      alertIcon: 'mdi-alert',
      closeIcon: 'mdi-close'
    }
  },
  computed: {
    ...mapState('app', [
      'errorMessage'])
  },
  methods: {
    ...mapActions({ updateErrorMessage: 'app/updateErrorMessage' })
  },
  watch: {
    errorMessage (value) {
      if (value === '') {
        this.snackbar = false
        return
      }

      // Trigger snackbar
      this.text = value
      this.snackbar = true
    },
    snackbar (value) {
      if (value === false) {
        this.text = ''
        this.updateErrorMessage('')
      }
    }
  }
}
</script>
