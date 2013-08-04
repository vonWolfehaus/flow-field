/// <reference path="../definitions/pixi.d.ts" />
/// <reference path="../Kai.ts" />
/// <reference path="../components/Position2.ts" />
/// <reference path="../components/Velocity2.ts" />
/// <reference path="../components/Collider2.ts" />
/// <reference path="../components/LocalState.ts" />

/// <reference path="../components/SteeringAI.ts" />
/// <reference path="../components/behaviors/Wander.ts" />

module von {
	
	var _speed:number = 2;
	
	export class Boid {
		
		// components this entity uses
		position:Position2 = new Position2();
		velocity:Velocity2 = new Velocity2();
		// health:Health = new Health();
		
		sprite:PIXI.Sprite;
		state:LocalState = new LocalState(); // interacts with the macro partition grid
		
		collider:Collider2 = new Collider2();
		steering:SteeringAI = new SteeringAI();
		
		constructor(x:number = 0, y:number = 0) {
			this.position.reset(x, y);
			
			var texture = PIXI.Texture.fromImage('img/entity.png');
			this.sprite = new PIXI.Sprite(texture);
			// center the this sprite's anchor point (as opposed to pivot which is relative position to parent)
			this.sprite.anchor.x = 0.5;
			this.sprite.anchor.y = 0.5;
			
			Kai.stage.addChild(this.sprite);
			
			// link references
			this.sprite.position = this.collider.position = this.steering.position = this.position;
			this.collider.velocity = this.steering.velocity = this.velocity;
			
			// this won't work; we will want to add gameplay logic to individual behaviors somehow
			// or maybe just use a tag system and pass in those as priorities? eg Avoid 'some-enemy-type' with 20 points of priority
			// but units always have various states, each state having different steering priorities...
			// so a state machine that simply reconfigures priority values per state?
			// there will have to be a different AI class to handle the states because that's too game-specific
			this.steering.add(new Wander());
			
			this.steering.configure({
				maxSpeed: _speed
			});
			
		}
		
		public update():void {
			this.steering.update();
			// this.collider.update();
			
			this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x);
			
			if (this.position.x > window.innerWidth) this.position.x = 0;
			if (this.position.x < 0) this.position.x = window.innerWidth;
			if (this.position.y > window.innerHeight) this.position.y = 0;
			if (this.position.y < 0) this.position.y = window.innerHeight;
		}
	}
}