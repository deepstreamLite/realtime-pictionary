require('./board')
require('./chat')
const ds = require('../services/ds')

Vue.component('page', {
  template: `
<div>
    <div class="username-modal" v-if="newUser" @close="newUser = false">
        <form class="user-login" action="#" v-on:submit.prevent="storeUsername">
            <label class="title">username</label>
            <br>
            <input class="username-input" v-model="username" type="text" />
        </form>
    </div>
  <board v-if="!newUser" :record="record" :newUser="newUser" :isCurrentDrawer="isCurrentDrawer" :username="username"></board>
  <chat v-if="!newUser" :record="record" :newUser="newUser" :isCurrentDrawer="isCurrentDrawer" :username="username"></chat>
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
          console.log('Is the gamemaster')
          this.$data.record.set('users', [this.$data.username])
          this.$data.record.set('drawer', this.$data.username)
          const words = this.$data.record.get('words')
          const answer = Math.random() * (words.length - 0) + 0
          ds.rpc.provide('verify-guess', ({ guess, username }, response) => {
            if (guess === answer) {
              console.log('Correct answer')
              this.record.set('drawer', username)
              return
            }
            console.log('Wrong guess', guess)
            response.send()
          })
          this.$data.isCurrentDrawer = true;
        } else {
          console.log('Is a normal player', this.$data.users)
          if (this.$data.users.indexOf(this.$data.username) !== -1) {
            console.log('Name is already in use, choose another')
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
