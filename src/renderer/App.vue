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
              <v-icon>remove</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="nextMedia"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="refreshMedia"
            >
              <v-icon>sync</v-icon>
            </v-btn>
            </v-layout>
          </v-flex>
           <v-flex xs12>
            <v-flex pa-0 px-1>
              <font color="grey">Instruments loaded in Ensoniq:</font>
            </v-flex>
            <v-layout row> 
              <v-flex py-0 xs2 mx-1 v-for="index in 8" :key="index">    
                <v-card elevation=8 hover height=30px>
                  <v-flex px-1 mx-1 py-1>
                    <font color="grey">{{index}}:</font> <font :color="getNameColor(index)">{{getName(index)}}</font>  
                  </v-flex>
                </v-card> 
              </v-flex>
              <v-flex pa-0 ma-0 xs0>
                <v-btn
                  small
                  icon
                  @click="getDeviceLoadedInstruments"
                >
                  <v-icon>sync</v-icon>
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
        <v-spacer></v-spacer>
        <span>v0.8</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>

import { mapState, mapActions } from 'Vuex'
import { DataSource } from './utils/datasource'

export default {
  name: 'ensoniq-remote',

  data: () => ({
    clipped: true,
    drawer: false,
    fixed: true,
    items: [
      { icon: 'mdi-playlist-music', title: 'Browser', to: '/' },
      { icon: 'settings', title: 'Settings', to: '/settings' }
    ],
    miniVariant: true,
    right: true,
    rightDrawer: false,
    title: 'Ensoniq remote'
  }),

  computed: {
    ...mapState('browser', ['currentMediaId', 'mediaList', 'deviceLoadedInstruments']),

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
    updataLoadedDeviceInstrument (pos, name) {
      this.updataLoadedDeviceInstrument(this.deviceLoadedInstruments[pos] = name)
    },

    getDeviceLoadedInstruments () {

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
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons");
/* Global CSS */
</style>
