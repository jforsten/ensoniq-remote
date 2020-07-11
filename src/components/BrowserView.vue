<template>
<v-container
  fluid
  fill-height
  align-content-start
>
  <EnsoniqRemotePanel class="pa-0 pb-2" />
  <v-row
    dense
    v-resize="onResize"
    class="flex-nowrap"
  >
    <v-col
      cols="12"
      class="pa-0 ma-0"
    >
      <v-col
        class="pa-1"
      >
      <font color="grey" class="text-caption">
        {{currentMediaLabel}}: {{currentPathName}}
      </font>
      </v-col>
        <v-data-table
          no-data-text="Please select Ensoniq media"
          :headers="headers"
          :items="dataItems"
          item-key="index"
          single-select
          hide-default-footer
          fixed-header
          :height="windowSize.y - 250.0"
          mobile="false"
          dense
          @click:row="item_click_handler"
          single-expand
          :expanded.sync="expanded"
          mobile-breakpoint=""
        >
          <template v-slot:item.type_id="{ item }">
            <v-icon small class="mr-2">
              {{get_icon(item.type_id)}}
            </v-icon>
          </template>
          <template v-slot:expanded-item="{ item }">
             <td class="pa-0" :colspan="headers.length">
              <component
              :is="selectedPanel"
              :panelData="panelData"
              :selectedItem="item"
              />
             </td>
          </template>
        </v-data-table>
    </v-col>
  </v-row>
</v-container>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import { TypeIcon } from '@/utils/typeIcon'
import { EnsoniqFileType } from '@/utils/ensoniqFileType'
import { Helpers } from '@/utils/helpers'
import InstrumentPanel from '@/components/BrowserView/InstrumentPanel'
import EnsoniqRemotePanel from '@/components/BrowserView/EnsoniqRemotePanel'

const headerStyle = 'secondary'

export default {
  name: 'browser',

  components: {
    EnsoniqRemotePanel,
    InstrumentPanel
  },

  data () {
    return {
      headers: [
        { text: '', value: 'type_id', class: headerStyle },
        { text: 'Name', value: 'name', class: headerStyle },
        { text: 'Index', value: 'index', class: headerStyle /*, align: 'right' */ },
        { text: 'Type', value: 'type', class: headerStyle },
        { text: 'Blocks', value: 'blocks', class: headerStyle /*, align: 'right' */ },
        { text: 'Bytes', value: 'bytes', class: headerStyle /*, align: 'right' */ }
      ],
      showMediaInfo: false,
      ensoniqName: '',
      mediaUsedBlocks: '',
      mediaFreeBlocks: '',
      expandPanel: false,
      expanded: [],
      windowSize: {
        x: 0,
        y: 0
      }
    }
  },

  computed: {
    ...mapState('app',
      [
        'items',
        'currentPath',
        'currentPathName',
        'currentMediaId',
        'currentMediaLabel',
        'mediaList',
        'deviceLoadedInstruments'
      ]
    ),

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
          { text: '1', value: { path: this.currentPath, index: 1 } },
          { text: '2', value: { path: this.currentPath, index: 2 } },
          { text: '3', value: { path: this.currentPath, index: 3 } },
          { text: '4', value: { path: this.currentPath, index: 4 } },
          { text: '5', value: { path: this.currentPath, index: 5 } },
          { text: '6', value: { path: this.currentPath, index: 6 } },
          { text: '7', value: { path: this.currentPath, index: 7 } },
          { text: '8', value: { path: this.currentPath, index: 8 } }
        ]
      }
    }
  },

  methods: {

    ...mapActions({
      addItems: 'app/updateItems',
      goDir: 'app/goDir',
      updateDeviceLoadedInstuments: 'app/updateDeviceLoadedInstruments'
    }),

    goToRoot () {
      this.goDir('/')
    },

    updataLoadedDeviceInstrument (pos, name) {
      this.updataLoadedDeviceInstrument(this.deviceLoadedInstruments[pos] = name)
    },

    getDeviceLoadedInstruments () {

    },

    handle_click (value) {
      console.log(value)
      this.item_click_handler(value, false)
    },

    item_click_handler (item, row) {
      switch (item.type_id) {
        case EnsoniqFileType.Instrument:
          row.select(!row.isSelected)
          row.expand(!row.isSelected)
          return true
        case EnsoniqFileType.Directory:
          // Clear expand & selection
          this.expanded = []
          row.select(true)
          row.select(false)
          this.goDir(item.index)
          this.scrollToTop()
          return false
        case EnsoniqFileType.Parent_Directory:
          // Clear expand & selection
          this.expanded = []
          row.select(true)
          row.select(false)
          this.goDir('..')
          this.scrollToTop()
          return false
      }
      console.log('no types matched!')
    },

    get_icon (itemTypeId) {
      return TypeIcon.get_icon(itemTypeId)
    },

    scrollTo (pos, duration) {
      this.$vuetify.goTo(
        pos,
        {
          duration: duration,
          offset: 0,
          easing: 'easeInOutCubic'
        })
    },

    scrollToTop () {
      this.scrollTo(0, 100)
    },

    onResize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
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
