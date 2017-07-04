
Vue.component('chat', {
  template: `
<form id="demo">
  <p>
    <input type="text" v-model="msg">
  </p>
</form>`,
  data: function() {
    return {
        msg: ''
    }
  }
})
