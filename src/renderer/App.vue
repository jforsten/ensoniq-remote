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
        :key="componentKey"
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
            xs5
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
              label="Ensoniq media file"
            />
         
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
              <v-flex py-0 xs2 mx-1 v-for="index in 8" :key="index">    
                <v-card elevation=8 hover height=30px :key="deviceLoadedInstruments[index]">
                  <v-flex px-1 mx-1 my-1 py-2>
                    <div
                      class="text-no-wrap caption"
                      style="width: 8rem;"
                    >
                      <font color="grey">{{index}}:</font> <font :color="getNameColor(index)">{{getName(index)}}</font>  
                    </div>
                  </v-flex>
                </v-card> 
              </v-flex>
              <v-flex pa-0 ma-0 xs0>
                 <v-progress-circular
                  v-if="progress"
                  :size="35"
                  :width="2"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
                <v-btn
                  v-else
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
        ASR-10 
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
        <font color="grey">Version: 0.8</font>
        </v-flex>
      </v-footer>
    </v-app>
  </div>
</template>

<script>

import { mapState, mapActions } from 'Vuex'
import { DataSource } from './utils/datasource'
import { Midi } from './utils/midi'

export default {
  name: 'ensoniq-remote',

  data: () => ({
    deviceLoadedInstruments: [null, null, null, null, null, null, null, null],
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
    componentKey: 0,
    progress: false,
    midiInputName: '<none>',
    midiOutputName: '<none>'
  }),

  computed: {
    ...mapState('browser', [
      'currentMediaId',
      'mediaList'
    ]),
    ...mapState('settings', [
      'midiInput',
      'midiOutput',
      'mediaDirectory',
      'workingDirectory',
      'ensoniqStorageDevice',
      'epslin'
    ]),

    currentMidi: {
      get () {
        var name = Midi.getInputName(this.midiInput)
        console.warn('port:' + this.midiInput + 'NAME:' + name)
        return name
      }
    },
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
    updateLoadedDeviceInstrument (pos, name) {
      this.deviceLoadedInstruments[pos - 1] = name
      console.log('update data from callback - pos: ' + pos + ' name:' + name)
      console.log(this.deviceLoadedInstruments)
      this.componentKey++
    },

    getDeviceLoadedInstruments () {
      this.progress = true
      DataSource.getAllInstrumentData()
        .then((names) => {
          for (let index = 0; index < names.length; index++) {
            this.updateLoadedDeviceInstrument(index + 1, names[index])
            this.progress = false
          }
        }).catch((e) => { this.progress = false })
    },

    getInstumentCallback (pos, name) {
      this.updateLoadedDeviceInstrument(pos, name)
    },

    getName (index) {
      var name = this.deviceLoadedInstruments[index - 1]
      return name === null ? 'EMPTY' : name
    },

    getNameColor (index) {
      var name = this.deviceLoadedInstruments[index - 1]
      if (name === null) return 'grey'
      return 'white'
    }
  },

  mounted () {
    DataSource.loadSettings()
    this.updateMediaList()
    DataSource.initializeMidi()
      .then(() => {
        console.log('REFRESH MIDI NAMES')
        this.midiInputName = this.currentMidiInput
        this.midiOutputName = this.currentMidiOutput
      })
  }
}
</script>

<style>
/* Global CSS */
</style>
