Vue.component('board', {
	template: `
<div id=board>
	<div v-if="isGamemaster" @close="isGamemaster = false">
		<span class="answer">You are drawing {{answer}}</span>
	</div>
  <canvas id="draw" width="500px" height="500px"></canvas>
</div>`,

	props: ['record', 'username', 'ds'],

	data () {
		return {
			isGamemaster: false,
			initial: true,
			answer: ''
		}
	},

	mounted: function () {
		console.log(this.record, this.username,this.users,this.ds)
		this.canvas = $(this.$el).find('#draw')[0];
		this.sign = this.canvas.getContext('2d');
		this.signArea = $('#draw');

		this.record.subscribe('gamemaster', (username) => {
			if (!this.initial) {
				alert(`${username} guessed the answer as ${this.record.get('last-guess')}`)
			}
			if (username === this.username) {
				if (this.initial) {
					this.initialiseDrawer()
				} else {
					this.deregisterReceiver()
					this.initialiseDrawer()
				}
			} else {
				if (this.initial) {
					this.intialiseReceiver()
				} else if (this.isGamemaster) {
					this.deregisterDrawer()
					this.intialiseReceiver()
				}
			}
			this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.initial = false
		}, true)
	},

	methods: {
		intialiseReceiver () {
			this.isGamemaster = false
			this.ds.event.subscribe('line', ({ x, y }) => {
			    this.sign.lineTo(x, y)
			    this.sign.stroke()
			})

			this.ds.event.subscribe('start', ({ x, y}) => {
			    this.sign.beginPath()
			    this.sign.moveTo(x, y)
			})

			this.ds.event.subscribe('end', ({ x, y}) => {
			    this.signArea.off('mousemove');
			})
		},

		deregisterReceiver () {
			this.ds.event.unsubscribe('line')
			this.ds.event.unsubscribe('end')
			this.ds.event.unsubscribe('start')
		},

	 	initialiseDrawer () {
	 		const words = this.record.get('words')
      const answer = words[ Math.floor(Math.random() * (words.length - 0)) ];
	  	this.$data.answer = answer;
      // console.log('Correct answer is', answer)

      this.ds.rpc.provide('verify-guess', ({ text, author }, response) => {
      	// console.log('verify-guess', text, 'from', author)
      	response.send()
        if (text === answer) {
          this.record.set('last-guess', text)
          this.record.set('drawer', author)
          return
        }
        // console.log('Wrong guess', text)
      })
	 		this.isGamemaster = true
	 		this.signArea
				.on('mousedown', this.startSignature.bind(this))
				.on('mouseup', this.removeListener.bind(this))
	 	},

		startSignature: function(e) {
    	this.ds.event.emit('start', { x: e.offsetX, y: e.offsetY })
		  this.sign.beginPath()
		  this.sign.moveTo(e.offsetX, e.offsetY)
		  this.moveSignature(this.sign)
		},

		moveSignature: function(sign, e) {
		  this.signArea.on('mousemove', function(e) {
		  	this.ds.event.emit('line', { x: e.offsetX, y: e.offsetY })
				sign.lineTo(e.offsetX, e.offsetY)
				sign.stroke()
		  })
		},

		removeListener: function(e) {
			this.ds.event.emit('end', { x: e.offsetX, y: e.offsetY })
		  this.signArea.off('mousemove')
		},

		deregisterDrawer () {
			// console.log('deregisterDrawer')
			this.ds.rpc.unprovide('verify-guess')
			this.signArea.off('mousemove')
			this.signArea.off('mousedown')
			this.signArea.off('mouseup')
		}

	}
})
