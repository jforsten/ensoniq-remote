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
      <MediaSelectPanel />
      <template v-slot:extension>
        <EnsoniqRemotePanel />
      </template>
    </v-app-bar>
    <v-main>
      <ErrorView :message.sync="errorMessage" />
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-main>
    <v-footer app height="22" class="pa-0 pb-1">
      <FooterView
        :ensoniqDevice="ensoniqDevice"
        :midiInputName="currentMidiInput"
        :midiOutputName="currentMidiOutput"
       />
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import { DataSource } from './utils/datasource'
import FooterView from './components/AppView/FooterView'
import ErrorView from './components/AppView/ErrorView'
import MediaSelectPanel from './components/AppView/MediaSelectPanel'
import EnsoniqRemotePanel from './components/AppView/EnsoniqRemotePanel'

export default {
  name: 'ensoniq-remote',

  components: {
    EnsoniqRemotePanel,
    MediaSelectPanel,
    FooterView,
    ErrorView
  },

  data: () => ({
    errorMessage: '',
    clipped: true,
    drawer: false,
    fixed: true,
    items: [
      { icon: 'mdi-file-tree', title: 'Browser', to: '/' },
      { icon: 'mdi-cog', title: 'Settings', to: '/settings' }
    ],
    miniVariant: true,
    right: true,
    rightDrawer: false,
    title: 'Ensoniq remote'
  }),

  computed: {
    ...mapState('settings', [
      'ensoniqDevice',
      'midiInput',
      'midiOutput'
    ]),

    currentMidiInput: {
      get () {
        var input = DataSource.getCurrentMidiInputName()
        if (input === null || input === undefined || input === '') return '<none>'
        return input
      }
    },
    currentMidiOutput: {
      get () {
        var output = DataSource.getCurrentMidiOutputName()
        if (output === null || output === undefined || output === '') return '<none>'
        return output
      }
    }
  },

  methods: {

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
