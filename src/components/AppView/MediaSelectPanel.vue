<template>
     <v-container fill-height fluid pa-0 ma-0>
        <v-row dense class="flex-nowrap">
          <v-col cols="6">
            <v-select
              @input="changeMedia"
              v-model="currentSelectedMediaId"
              :items="mediaList"
              item-text="name"
              item-value="id"
              label="Ensoniq media"
              single-line
            >
              <template v-slot:prepend-item>
                <v-list-item @click="changeMedia()">
                  <v-list-item-content>
                    <v-list-item-title>/dev/sdd</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="changeMedia()">
                  <v-list-item-content>
                    <v-list-item-title>/dev/sde</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
            </v-select>
          </v-col>
          <v-col>
            <v-btn icon @click="previousMedia">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn icon @click="nextMedia">
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
import { Helpers } from '../../utils/helpers'

export default {
  name: 'MediaSelectPanel',
  data () {
    return {
    }
  },
  computed: {
    ...mapState('app', [
      'currentMediaId',
      'mediaList'
    ]),
    ...mapState('settings', [
      'mediaDirectory'
    ]),
    currentSelectedMediaId: {
      get () {
        return this.currentMediaId
      },
      set (value) {
        this.updateCurrentMediaId(value)
      }
    }
  },
  methods: {
    ...mapActions({
      goDir: 'app/goDir',
      updateCurrentMediaId: 'app/updateCurrentMediaId',
      updateMediaList: 'app/updateMediaList'
    }),

    goToRoot () {
      this.goDir('/')
    },

    changeMedia () {
      this.goToRoot()
    },

    nextMedia () {
      this.updateCurrentMediaId(
        (this.currentMediaId + 1) % this.mediaList.length
      )
      this.goToRoot()
    },

    previousMedia () {
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
    }
  },
  mounted () {
    Helpers.delay(500)
      .then(() => { this.updateMediaList() })
  }
}
</script>
