const ds = require('../services/ds')

Vue.component('chat', {
  template: `
<div class="message-board" v-if="!newUser">
  <div class="answer-box">
  <ul id="messages">
    <li v-for="message in messages">
    <em>{{ message.author }}</em>
      {{ message.text }}
    </li>
  </ul>
  </div>
  <div class="input-box">
  <form id="submit-answer" action="#" v-on:submit.prevent="submitAnswer">
    <p>
      <input type="text" v-model="msg">
    </p>
  </form>
  </div>
</div>`,

  props: ['record', 'newUser', 'username'],

  data: function() {
    return {
      messages: [
        { text: '', author: '' }
      ],
      msg: ''
    }
},

  mounted: function() {
      console.log(this.record, 'chats');
  },

  methods: {
      submitAnswer: function() {
          this.$data.messages.push({
              text: this.$data.msg,
              author: this.username + ':'
          });
          this.$data.msg = ''
      }
  }

})
