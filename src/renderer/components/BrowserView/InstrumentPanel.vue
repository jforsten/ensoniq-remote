
<template>
  <v-card
    flat
    class="grey darken-2"
  >
    <v-layout
      row
      justify-space-around
    >
     <!--  {{panelData}}
      {{selectedItem}} -->
      <v-flex
        class="grey darken-2"
        xs1
        align-center
        justify-space-between="true"
        v-for="option in panelData.selectOptions"
        :key="option.text"
      >
        <v-btn
          @click="click_handler(option.value)"
          block
          small
          class='black'
        >{{option.text}}</v-btn>

      </v-flex>
    </v-layout>
    <v-dialog
      v-model="showProgress"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text
          class="grey darken-2"
        >
          Processing...
          <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"         
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>

import { DataSource } from '../../utils/datasource'

export default {
  props: {
    panelData: {
      type: Object,
      default: () => { }
    },
    selectedItem: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      showProgress: false,
      value: 0
    }
  },
  methods: {
    click_handler (data) {
      console.log('Load inst to pos:' + data.index)
      this.showProgress = true
      DataSource.sendToEnsoniq(data.path, this.selectedItem.index, this.selectedItem.filename, data.index, (a, b) => {})
        .then(() => { this.showProgress = false })
      // DataSource.getInstrumentFromEnsoniqMedia(data.path, this.selectedItem.index).then(() => { this.showProgress = false })
    }
  }
}
</script>

<style scoped>
.v-btn {
  min-width: 0;
}
</style>