define(function() {

return function FlowGridNode(gx, gy) {
	// velocity
	this.x = 0;
	this.y = 0;
	
	this.gridX = gx;
	this.gridY = gy;
	
	// heat value
	this.cost = 0;
	this.open = true;
	this.passable = true;
	
	this.uniqueId = Date.now() + '' + Math.floor(Math.random()*1000);
	
} // class
});