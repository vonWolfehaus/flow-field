/// <reference path="../definitions/pixi.d.ts" />
/// <reference path="../Kai.ts" />
/// <reference path="../IEntity.ts" />
/// <reference path="../components/Position2.ts" />
/// <reference path="../components/Velocity2.ts" />
/// <reference path="../components/BoundingBox2.ts" />
/// <reference path="../components/LocalState.ts" />

/// <reference path="../components/SteeringAI.ts" />
/// <reference path="../components/behaviors/Wander.ts" />

module von {
	
	var _speed:number = Math.random()*10-5;
	
	export class Boid implements IEntity {
		
		position:Position2 = new Position2();
		velocity:Velocity2 = new Velocity2();
		// health:Health = new Health();
		
		sprite:PIXI.Sprite;
		state:LocalState = new LocalState(); // component that hooks into the broadphase grid
		
		// collider:BoundingBox2 = new BoundingBox2();
		steering:SteeringAI = new SteeringAI();
		
		constructor(x:number = 0, y:number = 0) {
			this.position.reset(x, y);
			this.velocity.reset(Math.random()*_speed-_speed*0.5, Math.random()*_speed-_speed*0.5);
			
			var texture = PIXI.Texture.fromImage('img/entity.png');
			this.sprite = new PIXI.Sprite(texture);
			// center the this sprite's anchor point (as opposed to pivot which is relative position to parent)
			this.sprite.anchor.x = 0.5;
			this.sprite.anchor.y = 0.5;
			
			Kai.stage.addChild(this.sprite);
			
			// link references
			// this.sprite.position = this.position;
			this.sprite.position = this.steering.position = this.position;
			// this.steering.velocity = this.velocity;
			
			
			// this won't work; we will want to add gameplay logic to individual behaviors somehow
			// or maybe just use a tag system and pass in those as priorities? eg Avoid 'some-enemy-type' with 20 points of priority
			// but units always have various states, each state having different steering priorities...
			// so a state machine that simply reconfigures priority values per state?
			// there will have to be a different AI class to handle the states because that's too game-specific
			// this.steering.add(new Wander());
			
			this.steering.configure({
				maxSpeed: _speed
			});
			
		}
		
		public update():void {
			var steerForce:Vec2 = this.steering.update(this.velocity);
			
			// this.velocity.copy(steerForce);
			this.velocity.add(steerForce);
			// this.collider.update();
			
			this.velocity.normalize().multiplyScalar(_speed); // this is a little more stable
			// this.velocity.truncate(_speed);
			
			this.position.add(this.velocity);
			
			this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x);
			
			if (this.position.x > window.innerWidth) this.position.x = 0;
			if (this.position.x < 0) this.position.x = window.innerWidth;
			if (this.position.y > window.innerHeight) this.position.y = 0;
			if (this.position.y < 0) this.position.y = window.innerHeight;
		}
	}
}