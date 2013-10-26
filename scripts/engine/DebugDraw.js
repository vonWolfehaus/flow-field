var DebugDraw = {};
(function() {

var ctx = document.getElementById('debug').getContext('2d');

DebugDraw.circle = function(x, y, radius, color) {
	color = color || 'rgba(10, 200, 30)';
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2);
	ctx.lineWidth = 1;
	ctx.strokeStyle = color;
	ctx.stroke();
};

DebugDraw.rectangle = function(x, y, sizeX, sizeY, color) {
	color = color || 'rgba(10, 200, 30)';
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = color;
	ctx.strokeRect(x - (sizeX*0.5), y - (sizeY*0.5), sizeX, sizeY);
};
console.log('[DebugDraw] ');
}());