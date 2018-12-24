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

<script>

// import { mapActions } from 'vuex'
import { TypeIcons } from '../../../typeIcons.js'

export default {
  name: 'ListView',
  props: {
    text: String,
    items: {
      type: Array,
      default: () => []
    }
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
      ]
    }
  },
  methods: {
    get_icon (itemTypeId) {
      return TypeIcons.get_icon(itemTypeId)
    }
  },
  computed: {
    dataItems: function () {
      return this.$props.items
    }
  }
}
</script>
