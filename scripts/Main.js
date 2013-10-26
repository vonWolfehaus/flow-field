define(['engine/Kai', 'engine/ComponentType', 'engine/CollisionGrid', 'engine/FlowGrid', 'entities/Thing', 'engine/TileMap'], function(Kai, ComponentType, CollisionGrid, FlowGrid, Thing, TileMap) {

return function Main() {
	
	var gui = new dat.GUI();
	var grid = new CollisionGrid(200);
	var map = new TileMap(50, document.getElementById('tilesprite'));
	var flow = new FlowGrid(50, window.innerWidth, window.innerHeight);
	var allTheThings = [];
	var target = null;
	var paint = 0;
	// var timer = 120; // DEBUG
	
	var dt, last, now;
	
	function update() {
		var i, tile, pos = Kai.mouse.position;
		
		now = window.performance.now();
		dt = now - last;
		last = now;
		Kai.elapsed = dt * 0.0001;
		Kai.debugCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		
		if (Kai.keys.shift && Kai.mouse.down) {
			tile = map.getTile(pos.x, pos.y);
			
			if (paint !== tile) {
				newTile = map.setTile(pos.x, pos.y, paint);
				flow.setBlockAt(pos.x, pos.y);
			}
		}
		
		for (i = 0; i < allTheThings.length; i++) {
			allTheThings[i].update();
		}
		
		if (Kai.settings.collision) grid.update();
		
		Kai.renderer.render(Kai.stage);
		
		if (Kai.settings.drawVectors) flow.draw(Kai.debugCtx);
		// grid.draw(Kai.debugCtx);
		
		// if (timer--) {
			requestAnimFrame(update);
		// }
	}
	
	function onKeyDown(key) {
		if (key === 32) {
			// flow.build();
			// flow.log();
			// grid.log();
			// allTheThings[0].flocker.log();
		}
	}
	
	function onMouseDown(pos) {
		var i, on,
			x = ~~(pos.x/flow.cellPixelSize) * flow.cellPixelSize,
			y = ~~(pos.y/flow.cellPixelSize) * flow.cellPixelSize;

		if (Kai.mouse.shift) {
			paint = !!map.getTile(pos.x, pos.y) ? 0 : 1;
			
		} else {
			on = flow.setGoal(pos.x, pos.y);
			if (on) {
				flow.build();
				
				target.position.x = x;
				target.position.y = y;
				target.visible = true;
				
				for (i = 0; i < allTheThings.length; i++) {
					allTheThings[i].vecFieldState.reachedGoal = false;
				}
			}
		}
	}
	
	
	init();
	function init() {
		var debugCanvas = document.getElementById('debug');
		debugCanvas.width = window.innerWidth;
		debugCanvas.height = window.innerHeight;
		Kai.debugCtx = debugCanvas.getContext('2d');
		
		Kai.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null, true);
		document.body.appendChild(Kai.renderer.view);
		// document.body.insertBefore(Kai.renderer.view, debugCanvas);
		
		Kai.stage = new PIXI.Stage();
		
		var texture = PIXI.Texture.fromImage('img/target.png');
		target = new PIXI.Sprite(texture);
		target.visible = false;
		Kai.stage.addChild(target);
		
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
		
		var datgui = document.getElementsByClassName('dg')[0];
		datgui.addEventListener('mousedown', function(evt) {
			evt.stopPropagation(); // don't let clicks on the gui trigger anything else, it's annoying
		}, false);
		
		Kai.mouse.onDown.add(onMouseDown);
		Kai.keys.onDown.add(onKeyDown);
		
		gui.width = 200;
		gui.add(Kai.settings, 'drawVectors');
		gui.add(Kai.settings, 'flocking');
		gui.add(Kai.settings, 'collision');
		gui.add(Kai.settings, 'clearObstacles');
		
		console.log('[Main] Running');
		
		last = window.performance.now();
		update();
	}
	
} // class
});