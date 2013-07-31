/// <reference path="../def/pixi.d.ts" />
/// <reference path="Kai.ts" />
//// <reference path="Vec2.ts" />

module ff {
	
	export class Boid {
		public sprite:PIXI.Sprite;
		public state:;
		
		// public position:Vec2 = new Vec2();
		// public velocity:Vec2 = new Vec2();
		
		constructor(x:number = 0, y:number = 0) {
			var texture = PIXI.Texture.fromImage('img/entity.png');
			
			// create a new this.sprite using the texture
			this.sprite = new PIXI.Sprite(texture);

			// center the this.sprites anchor point
			this.sprite.anchor.x = 0.5;
			this.sprite.anchor.y = 0.5;

			// move the this.sprite t the center of the screen
			this.sprite.position.x = x;
			this.sprite.position.y = y;

			Kai.stage.addChild(this.sprite);
		}
		
		public update():void {
			// this.sprite.position.x += this.velocity.x;
			// this.sprite.position.y += this.velocity.y;
		}
	}
}