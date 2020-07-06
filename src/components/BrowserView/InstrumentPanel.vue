
<template>
  <v-container
  fluid
  fill-width
  class="grey darken-2 ma-0 pa-0"
  >
    <v-row
      fill-width
      dense
      no-gutters
      class="pa-0 ma-0"
    >
      <v-col class="mx-3 my-2">
        <v-icon color="grey" >mdi-subdirectory-arrow-right</v-icon>
      </v-col>
      <v-col cols="11" class="px-0 py-0 my-1">
        <v-btn
          class="pa-0 ma-1 grey darken-4"
          v-for="option in panelData.selectOptions"
          :key="option.text"
          @click="click_handler(option.value)"
          small
        >
          {{option.text}}
        </v-btn>
      </v-col>
      <v-spacer> </v-spacer>

      <!-- <v-flex shrink px-2 py-0 my-1>
        <v-btn class='black' small icon>
          <v-icon small>mdi-download</v-icon>
        </v-btn>
        <v-btn class='black' small icon>
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </v-flex> -->

    </v-row>
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
  </v-container>
</template>

<script>

import { DataSource } from '../../utils/datasource'

export default {
  name: 'InstrumentPanel',
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
      DataSource.sendToEnsoniq(data.path, this.selectedItem.index, this.selectedItem.filename, data.index)
        .then(() => { this.showProgress = false })
        .catch((err) => { this.showProgress = false; console.error('Error loading instrument' + err) })
    }
  }
}
</script>

<style scoped>
.v-btn {
  min-width: 0;
}
</style>
