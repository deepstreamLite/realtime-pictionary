var canvas = document.getElementsByTagName('canvas')[0];
var sign = canvas.getContext('2d');
var signArea = $('#draw');
var submit = $('#submit');
var hiddenFile = $('#hidden');

function startSignature(e) {     //finds where to begin the signature//
    sign.beginPath();
    sign.moveTo(e.offsetX, e.offsetY);
        moveSignature();
}
function moveSignature(e) {          //draws the signature in the canvas//
    signArea.on('mousemove', function(e) {
        sign.lineTo(e.offsetX, e.offsetY);
        sign.stroke();
        console.log(e.offsetX, e.offsetY);

    })
}
function removeListener() {     //stops drawing the signature//
    signArea.off('mousemove');
    var dataURL = canvas.toDataURL();

}

signArea
.on('mousedown', startSignature)
.on('mouseup', removeListener);
