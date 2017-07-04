const ds = require('../services/ds')

Vue.component('chat', {
  template: `
<div>
  <ul id="messages">
    <li v-for="message in messages">
      {{ message.text }}
      {{ message.author }}
    </li>
  </ul>

  <form id="demo">
    <!-- text -->
    <p>
      <input type="text" v-model="msg">
    </p>
  </form>
</div>`,

  props: ['stateRecord'],

  data: function() {
    return {
      messages: [
        { text: 'hello there', author: 'Dave' }
      ],
      msg: ''
  },

  mounted: function() {
    this.messages = stateRecord.get('messages')
  }
})
