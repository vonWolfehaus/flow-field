define(function() {
	var priv = 'secret';
	
	function Nothing() {
		this.thing = 'hello';
	}
	
	Nothing.prototype.saySomething = function() {
		console.log(this.thing);
	};
	
	return Nothing;
});