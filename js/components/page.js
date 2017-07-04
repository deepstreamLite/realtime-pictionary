require('./board')
require('./chat')
const ds = require('../services/ds')

Vue.component('page', {
  template: `
<div>
    <div class="username-modal" v-if="newUser" @close="newUser = false">
        <form class="user-login" action="#" v-on:submit.prevent="storeUsername">
            <input class="username-input" v-model="username" type="text" />
        </form>
    </div>
  <board :record="record" :newUser="newUser" :isCurrentDrawer="isCurrentDrawer" :username="username"></board>
  <chat :record="record" :newUser="newUser" :isCurrentDrawer="isCurrentDrawer" :username="username"></chat>
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

  created: function() {

   },

   methods: {
       storeUsername: function() {
           this.$data.record.whenReady(() => {
               this.$data.users = this.record.get('users') || [];

               if(this.$data.users.length ===0) {
                   this.$data.record.set('users', [this.$data.username])
                   this.$data.isCurrentDrawer = true;
               } else {
                   this.$data.users.push(this.$data.username)
                   this.$data.record.set('users', this.$data.users)
               }
               this.$data.newUser = false;
               this.$emit('recordReady', this.$data.record)
           })
       }
   }
});
