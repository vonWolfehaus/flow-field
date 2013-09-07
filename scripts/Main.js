define(['Kai', 'CollisionGrid', 'FlowGrid', 'entities/Thing', 'entities/Nothing'], function(Kai, CollisionGrid, FlowGrid, Thing, Nothing) {

return function Main(debugCanvas) {
	var grid = new CollisionGrid(200);
	var field = new FlowGrid(50, window.innerWidth, window.innerHeight);
	var allTheThings = [];
	// var timer = 30;
	
	init();
	function init() {
		Kai.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
		document.body.insertBefore(Kai.renderer.view, debugCanvas);
		
		Kai.stage = new PIXI.Stage(0x151515);
		
		debugCanvas.width = window.innerWidth;
		debugCanvas.height = window.innerHeight;
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
		
		/*var not1 = new Nothing();
		var not2 = new Nothing();
		var not3 = new Nothing();
		not1.saySomething();
		not2.saySomething();
		not3.saySomething();*/
		
		console.log('[Main] Running');
	}
	
	function update() {
		var i;
		
		for (i = 0; i < allTheThings.length; i++) {
			allTheThings[i].update();
		}
		
		Kai.renderer.render(Kai.stage);
		
		Kai.debugCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		grid.draw(Kai.debugCtx);
		field.draw(Kai.debugCtx);
		
		
		// if (timer--) {
			requestAnimFrame(update);
		// }
	}
	
} // class
});