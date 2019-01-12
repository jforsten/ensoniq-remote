
<template>
  <v-card
    flat
    class="grey darken-2"
  >
    <v-layout
      row
      justify-space-around
    >
      {{panelData}}
      {{selectedItem}}
      <v-flex
        class="grey darken-2"
        xs1
        align-center
        justify-space-between="true"
        v-for="option in panelData.selectOptions"
        :key="option.text"
      >
        <v-btn
          @click="showProgress=!showProgress"
          block
          small
          class='black'
        >{{option.value}}</v-btn>

      </v-flex>
    </v-layout>
    <v-slide-y-transition>
      <v-layout
        row
        v-if="showProgress"
      >
        <v-flex class="grey darken-2">
          <v-progress-linear
            background-color="grey darken-2"
            color="error"
            v-model="value"
            height="15"
            :active="showProgress"
            :indeterminate="true"
          />
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-card>
</template>

<script>
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
  }
}
</script>

<style scoped>
.v-btn {
  min-width: 0;
}
</style>