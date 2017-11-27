require('./board')
require('./chat')
const { deepstream } = require('deepstream.io-client-js')
const config = require('../../config')

Vue.component('page', {
  template: `
<div>
    <div class="username-modal" v-if="newUser" @close="newUser = false">
        <form class="user-login" action="#" v-on:submit.prevent="storeUsername">
            <label class="title pic">Pictionary!</label>
            <label class="title">enter name here</label>
            <br>
            <input class="username-input" v-model="username" type="text" />
        </form>
    </div>
    <div class="gamebox">
  <board v-if="!newUser" :record="record" :ds="ds" :newUser="newUser" :isCurrentDrawer="isCurrentDrawer" :username="username"></board>
  <chat v-if="!newUser" :record="record" :ds="ds" :users="users" :newUser="newUser" :isCurrentDrawer="isCurrentDrawer" :username="username"></chat>
  </div>
</div>`,

  data: function() {
    return {
        newUser: true,
        username: '',
        isCurrentDrawer: false,
        users: null,
        record: null,
        ds: null
    }
  },

  methods: {
    storeUsername: async function () {
      this.$data.ds = deepstream(config.url)
      await this.$data.ds.login({ username: this.$data.username })
      this.$data.record = this.$data.ds.record.getRecord('state')
      this.$data.users = this.$data.ds.record.getList('users')

      await this.$data.record.whenReady()
      await this.$data.users.whenReady()

      if (this.$data.record.get('gamemaster') === this.$data.username) {
        this.$data.isCurrentDrawer = true
      }
      this.$data.newUser = false
    }
  }
})
