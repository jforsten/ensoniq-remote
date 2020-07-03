<template>
  <div id="app">
    <v-app dark>
      <v-navigation-drawer
        temporary
        fixed
        :mini-variant="miniVariant"
        :clipped="clipped"
        v-model="drawer"
        app
      >
        <v-list>
          <v-list-tile
            router
            :to="item.to"
            :key="i"
            v-for="(item, i) in items"
            exact
          >
            <v-list-tile-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar
        extended
        app
        height=70px
      >

        <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>

        <!-- <v-btn icon @click.native.stop="miniVariant = !miniVariant">
          <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
        </v-btn>
        <v-btn icon @click.native.stop="clipped = !clipped">
          <v-icon>web</v-icon>
        </v-btn> -->
        <!-- <v-btn icon @click.native.stop="fixed = !fixed">
          <v-icon>remove</v-icon>
        </v-btn> -->
        <!-- <v-toolbar-title v-text="title"></v-toolbar-title>
        <v-spacer></v-spacer> -->
        <!-- <v-btn icon @click.native.stop="rightDrawer = !rightDrawer">
          <v-icon>menu</v-icon>
        </v-btn> -->
        <v-container 
          fill-height
          fluid
          justify-start
          pa-0
          ma-0
        >
        <v-layout row wrap>
          <v-flex
            xs8
            ml-2
            pt-2
          >
            <v-layout>
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
                <v-list-tile @click="chqangeMedia()">
                  <v-list-tile-content>
                    <v-list-tile-title>/dev/sdd</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                  <v-list-tile @click="changeMedia()">
                    <v-list-tile-content>
                      <v-list-tile-title>/dev/sde</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                <v-divider class="mt-2"></v-divider>
              </template>
            </v-select>
            <v-btn
              icon
              @click="previousMedia"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="nextMedia"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="refreshMedia"
            >
              <v-icon>mdi-autorenew</v-icon>
            </v-btn>
            </v-layout>
          </v-flex>
           <v-flex xs12>
            <v-flex pa-0 px-1>
              <font color="grey">Instruments loaded in Ensoniq:</font>
            </v-flex>
            <v-layout row> 
              <v-flex 
                xs3 
                mx-1
                justify-space-between="true"
                v-for="index in 8" :key="index+1"
              >    
               <!--  <v-card elevation=8 hover height="30px">
                  <v-flex px-1 mx-1 my-1 py-2>
                    <div
                      class="text-no-wrap caption"
                      style="width: 8rem;"
                    >
                      <font color="grey">{{index}}:</font> <font :color="getNameColor(index)">{{getName(index)}}</font>  
                    </div>
                  </v-flex>
                </v-card>  -->
                <v-menu 
                  offset-y
                   transition="slide-y-transition"
                  bottom
                >
                  <template v-slot:activator="{ on }">
                    <v-btn 
                      small
                      block
                      :disabled="progress"
                      :outline="getButtonMode(index)"
                      :color="getButtonColor(index)"
                      v-on="getButtonMenuMode(index) ? null : on"
                      @click="instrumentButtonClicked(index)"
                      @mousedown.right="instrumentButtonRightClicked(index, $event)"
                      @mouseup.right="instrumentButtonRightClicked(index, $event)"
                    > 
                      <font size="1px" :color="getNameColor(index)">{{getName(index)}}</font>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-tile
                      v-for="(item, menuIndex) in menuItems"
                      :key="menuIndex"
                      @click="menuItemClicked(item.title)"
                    >
                      <v-list-tile-title>
                        <v-icon small>{{ item.icon }}</v-icon>
                        {{ item.title }}
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-flex>
              <v-flex px-3 xs0>
                <v-btn
                  :loading="progress"
                  small
                  icon
                  @click="getDeviceLoadedInstruments"
                >
                  <v-icon>mdi-sync</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        </v-container>
        </v-toolbar>
      <v-content>
        <v-container
          fluid
          fill-height
        >
          <v-slide-y-transition mode="out-in">
            <router-view></router-view>
          </v-slide-y-transition>
        </v-container>
      </v-content>
      <!-- <v-navigation-drawer temporary fixed :right="right" v-model="rightDrawer" app>
        <v-list>
          <v-list-tile @click.native="right = !right">
            <v-list-tile-action>
              <v-icon light>compare_arrows</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer> -->
      <v-footer
        :fixed="fixed"
        app
      >
       <v-flex shrink pa-2>
        <font color="grey">
        <v-icon small color="grey darken-2">mdi-piano</v-icon>
        {{ensoniqDevice}} 
        <v-icon small color="grey darken-2">mdi-power-on</v-icon>
        <v-icon small color="grey darken-2">mdi-login-variant</v-icon>
        {{midiInputName}}
        <v-icon small color="grey darken-2">mdi-power-on</v-icon>
        <v-icon small color="grey darken-2">mdi-logout-variant</v-icon>
        {{midiOutputName}}
        </font>
        </v-flex>
        <v-spacer></v-spacer> 
        <v-flex shrink pa-2>      
        <font color="grey">Version: 0.9</font>
        </v-flex>
      </v-footer>
    </v-app>
  </div>
</template>

<script>

import { mapState, mapActions } from 'Vuex'
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
      { icon: 'mdi-settings', title: 'Settings', to: '/settings' }
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
      this.updateCurrentMediaId((this.currentMediaId + 1) % this.mediaList.length)
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
      this.$vuetify.goTo(
        0,
        {
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
        }).catch((err) => {
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
      return (this.deviceLoadedInstruments[index - 1] === null) ? 'grey darken-3' : 'grey darken-1'
    },

    getButtonMode (index) {
      return !(this.selectMode && index !== this.sourceButtonIndex)
    },

    getButtonMenuMode (index) {
      return (this.deviceLoadedInstruments[index - 1] === null) || // No menu for empty instruments or...
      this.selectMode // ... when copying
    },

    instrumentButtonClicked (pos) {
      console.log(pos)
      if (this.selectMode) {
        // Clicking source button will cancel the copy
        if (pos === this.sourceButtonIndex) { this.selectMode = false; return }
        this.selectMode = false
        this.progress = true
        DataSource.copyInstrument(this.sourceButtonIndex, pos)
          .then(() => { this.progress = false })
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
          relativeX = (1 - ((e.target.offsetLeft + e.target.offsetWidth - e.clientX) / e.target.offsetWidth))
        }

        if (e.target.nodeName === 'DIV') {
          relativeX = (1 - ((e.target.parentElement.offsetLeft + e.target.parentElement.offsetWidth - e.clientX) / e.target.parentElement.offsetWidth))
        }

        if (e.target.nodeName === 'FONT') {
          relativeX = (1 - ((e.target.parentElement.parentElement.offsetLeft + e.target.parentElement.parentElement.offsetWidth - e.clientX) / e.target.parentElement.parentElement.offsetWidth))
        }

        console.log('hit button - pos:' + relativeX)
        this.noteValue = Math.round((relativeX * 0.5 + 0.25) * 0x7f)
      }

      DataSource.playInstrument(pos, this.noteValue, e.type === 'mousedown' ? 0x7f : 0x00)
    },

    menuItemClicked (title) {
      console.log(title)
      if (title === 'COPY') {
        this.selectMode = true
      }
      if (title === 'DELETE') {
        this.progress = true
        DataSource.deleteInstrument(this.sourceButtonIndex)
          .then(() => { this.progress = false })
      }
    }
  },

  mounted () {
    DataSource.loadSettings()
      .then(() => Helpers.delay(1000))
      .then(() => { this.updateMediaList() })
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
</style>
