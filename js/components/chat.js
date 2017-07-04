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
      this.list = ds.record.getList('messages');
      this.list.subscribe('entry-added', id => {
        ds.record.snapshot(id, (error, data) => {
          this.$data.messages.push(data)
        })
      })
 },

  methods: {
      submitAnswer: function() {
          var message = {
              text: this.$data.msg,
              username: this.username
          }
          const id = Math.random().toString()
          const record = ds.record.getRecord(id)
          record.whenReady((record) =>{
              record.set(message)
              this.list.addEntry(id);
          })
          this.checkAnswer(message);
          this.$data.msg = '';
      },
      checkAnswer: function(message) {
          ds.rpc.make('verify-guess', message);
      }
  }

})
