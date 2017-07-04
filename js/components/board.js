const client = require('../services/ds')

Vue.component( 'board', {
	template: `
<div>
  <canvas id="draw" width="500px" height="500px"></canvas>
  <div class="submissions">
  </div>
</div>`,

	props: ['isCurrentDrawer'],

	data: function() {
		return {

		}
	},
	mounted: function() {
		this.canvas = $(this.$el).find('#draw')[0];
		this.sign = this.canvas.getContext('2d');
		this.signArea = $('#draw');
		if (this.isCurrentDrawer) {
			this.initialiseDrawer()
		} else {
			this.intialiseReceiver()
		}
	},

	methods: {
		intialiseReceiver () {
			client.event.subscribe('line', ({ x, y }) => {
			    this.sign.lineTo(x, y)
			    this.sign.stroke()
			})

			client.event.subscribe('start', ({ x, y}) => {
			    this.sign.beginPath()
			    this.sign.moveTo(x, y)
			})

			client.event.subscribe('end', ({ x, y}) => {
			    this.signArea.off('mousemove');
			    var dataURL = canvas.toDataURL();
			    hiddenFile.val(dataURL);
			})
		},

	 	initialiseDrawer () {
	 		this.signArea
				.on('mousedown', this.startSignature.bind(this))
				.on('mouseup', this.removeListener.bind(this))
	 	},

		startSignature: function(e) {
		  this.sign.beginPath()
		  this.sign.moveTo(e.offsetX, e.offsetY)
		  this.moveSignature(this.sign)
		},

		moveSignature: function(sign, e) {
		  this.signArea.on('mousemove', function(e) {
				sign.lineTo(e.offsetX, e.offsetY)
				sign.stroke()
				console.log(e.offsetX, e.offsetY)
		  })
		},

		removeListener: function(e) {
		  this.signArea.off('mousemove')
		}

	}
})
