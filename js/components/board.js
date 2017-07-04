const ds = require('../services/ds')

Vue.component('board', {
	template: `
<div id=board>
	<div v-if="isGamemaster" @close="isGamemaster = false">
		<span class="answer">You are drawing {{answer}}</span>
	</div>
  <canvas id="draw" width="500px" height="500px"></canvas>
</div>`,

	props: ['record', 'username'],

	data () {
		return {
			isGamemaster: false,
			initial: true,
			answer: ''
		}
	},

	mounted: function() {
		console.log('mounted', this.record, this.username)
		this.canvas = $(this.$el).find('#draw')[0];
		this.sign = this.canvas.getContext('2d');
		this.signArea = $('#draw');

		this.record.subscribe('drawer', (drawer) => {
			console.log('drawer', drawer, 'initial', this.initial, 'gamemaster', this.isGamemaster)
			if (drawer === this.username) {
				if (this.initial) {
					this.initialiseDrawer()
				} else {
					this.deregisterReceiver()
					this.initialiseDrawer()
				}
				console.log('You are the new gamemaster')
			} else {
				if (this.initial) {
					console.log('Normal user')
					this.intialiseReceiver()
				} else if (this.isGamemaster) {
					this.deregisterDrawer()
					this.intialiseReceiver()
				} else {
					console.log('You\'re still not gamemaster')
				}
			}
			this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.initial = false
		}, true)
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
	 		const words = this.record.get('words')
      const answer = words[ Math.floor(Math.random() * (words.length - 0)) ];
	  this.$data.answer = answer;
      console.log('Correct answer is', answer)

      ds.rpc.provide('verify-guess', ({ text, username }, response) => {
      	console.log('verify-guess', text, 'from', username)
      	response.send()
        if (text === answer) {
          console.log('Correct answer')
          this.record.set('drawer', username)
          return
        }
        console.log('Wrong guess', text)
      })
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
			console.log('deregisterDrawer')
			ds.rpc.unprovide('verify-guess')
			this.signArea.off('mousemove')
			this.signArea.off('mousedown')
			this.signArea.off('mouseup')
		}

	}
})
