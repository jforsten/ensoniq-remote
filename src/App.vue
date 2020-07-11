<template>
  <v-app>
    <v-navigation-drawer
      temporary
      fixed
      mini-variant
      clipped
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
    >
      <v-app-bar-nav-icon @click.native.stop="drawer = !drawer" />
      <MediaSelectPanel />

    </v-app-bar>
    <v-main>
      <ErrorView />
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-main>
    <v-footer app height="22" class="pa-0 pb-1">
      <FooterView />
    </v-footer>
  </v-app>
</template>

<script>

import MediaSelectPanel from './components/AppView/MediaSelectPanel'
import ErrorView from './components/AppView/ErrorView'
import FooterView from './components/AppView/FooterView'

export default {
  name: 'ensoniq-remote',

  components: {
    MediaSelectPanel,
    ErrorView,
    FooterView
  },

  data: () => ({
    drawer: false,
    items: [
      { icon: 'mdi-file-tree', title: 'Browser', to: '/' },
      { icon: 'mdi-cog', title: 'Settings', to: '/settings' }
    ]
  })
}
</script>

<style>
/* To remove scroll bar in browser view which calculates its own height and makes sure the dat table only has scrolling */
 html {
  overflow: auto !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
