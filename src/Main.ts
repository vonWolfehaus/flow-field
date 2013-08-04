/// <reference path="definitions/pixi.d.ts" />
/// <reference path="Kai.ts" />
/// <reference path="entities/Boid.ts" />

module von {
	
	var allTheThings = [];
	var timer = 30;
	
	function update():void {
		var i;
		for (i = 0; i < allTheThings.length; i++) {
			allTheThings[i].update();
		}
		
		Kai.renderer.render(Kai.stage);
		
		// if (timer-- > 0) {
			requestAnimFrame(update);
		// }
	}
	
	export class Main {
		
		constructor(debugCanvas) {
		 	Kai.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
			document.body.insertBefore(Kai.renderer.view, debugCanvas);
			
			Kai.stage = new PIXI.Stage(0x151515);
			
			var i, x = 0, y = 0,
				amount = 20, size = 50,
				g = ~~(amount / 4);
			
			for (i = 0; i < amount; i++) {
				allTheThings.push(new Boid(x*size+100, y*size+50));
				x++;
				if (x === g) {
					x = 0;
					y++;
				}
			}
			
			update();
		}
	}
}