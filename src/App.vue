<template>
  <v-app>
    <v-navigation-drawer
      temporary
      fixed
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-item
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items"
          exact
        >
          <v-list-item-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      extended
      extension-height="65"
    >
      <v-app-bar-nav-icon @click.native.stop="drawer = !drawer" />
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
                <v-list-item @click="chqangeMedia()">
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
      <template v-slot:extension>
      <v-container>
        <v-row dense>
          <v-col cols="12" class="px-0 py-0 mb-1 text-no-wrap">
            <font color="grey" class="caption">Instruments loaded in Ensoniq:</font>
          </v-col>
        </v-row>
        <v-row dense class="flex-nowrap">
          <v-col
            justify-space-between="true"
            v-for="index in 8"
            :key="index + 1"
            class="pa-0 pr-2 mb-2"
          >
            <v-menu offset-y transition="slide-y-transition" bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  small
                  block
                  :disabled="progress"
                  :outlined="getButtonMode(index)"
                  :color="getButtonColor(index)"
                  v-on="getButtonMenuMode(index) ? null : on"
                  @click="instrumentButtonClicked(index)"
                  @mousedown.right="instrumentButtonRightClicked(index, $event)"
                  @mouseup.right="instrumentButtonRightClicked(index, $event)"
                >
                  <font size="1px" :color="getNameColor(index)">
                    {{getName(index)}}
                  </font>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item
                  v-for="(item, menuIndex) in menuItems"
                  :key="menuIndex"
                  @click="menuItemClicked(item.title)"
                >
                  <v-list-item-title>
                    <v-icon small>{{ item.icon }}</v-icon>
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col cols="1" class="px-3 py-0">
            <v-btn
              :loading="progress"
              small
              icon
              @click="getDeviceLoadedInstruments"
            >
              <v-icon>mdi-sync</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        </v-container>
      </template>
    </v-app-bar>
    <v-main>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-main>
    <v-footer app class="pa-0 py-1 pl-2">
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
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { DataSource } from './utils/datasource'
import { Helpers } from './utils/helpers'

export default {
  name: 'ensoniq-remote',

  data: () => ({
    clipped: true,
    drawer: false,
    fixed: true,
    items: [
      { icon: 'mdi-playlist-music', title: 'Browser', to: '/' },
      { icon: 'mdi-cog', title: 'Settings', to: '/settings' }
    ],
    miniVariant: true,
    right: true,
    rightDrawer: false,
    title: 'Ensoniq remote',
    progress: false,
    selectMode: false,
    sourceButtonIndex: 4,
    midiInputName: '<none>',
    midiOutputName: '<none>',
    menuItems: [
      { title: 'COPY', icon: 'mdi-content-copy' },
      { title: 'DELETE', icon: 'mdi-delete' }
    ],
    noteValue: 0
  }),

  computed: {
    ...mapState('browser', [
      'deviceLoadedInstruments',
      'currentMediaId',
      'mediaList'
    ]),
    ...mapState('settings', [
      'ensoniqDevice',
      'midiInput',
      'midiOutput',
      'mediaDirectory',
      'workingDirectory',
      'ensoniqStorageDevice',
      'epslin'
    ]),

    currentMidiInput: {
      get () {
        var input = DataSource.getCurrentMidiInputName()
        if (input === null) return '-'
        return input
      }
    },
    currentMidiOutput: {
      get () {
        var output = DataSource.getCurrentMidiOutputName()
        if (output === null) return '-'
        return output
      }
    },
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
      goDir: 'browser/goDir',
      updateCurrentMediaId: 'browser/updateCurrentMediaId',
      updateMediaList: 'browser/updateMediaList'
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
      console.log(this.$refs)
      this.updateMediaList()
      this.goToRoot()
      this.$vuetify.goTo(0, {
        duration: 100,
        offset: 0,
        easing: 'easeInOutCubic'
      })
    },

    getDeviceLoadedInstruments () {
      this.selectMode = false
      this.progress = true
      DataSource.getAllInstrumentData()
        .then(() => {
          this.progress = false
        })
        .catch(err => {
          console.error('Error fetching instrument data:' + err)
          this.progress = false
        })
    },

    getName (index) {
      var name = this.deviceLoadedInstruments[index - 1]
      return name === null ? '<none>' : name
    },

    getNameColor (index) {
      var name = this.deviceLoadedInstruments[index - 1]
      if (name === null) return this.selectMode ? 'grey' : ''
      return 'white'
    },

    getButtonColor (index) {
      return this.deviceLoadedInstruments[index - 1] === null
        ? 'grey darken-3'
        : 'grey darken-1'
    },

    getButtonMode (index) {
      return !(this.selectMode && index !== this.sourceButtonIndex)
    },

    getButtonMenuMode (index) {
      return (
        this.deviceLoadedInstruments[index - 1] === null || this.selectMode // No menu for empty instruments or...
      ) // ... when copying
    },

    instrumentButtonClicked (pos) {
      console.log(pos)
      if (this.selectMode) {
        // Clicking source button will cancel the copy
        if (pos === this.sourceButtonIndex) {
          this.selectMode = false
          return
        }
        this.selectMode = false
        this.progress = true
        DataSource.copyInstrument(this.sourceButtonIndex, pos).then(() => {
          this.progress = false
        })
        return
      }
      this.sourceButtonIndex = pos
    },

    instrumentButtonRightClicked (pos, e) {
      console.warn(e)
      console.warn('RIGHT:' + pos)
      if (e.type === 'mousedown') {
        var relativeX = 0
        if (e.target.nodeName === 'BUTTON') {
          relativeX =
            1 -
            (e.target.offsetLeft + e.target.offsetWidth - e.clientX) /
              e.target.offsetWidth
        }

        if (e.target.nodeName === 'DIV') {
          relativeX =
            1 -
            (e.target.parentElement.offsetLeft +
              e.target.parentElement.offsetWidth -
              e.clientX) /
              e.target.parentElement.offsetWidth
        }

        if (e.target.nodeName === 'FONT') {
          relativeX =
            1 -
            (e.target.parentElement.parentElement.offsetLeft +
              e.target.parentElement.parentElement.offsetWidth -
              e.clientX) /
              e.target.parentElement.parentElement.offsetWidth
        }

        console.log('hit button - pos:' + relativeX)
        this.noteValue = Math.round((relativeX * 0.5 + 0.25) * 0x7f)
      }

      DataSource.playInstrument(
        pos,
        this.noteValue,
        e.type === 'mousedown' ? 0x7f : 0x00
      )
    },

    menuItemClicked (title) {
      console.log(title)
      if (title === 'COPY') {
        this.selectMode = true
      }
      if (title === 'DELETE') {
        this.progress = true
        DataSource.deleteInstrument(this.sourceButtonIndex).then(() => {
          this.progress = false
        })
      }
    }
  },

  mounted () {
    DataSource.loadSettings()
      .then(() => Helpers.delay(1000))
      .then(() => {
        this.updateMediaList()
      })
      .then(() => DataSource.initializeMidi())
      .then(() => {
        this.midiInputName = this.currentMidiInput
        this.midiOutputName = this.currentMidiOutput
      })
      .then(() => this.getDeviceLoadedInstruments())
  }
}
</script>

<style>
/* Global CSS */
 html {
  overflow: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
/* html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
} */
</style>
