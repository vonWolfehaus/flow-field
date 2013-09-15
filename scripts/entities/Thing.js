define(['engine/Kai', 'components/BoundingCircle', 'components/LocalState'], function(Kai, BoundingCircle, LocalState) {
	
return function Thing(posx, posy) {
	if (typeof posx === 'undefined') posx = 0;
	if (typeof posy === 'undefined') posy = 0;
	
	this.uniqueId = Date.now() + '' + Math.floor(Math.random()*1000);
	
	var _self = this,
		_speed = Math.random() * 5 + 5;
	
	
	this.update = function() {
		var steerForce = this.state.update(this.position);
		
		// this.velocity.copy(steerForce);
		// this.velocity.normalize().multiplyScalar(_speed);
		
		this.position.add(this.velocity);
		this.collider.update();
		
		this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x);
		
		// screen wrap
		if (this.position.x > window.innerWidth) this.position.x -= window.innerWidth;
		if (this.position.x < 0) this.position.x += window.innerWidth;
		if (this.position.y > window.innerHeight) this.position.y -= window.innerHeight;
		if (this.position.y < 0) this.position.y += window.innerHeight;
	};
	
	
	init();
	function init() {
		_self.position = new Vec2(posx, posy);
		
		_self.velocity = new Vec2(Math.random()*_speed-_speed*0.5, Math.random()*_speed-_speed*0.5);
		
		// _self.health:Health = new Health();
		
		_self.state = new LocalState(); // component that hooks into the grid
		
		_self.collider = new BoundingCircle();
		
		var texture = PIXI.Texture.fromImage('img/entity.png');
		_self.sprite = new PIXI.Sprite(texture);
		// center the _self sprite's anchor point (as opposed to pivot which is relative position to parent)
		_self.sprite.anchor.x = 0.5;
		_self.sprite.anchor.y = 0.5;
		
		Kai.stage.addChild(_self.sprite);
		
		// link references
		_self.sprite.position = _self.position;
		// _self.state.position = _self.position;
		_self.collider.position = _self.position;
	}
	
} // class

});