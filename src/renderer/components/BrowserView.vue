<template>
  <v-layout
    row
    wrap
    justify-center
    id="wrapper"
  >
    <v-flex
      xs12
      md4
      offset-md1
      class="text-xs-center centered"
    >
      <!--img id="logo" class="logo" src="~@/assets/logo.png" alt="electron-vue"-->
    </v-flex>
    <v-flex
      xs12
      md6
      class="text-xs-center centered"
    >

      <!--img id="logo" class="logo" src="/static/v.png" alt="Vuetifyjs"-->
    </v-flex>
    <v-flex
      xs10
      class="mt-4"
    >
      <!--system-information></system-information-->
      <v-layout>
        <v-flex
          xs6
          mr-2
        >
          <v-select
            @input="change_media"
            v-model="currentSelectedMedia"
            :items="mediaList"
            box
            autofocus
            label="Ensoniq media file"
          />
        </v-flex>
        <v-flex
          xs6
          ml-2
        >
          <v-card
            flat
            v-if="showMediaInfo"
          >
            <div>
              <span class="grey--text"> Name: {{ensoniqName}}</span><br>
              <span class="grey--text"> Used blocks: {{mediaUsedBlocks}} </span><br>
              <span class="grey--text"> Free blocks: {{mediaFreeBlocks}} </span>
            </div>
          </v-card>

        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex
      xs10
      class="mt-4"
    >
      <v-flex my-2>
        <div class="grey darken-3">
          <v-card-text>
            <small>
              <font color="grey">Path:</font> {{currentPathName}}
            </small>
          </v-card-text>
        </div>
      </v-flex>
      <template>
        <v-data-table
          :headers="headers"
          :items="dataItems"
          item-key="index"
          hide-actions
        >
          <template
            slot="items"
            slot-scope="props"
          >
            <tr
              v-bind:class="{'grey': props.expanded}"
              @click="props.expanded = !props.expanded && props.item.type_id === '3';item_click_handler(props.item)"
            >
              <td class="justify-center">
                <v-icon
                  small
                  class="mr-2"
                >
                  {{get_icon(props.item.type_id)}}
                </v-icon>
              </td>
              <td class="subheading">{{ props.item.name }}</td>
              <td>{{ props.item.index }}</td>
              <td>{{ props.item.type }}</td>
              <td>{{ props.item.blocks }}</td>
              <td>{{ props.item.bytes }}</td>
            </tr>
          </template>
          <template
            slot="expand"
            slot-scope="props"
          >
            <v-card
              flat
              class="grey darken-2"
            >
              <v-layout row>
                <v-flex
                  class="grey darken-2"
                  mx-1
                  v-for="option in selectOptions"
                  :key="option.text"
                >
                  <v-btn
                    @click="show=!show"
                    block
                    small
                    class='black'
                  >{{option.value}}</v-btn>
                </v-flex>
              </v-layout>
              <v-slide-y-transition>
                <v-layout
                  row
                  v-if="show"
                >
                  <v-flex class="grey darken-2">
                    <v-progress-linear
                      background-color="grey darken-2"
                      color="error"
                      v-model="value"
                      height="15"
                      :active="show"
                      :indeterminate="true"
                    />
                  </v-flex>
                </v-layout>
              </v-slide-y-transition>
            </v-card>
          </template>
        </v-data-table>
      </template>
    </v-flex>
    <v-flex
      xs10
      class="mt-4"
    >
      <v-card>
        <v-card-title class="headline">Actions</v-card-title>
        <v-divider></v-divider>
        <v-card-actions class="pt-3 pb-3">
          <v-spacer></v-spacer>
          <v-btn
            class="link-btn"
            @click="open('https://vuejs.org/v2/guide/')"
          >Vue</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="link-btn"
            @click="open('https://electron.atom.io/docs/')"
          >Electron</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="link-btn"
            @click="updateMediaList()"
          >update media</v-btn>
          <v-btn
            class="link-btn"
            @click="goToRoot()"
          > Root </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'Vuex'
import SystemInformation from './WelcomeView/SystemInformation'
import { TypeIcons } from '../utils/typeIcons.js'

export default {
  name: 'browser',

  components: {
    SystemInformation
  },

  data () {
    return {
      headers: [
        { text: '', value: 'name', sortable: false },
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Index', value: 'index' },
        { text: 'Type', value: 'type' },
        { text: 'Blocks', value: 'blocks' },
        { text: 'Bytes', value: 'bytes' }
      ],
      showMediaInfo: false,
      ensoniqName: '',
      mediaUsedBlocks: '',
      mediaFreeBlocks: '',
      selectOptions: [
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' },
        { text: '5', value: '5' },
        { text: '6', value: '6' },
        { text: '7', value: '7' },
        { text: '8', value: '8' }
      ],
      value: 0,
      show: false
    }
  },

  computed: {
    ...mapState('browser', ['items', 'currentPath', 'currentPathName', 'currentMedia', 'mediaList']),

    // Change name casing
    dataItems: function () {
      // Make local copy from store data
      var tmpItems = JSON.parse(JSON.stringify(this.items))

      return tmpItems.map(i => {
        var item = i
        if (item.name !== undefined) {
          item.name = this.capital_letter(item.name)
        }
        return item
      })
    },

    currentSelectedMedia: {
      get () {
        return this.currentMedia
      },
      set (value) {
        this.updateCurrentMedia(value)
      }
    }

  },

  methods: {

    ...mapActions({
      addItems: 'browser/updateItems',
      goDir: 'browser/goDir',
      updateCurrentMedia: 'browser/updateCurrentMedia',
      updateMediaList: 'browser/updateMediaList'
    }),

    open (link) {
      this.$electron.shell.openExternal(link)
    },

    goToRoot () {
      this.goDir('/')
    },

    change_media () {
      this.goToRoot()
    },

    item_click_handler (item) {
      switch (item.type_id) {
        case '2':
          this.goDir(item.index)
          break
        case '8':
          this.goDir('..')
          break
      }
    },

    get_icon (itemTypeId) {
      return TypeIcons.get_icon(itemTypeId)
    },

    capital_letter (str) {
      str = str.trim().toLowerCase()
      str = str.split(' ')
      for (var i = 0, x = str.length; i < x; i++) {
        if (str[i].length > 1) { str[i] = str[i][0].toUpperCase() + str[i].substr(1) }
      }
      return str.join(' ')
    }
  },

  created () {
    console.log('Browser - CREATED')
  },

  mounted () {
    console.log('Browser - MOUNTED')
    this.updateMediaList()
  }
}
</script>

<style scoped>
.v-btn {
  min-width: 0;
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  max-width: 100%;
}

.table-name {
  color: salmon;
}

.link-btn {
  width: 150px;
}
</style>
