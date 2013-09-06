define(['Kai', 'entities/Thing'], function(Kai, Thing) {
	
	var allTheThings = [];
	// var timer = 30;
	
	function update() {
		var i;
		
		Kai.debugCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		
		for (i = 0; i < allTheThings.length; i++) {
			allTheThings[i].update();
		}
		
		Kai.renderer.render(Kai.stage);
		
		// if (timer-- > 0) {
			requestAnimFrame(update);
		// }
	}
	
	function Main(debugCanvas) {
		Kai.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
		document.body.insertBefore(Kai.renderer.view, debugCanvas);
		
		Kai.stage = new PIXI.Stage(0x151515);
		Kai.debugCtx = debugCanvas.getContext('2d');
		
		var i, x = 0, y = 0,
			amount = 20, size = 50,
			g = ~~(amount / 4);
		
		for (i = 0; i < amount; i++) {
			allTheThings.push(new Thing(x*size+100, y*size+50));
			x++;
			if (x === g) {
				x = 0;
				y++;
			}
		}
		
		update();
		
		console.log('[Main] Running');
	}
	
	return Main;
});