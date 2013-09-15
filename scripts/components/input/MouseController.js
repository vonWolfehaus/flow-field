define(function() {

return function MouseController() {
	
	this.position = new Vec2();
	
	this.onDown = new Signal();
	// this.onUp = new Signal();
	
	this.down = false;
	this.shift = false;
	this.ctrl = false;
	
	var _self = this,
		_downPrev = false;
	
	/*this.update = function() {
		
		_downPrev = this.down;
	};*/
	
	function onDown(evt) {
		_self.position.x = evt.pageX;
		_self.position.y = evt.pageY;
		_self.down = true;
		
		_self.shift = !!evt.shiftKey;
		_self.ctrl = !!evt.ctrlKey;
		
		_self.onDown.dispatch(_self.position);
	}
	
	function onUp(evt) {
		_self.position.x = evt.pageX;
		_self.position.y = evt.pageY;
		_self.down = false;
		// _self.onUp.dispatch(_self.position);
	}
	
	function onMove(evt) {
		_self.position.x = evt.pageX;
		_self.position.y = evt.pageY;
	}
	
	function onOut(evt) {
		_self.down = false;
	}
	
	init();
	function init() {
		document.addEventListener('mousedown', onDown, false);
		document.addEventListener('mouseup', onUp, false);
		document.addEventListener('mouseout', onOut, false);
	}
	
} // class

});