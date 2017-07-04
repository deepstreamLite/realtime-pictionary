const ds = require('../services/ds')

Vue.component( 'board', {
	template: `
<<<<<<< HEAD:js/components/demo.js
		<div>
			<div class="username-modal" v-if="loggedIn=false" @close="loggedIn=true">
				<form class="user-login" action="#" v-on:submit.prevent="storeUsername">
					<input class="username-input" v-model="username" type="text" />
				</form>
			</div>
			<canvas id="draw" width="500px" height="500px"></canvas>
		</div>
	`,
=======
<div>
  <canvas id="draw" width="500px" height="500px"></canvas>
  <div class="submissions">
    <form action="#" >
  </div>
</div>`,
>>>>>>> 3ce5bbb5afb4c14e32644a2e53c1f2299c2dd27f:js/components/board.js
	data: function() {
		return {
			loggedIn: false,
			username: ''
		}
	},
	created: function() {
		this.record = ds.record.getRecord('users');
	},
	mounted: function() {
		console.log('hell othere')
		this.canvas = $(this.$el).find('#draw')[0];
		this.sign = this.canvas.getContext('2d');
		this.signArea = $('#draw');
		this.signArea
		.on('mousedown', this.startSignature.bind( this ) )
		.on('mouseup', this.removeListener.bind( this ) )
	 },

	 methods: {

		 storeUsername: function() {
			 console.log(this.$data.username);
			 this.$data.loggedIn = true;
		 },

		 startSignature: function(e) {     //finds where to begin the signature//
		     this.sign.beginPath();
		     this.sign.moveTo(e.offsetX, e.offsetY);
		         this.moveSignature(this.sign);
		 },

		 moveSignature: function(sign, e) {          //draws the signature in the canvas//
		     this.signArea.on('mousemove', function(e) {
		         sign.lineTo(e.offsetX, e.offsetY);
		         sign.stroke();
		         console.log(e.offsetX, e.offsetY);

		     })
		 },

		 removeListener: function(e) {     //stops drawing the signature//
		     this.signArea.off('mousemove');
		     var dataURL = this.canvas.toDataURL();

		 }

	 }
});
