const ds = require('../services/ds')

Vue.component('board', {
	template: `
<div v-if="!newUser">
  <canvas id="draw" width="500px" height="500px"></canvas>
</div>`,

	props: ['record', 'username'],

	data () {
		return {
			isGamemaster: false
		}
	},

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

		this.record.subscribe('drawer', (drawer) => {
			if (drawer === this.username) {
				console.log('You are the new gamemaster')
				this.deregisterReceiver()
				this.initialiseDrawer()
			} else {
				if (this.isGamemaster) {
					console.log('You were gamemaster but no longer are')
					this.deregisterDrawer()
					this.intialiseReceiver()
				} else {
					console.log('You\'re still not gamemaster')
				}
				this.canvas.getContext().clearRect(0, 0, canvas.width, canvas.height);
			}
		})
	},

	methods: {
		setRecord: function(record) {
			console.log('board');
			console.log(record);
		},
		intialiseReceiver () {
			this.isGamemaster = false
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

		deregisterReceiver () {
			ds.event.unsubscribe('line')
			ds.event.unsubscribe('end')
			ds.event.unsubscribe('start')
		},

	 	initialiseDrawer () {
	 		this.isGamemaster = true
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
		},

		deregisterDrawer () {
			this.signArea.off('mousemove')
			this.signArea.off('mousedown')
			this.signArea.off('mouseup')
		}

	}
})
