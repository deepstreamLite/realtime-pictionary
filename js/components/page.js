require('./board')
require('./chat')

Vue.component('page', {
  template: `
<div>
  <board></board>
  <chat></chat>
</div>`,
  data: function() {
    return {

    }
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
