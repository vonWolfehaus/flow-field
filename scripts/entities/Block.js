define(['engine/Kai', 'components/BoundingCircle'],
       function(Kai, BoundingCircle) {
	
return function Block(posx, posy) {
	if (typeof posx === 'undefined') posx = 0;
	if (typeof posy === 'undefined') posy = 0;
	
	// @private
	var _self = this;
	
	this.uniqueId = Date.now() + '' + Math.floor(Math.random()*1000);
	
	// base components
	this.position = new Vec2(posx, posy);
	this.velocity = new Vec2();
	this.collider = new BoundingCircle(this, {radius: 25});
	
	this.enable = function() {
		// Kai.grid.add(this);
		this.collider.solid = true;
	};
	
	this.disable = function() {
		// Kai.grid.remove(this);
		this.collider.solid = false;
	};
	
	init();
	function init() {
		Kai.grid.add(_self);
	}
	
} // class

});