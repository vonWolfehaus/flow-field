define(function() {

return function KeyboardController() {
	
	this.key = -1;
	
	this.onDown = new Signal();
	// this.onUp = new Signal();
	
	this.down = false;
	this.shift = false;
	this.ctrl = false;
	
	var _self = this,
		_downPrev = false;
	
	
	function onDown(evt) {
		_self.down = true;
		
		_self.shift = !!evt.shiftKey;
		_self.ctrl = !!evt.ctrlKey;
		_self.key = evt.keyCode;
		
		_self.onDown.dispatch(_self.key);
	}
	
	function onUp(evt) {
		_self.down = false;
		_self.key = -1;
		// _self.onUp.dispatch(_self.position);
	}
	
	init();
	function init() {
		document.addEventListener('keydown', onDown, false);
		document.addEventListener('keyup', onUp, false);
	}
	
} // class

});