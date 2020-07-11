<template>
     <v-container fill-height fluid pa-0 ma-0>
        <v-row dense class="flex-nowrap">
          <v-col cols="6">
            <v-select
              @input="changeMediaFile"
              v-model="currentSelectedMediaId"
              :items="mediaList"
              item-text="name"
              item-value="id"
              :label="selectLabel"
              single-line
              :menu-props="{closeOnContentClick: true}"
            >
              <template v-slot:prepend-item>
                <v-list-item v-for="(disk, index) in ensoniqDisks" :key="index" @click="selectEnsoniqDisk(disk)">
                  <v-list-item-content>
                    <v-list-item-title><v-icon small>mdi-harddisk</v-icon> <font class='body-2 font-italic'>{{disk}}</font></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
            </v-select>
          </v-col>
          <v-col>
            <v-btn icon @click="previousMediaFile">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn icon @click="nextMediaFile">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn icon @click="refreshMedia">
              <v-icon>mdi-autorenew</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import { DataSource } from '../../utils/datasource'

export default {
  name: 'MediaSelectPanel',
  data () {
    return {
      isDiskSelected: false,
      disk: '',
      selectValue: ''
    }
  },
  computed: {
    ...mapState('app', [
      'currentMediaId',
      'mediaList'
    ]),
    ...mapState('settings', [
      'mediaDirectory',
      'ensoniqDisks'
    ]),
    currentSelectedMediaId: {
      get () {
        return this.isDiskSelected ? null : this.currentMediaId
      },
      set (value) {
        this.isDiskSelected = false
        this.updateCurrentMediaId(value)
      }
    },
    selectLabel: {
      get () {
        return this.isDiskSelected ? this.disk : 'Select Ensoniq Media'
      }
    }

  },
  methods: {
    ...mapActions({
      goDir: 'app/goDir',
      updateCurrentMediaId: 'app/updateCurrentMediaId',
      updateCurrentMedia: 'app/updateCurrentMedia'
    }),

    selectEnsoniqDisk (name) {
      this.disk = name
      this.isDiskSelected = true
      this.updateCurrentMedia(name)
      this.goToRoot()
    },

    goToRoot () {
      this.goDir('/')
    },

    changeMediaFile () {
      this.goToRoot()
    },

    nextMediaFile () {
      this.updateCurrentMediaId(
        (this.currentMediaId + 1) % this.mediaList.length
      )
      this.goToRoot()
    },

    previousMediaFile () {
      var id = this.currentMediaId - 1
      if (id < 0) id = this.mediaList.length - 1
      this.updateCurrentMediaId(id)
      this.goToRoot()
    },

    refreshMedia () {
      this.updateMediaList()
      this.goToRoot()
      this.$vuetify.goTo(0, {
        duration: 100,
        offset: 0,
        easing: 'easeInOutCubic'
      })
    },

    updateMediaList () {
      DataSource.getMediaList()
    }
  }

}
</script>
