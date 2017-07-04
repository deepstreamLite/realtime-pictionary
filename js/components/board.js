const ds = require('../services/ds')

Vue.component('board', {
	template: `
<div v-if="!newUser">
  <canvas id="draw" width="500px" height="500px"></canvas>
</div>`,

	props: ['record', 'username'],

	mounted: function() {
		console.log('mounted', this.record, this.username)
		this.canvas = $(this.$el).find('#draw')[0];
		this.sign = this.canvas.getContext('2d');
		this.signArea = $('#draw');
		if (this.record.get('drawer') === this.username) {
			this.initialiseDrawer()
		} else {
			this.intialiseReceiver()
		}
	},

	methods: {
		setRecord: function(record) {
			console.log('board');
			console.log(record);
		},
		intialiseReceiver () {
			ds.event.subscribe('line', ({ x, y }) => {
			    this.sign.lineTo(x, y)
			    this.sign.stroke()
			})

			ds.event.subscribe('start', ({ x, y}) => {
			    this.sign.beginPath()
			    this.sign.moveTo(x, y)
			})

			ds.event.subscribe('end', ({ x, y}) => {
			    this.signArea.off('mousemove');
			})
		},

	 	initialiseDrawer () {
	 		this.signArea
				.on('mousedown', this.startSignature.bind(this))
				.on('mouseup', this.removeListener.bind(this))
	 	},

		startSignature: function(e) {
    	ds.event.emit('start', { x: e.offsetX, y: e.offsetY })
		  this.sign.beginPath()
		  this.sign.moveTo(e.offsetX, e.offsetY)
		  this.moveSignature(this.sign)
		},

		moveSignature: function(sign, e) {
		  this.signArea.on('mousemove', function(e) {
		  	ds.event.emit('line', { x: e.offsetX, y: e.offsetY })
				sign.lineTo(e.offsetX, e.offsetY)
				sign.stroke()
		  })
		},

		removeListener: function(e) {
			ds.event.emit('end', { x: e.offsetX, y: e.offsetY })
		  this.signArea.off('mousemove')
		}

	}
})
