require('./board')
require('./chat')
const ds = require('../services/ds')

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
  <board v-if="!newUser" :record="record" :newUser="newUser" :isCurrentDrawer="isCurrentDrawer" :username="username"></board>
  <chat v-if="!newUser" :record="record" :newUser="newUser" :isCurrentDrawer="isCurrentDrawer" :username="username"></chat>
  </div>
</div>`,

  data: function() {
    return {
        newUser: true,
        username: '',
        isCurrentDrawer: false,
        users: [],
        record: ds.record.getRecord('state')
    }
  },

  methods: {
    storeUsername: function() {
      this.$data.record.whenReady(() => {
        this.$data.users = this.record.get('users') || []

        if (this.$data.users.length === 0) {
          // console.log('Is the gamemaster')
          this.$data.record.set('users', [this.$data.username])
          this.$data.record.set('drawer', this.$data.username)
          this.$data.isCurrentDrawer = true;
        } else {
          // console.log('Is a normal player', this.$data.users)
          if (this.$data.users.indexOf(this.$data.username) !== -1) {
            // console.log('Name is already in use, choose another')
            alert(`Please choose a different name, ${this.$data.username} is already in use`)
            return
          }
          this.$data.users.push(this.$data.username)
          this.$data.record.set('users', this.$data.users)
        }
        this.$data.newUser = false
      })
    }
  }
})
