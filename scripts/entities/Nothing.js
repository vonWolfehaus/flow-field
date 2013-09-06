define(function() {
	
	return function Nothing() {
		this.thing = 'hello';
		var priv = Math.random()*10;
		
		this.saySomething = function() {
			console.log(priv);
		};
	}
	
	/*Nothing.prototype.saySomething = function() {
		console.log(this.thing);
	};*/
	
	// return Nothing;
});