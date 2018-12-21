<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs12 md4 offset-md1 class="text-xs-center centered">
      <!--img id="logo" class="logo" src="~@/assets/logo.png" alt="electron-vue"-->
    </v-flex>
    <v-flex xs12 md6 class="text-xs-center centered">
      <!--img id="logo" class="logo" src="/static/v.png" alt="Vuetifyjs"-->
    </v-flex>
    <v-flex xs10 class="mt-4">
      <!--system-information></system-information-->
      <v-flex xs12 sm6 d-flex>
        <v-select @input="change_media" v-model="currentMedia" :items="mediaList" box label="Ensoniq media file" />
      </v-flex>
    </v-flex>
    <v-flex xs10 class="mt-4">
      <v-data-table :headers="headers" :items="items" item-key="index" hide-actions>
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'grey': props.expanded}" @click="props.expanded = !props.expanded && props.item.type_id === '3';item_click_handler(props.item)">
            <td class="justify-center">
              <v-icon small class="mr-2">
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
        <template slot="expand" slot-scope="props">
          <v-card flat class="grey darken-2">
            <v-layout row>
              <v-flex class="grey darken-2" mx-1 v-for="option in selectOptions" :key="option.text"> 
                <v-btn @click="show=!show" block small class='black'>{{option.value}}</v-btn>
              </v-flex>
            </v-layout>
            <v-slide-y-transition>
              <v-layout row v-if="show">
                <v-flex class="grey darken-2">
                  <v-progress-linear background-color="grey darken-2" color="error" v-model="value" height="15" :active="show" :indeterminate="true"/>
                </v-flex>   
              </v-layout>       
            </v-slide-y-transition>
          </v-card>
        </template>
      </v-data-table>
    </v-flex>
    <v-flex xs10 class="mt-4">
      <v-card>
        <v-card-title class="headline">Docs</v-card-title>
        <v-divider></v-divider>
        <v-card-actions class="pt-3 pb-3">
          <v-spacer></v-spacer>
          <v-btn class="link-btn" @click="open('https://vuejs.org/v2/guide/')">Vue</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="link-btn" @click="open('https://electron.atom.io/docs/')">Electron</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="link-btn" @click="open('https://vuetifyjs.com')">Vuetify</v-btn>
          <v-btn class="link-btn" @click="reset()"> reset </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import SystemInformation from './WelcomeView/SystemInformation'
  import { spawn } from 'child_process'
  import { TypeIcons } from '../../enums.js'
  export default {
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
        items: [],
        currentPath: '/',
        mediaList: ['./TheArtOfTranswaves.iso', './PellePiano_Demos.iso'],
        currentMedia: './TheArtOfTranswaves.iso',
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
    mounted () {
      this.reset()
    },
    name: 'welcome',
    components: { SystemInformation },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      reset () {
        this.currentPath = '/'
        this.run('./epslin', ['-J', this.currentMedia])
      },
      change_media () {
        console.log(this.currentMedia)
        this.reset()
      },
      item_click_handler (item) {
        switch (item.type_id) {
          case '2':
            this.go_dir(item.index)
            break
          case '8':
            this.go_parent_dir()
            break
        }
      },
      run (cmd, args) {
        const p = spawn(cmd, args, {cwd: '/Users/jforsten/Projects/EpsLin'})
        p.stdout.on('data', (data) => {
          // console.log('stdout: ' + data)
          this.items = JSON.parse(data).items.map(obj => {
            var rObj = {}
            rObj = obj
            if (rObj.name !== undefined) {
              rObj.name = this.capital_letter(rObj.name)
            }
            return rObj
          })
        })

        p.stderr.on('data', (data) => {
          console.log('stderr: ' + data)
        })

        p.on('close', (code) => {
          console.log('child process exited with code ' + code)
        })
      },
      get_icon (itemTypeId) {
        switch (itemTypeId) {
          case '1':
          case '27':
          case '32':
            return TypeIcons.OS // OS
          case '9':
          case '34':
            return TypeIcons.MACRO // Macro
          case '2':
            return TypeIcons.DIR // Dir
          case '8':
            return TypeIcons.ROOT // ..
          case '3':
            return TypeIcons.INSTRUMENT // Inst
          case '4':
          case '23':
          case '30':
            return TypeIcons.BANK // Bank
          case '5':
          case '25':
          case '28':
            return TypeIcons.SEQ
          case '6':
          case '26':
          case '29':
            return TypeIcons.SONG
          default:
            return ''
        }
      },
      capital_letter (str) {
        str = str.trim().toLowerCase()
        str = str.split(' ')

        for (var i = 0, x = str.length; i < x; i++) {
          if (str[i].length > 1) { str[i] = str[i][0].toUpperCase() + str[i].substr(1) }
        }

        return str.join(' ')
      },
      go_dir (dirId) {
        console.log(dirId)
        if (this.currentPath === '/') {
          this.currentPath = '/' + dirId
        } else {
          this.currentPath = this.currentPath + '/' + dirId
        }
        this.run('./epslin', ['-J', '-d' + this.currentPath, this.currentMedia])
        console.log('currentPath:' + this.currentPath)
      },
      go_parent_dir () {
        var pathParts = this.currentPath.split('/')
        pathParts.pop()
        pathParts = pathParts.join('/')
        this.currentPath = pathParts
        if (this.currentPath === '') this.currentPath = '/'
        console.log('currentPath:' + this.currentPath)
        this.run('./epslin', ['-J', '-d' + this.currentPath, this.currentMedia])
      }
    }
  }
</script>

<style scoped>
  .v-btn {
    min-width: 0;
  }

  .centered
  {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo
  {
    max-width: 100%;
  }

  .table-name
  {
    color:salmon
    
  }

  .link-btn
  {
    width: 150px;
  }
</style>
