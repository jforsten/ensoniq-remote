<template>
  <v-layout
    row
    wrap
    justify-center
  >
    <v-flex xs11>
      <v-flex my-2>
        <div class="grey darken-3">
          <v-card-text>
            <font color="grey">Path:</font> {{currentPathName}}
          </v-card-text>
        </div>
      </v-flex>
      <div
        remove_this____style="max-height:calc(100vh - 220px); overflow-y: auto"
        ref="scrollView"
      >
        <v-data-table
          :headers="headers"
          :items="dataItems"
          item-key="index"
          hide-actions
          _remove_this_part___style="max-height: 300px; overflow-y: auto"
        >
          <template
            slot="items"
            slot-scope="props"
          >
            <tr
              v-bind:class="{'grey': props.expanded}"
              @click="props.expanded = item_click_handler(props.item, props.expanded)"
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
            <component
              :is="selectedPanel"
              :panelData="panelData"
              :selectedItem=props
            ></component>
          </template>
        </v-data-table>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>

import { mapState, mapActions } from 'Vuex'
import { TypeIcon } from '../utils/typeIcon'
import { EnsoniqType } from '../utils/ensoniqType'
import { Helpers } from '../utils/helpers'
import InstrumentPanel from './BrowserView/InstrumentPanel'

export default {
  name: 'browser',

  components: {
    InstrumentPanel
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
      expandPanel: false
    }
  },

  computed: {
    ...mapState('browser', ['items', 'currentPath', 'currentPathName', 'currentMediaId', 'mediaList']),

    // Change name casing
    dataItems: function () {
      // Make local copy from store data
      var tmpItems = JSON.parse(JSON.stringify(this.items))

      return tmpItems.map(i => {
        var item = i
        if (item.name !== undefined) {
          item.name = Helpers.capital_letter(item.name)
        }
        return item
      })
    },
    selectedPanel: function () {
      return 'InstrumentPanel'
    },
    panelData: function () {
      return {
        selectOptions: [
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 },
          { text: '5', value: 5 },
          { text: '6', value: 6 },
          { text: '7', value: 7 },
          { text: '8', value: 8 }
        ]
      }
    }
  },

  methods: {

    ...mapActions({
      addItems: 'browser/updateItems',
      goDir: 'browser/goDir'
    }),

    goToRoot () {
      this.goDir('/')
    },

    item_click_handler (item, expanded) {
      if (expanded) return false
      switch (item.type_id) {
        case EnsoniqType.Instrument:
          return true
        case EnsoniqType.Directory:
          this.goDir(item.index)
          this.scrollToTop()
          return false
        case EnsoniqType.Parent_Directory:
          this.goDir('..')
          this.scrollToTop()
          return false
      }
    },

    get_icon (itemTypeId) {
      return TypeIcon.get_icon(itemTypeId)
    },

    scrollToTop () {
      this.$vuetify.goTo(
        0,
        {
          duration: 100,
          offset: 0,
          easing: 'easeInOutCubic'
        })
    }
  }
}
</script>

<style scoped>
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
