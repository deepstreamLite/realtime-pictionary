require('./board')
require('./chat')
const ds = require('../services/ds')

Vue.component('page', {
  template: `
<div>
    <div>
    <div class="username-modal" v-if="loggedIn=false" @close="loggedIn=true">
        <form class="user-login" action="#" v-on:submit.prevent="storeUsername">
            <input class="username-input" v-model="username" type="text" />
        </form>
    </div>
    <canvas id="draw" width="500px" height="500px"></canvas>
    </div>
  <board></board>
  <chat></chat>
</div>`,
  data: function() {
    return {
        loggedIn: false,
        username: '',
        isCurrentDrawer: false
    }
  },

  created: function() {
      this.record = ds.record.getRecord('users')
   },

   methods: {
       storeUsername: function() {
           console.log(this.$data.username);
           this.$data.loggedIn = true;
       }
   }
});
