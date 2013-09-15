define(['engine/Kai', 'engine/CollisionGrid', 'engine/FlowGrid', 'entities/Thing', 'entities/Nothing'], function(Kai, CollisionGrid, FlowGrid, Thing, Nothing) {

return function Main(debugCanvas) {
	var grid = new CollisionGrid(200);
	var flow = new FlowGrid(50, window.innerWidth, window.innerHeight);
	var allTheThings = [];
	var blocks = [];
	// var timer = 30; // DEBUG
	
	
	function update() {
		var i;
		
		for (i = 0; i < allTheThings.length; i++) {
			allTheThings[i].update();
		}
		
		Kai.renderer.render(Kai.stage);
		
		for (i = 0; i < blocks.length; i++) {
			Kai.debugCtx.fillStyle = blocks[i].color;
			Kai.debugCtx.fillRect(blocks[i].x, blocks[i].y, flow.cellPixelSize, flow.cellPixelSize);
		}
		
		// if (timer--) {
			requestAnimFrame(update);
		// }
	}
	
	function onKeyDown(key) {
		if (key === 32) {
			flow.build();
		}
	}
	
	function onMouseDown(pos) {
		var i, on,
			x = ~~(pos.x/flow.cellPixelSize) * flow.cellPixelSize,
			y = ~~(pos.y/flow.cellPixelSize) * flow.cellPixelSize;
		
		Kai.debugCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		if (Kai.mouse.shift) {
			on = flow.setBlockAt(pos.x, pos.y);
			if (on) {
				flow.build();
				blocks.push({x: x, y: y, color: '#fff'});
			} else {
				for (i = 0; i < blocks.length; i++) {
					if (blocks[i].x === x && blocks[i].y === y) {
						blocks.splice(i, 1);
						break;
					}
				}
			}
			
		} else {
			on = flow.setGoal(pos.x, pos.y);
			if (on) {
				flow.build();
				blocks[0] = {x: x, y: y, color: '#5F158C'};
			}
		}
		
		flow.draw(Kai.debugCtx);
		grid.draw(Kai.debugCtx);
	}
	
	
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
			if (++x === g) {
				x = 0;
				y++;
			}
		}
		
		blocks[0] = {x: 0, y: 0, color: '#5F158C'};
		
		flow.draw(Kai.debugCtx);
		
		grid.draw(Kai.debugCtx);
		
		Kai.mouse.onDown.add(onMouseDown);
		Kai.keys.onDown.add(onKeyDown);
		
		update();
		
		/*var not1 = new Nothing();
		var not2 = new Nothing();
		var not3 = new Nothing();
		not1.saySomething();
		not2.saySomething();
		not3.saySomething();*/
		
		console.log('[Main] Running');
	}
	
} // class
});