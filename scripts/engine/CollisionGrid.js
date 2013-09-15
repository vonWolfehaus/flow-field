define(['engine/Kai', 'components/BoundingCircle'], function(Kai, BoundingCircle) {

/**
 * 
 */
return function CollisionGrid(cellSize) {
	
	this.cellPixelSize = cellSize;
	
	this.widthInCells = Math.floor(Kai.width / cellSize) + 1;
	this.heightInCells = Math.floor(Kai.height / cellSize) + 1;
	
	this.numCells = this.widthInCells * this.heightInCells;
	
	this.cells = [];
	
	var _self = this,
		_sizeMulti = 1 / this.cellPixelSize;
	
	
	this.update = function() {
		var i, j;
		for (i = 0; i < this.widthInCells; ++i) {
			for (j = 0; j < this.heightInCells; ++j) {
				this.cells[i][j].length = 0;
			}
		}
	};
	
	this.draw = function(ctx) {
		var i, j;
		
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(0, 120, 120, 0.5)';
		
		for (i = 0; i < this.widthInCells; i++) {
			for (j = 0; j < this.heightInCells; j++) {
				ctx.strokeRect(i*this.cellPixelSize, j*this.cellPixelSize, this.cellPixelSize, this.cellPixelSize);
			}
		}
	};
	
	/**
	 * Insert an entity into the grid and check for collisions with whatever is already in those cells.
	 */
	this.add = function(obj) {
		var /*i, l, */cell, /*m:Manifold,*/
			x = ~~(obj.center.x * _sizeMulti), y = ~~(obj.center.y * _sizeMulti)/*,
			sx = x, ex = x+3, sy = y*/;
		
		// an optimization would be to find the quadrant it's in and only get the 3 cells touching that quadrant (4 instead of 9)
		// if we did that, it'd be a lot faster to get direct references instead of using a for loop
		/*for (x = 0; x < ex; x++) {
			// index = (y * widthInCells) + x;
			// if (index < 0) continue;
			// if (index >= size) continue;
			
			cell = this.cells[x][y];
			if (!cell) continue;
			
			l = cell.length;
			for (i = 0; i < l; i++) {
				m = this.collide(obj, cell[i]); // can combine into one call, but for now we might not want to resolve, just separate position
				if (m) this.resolveCollision(obj, cell[i], m);
			}
			
			if (x == x+3) {
				if (y == sy+3) break;
				x = sx;
				y++;
			}
		}*/
		
		cell = this.cells[x][y];
		cell.push(obj);
	};
	
	/**
	 * Get a list of all nearby entities of the provided object within the provided radius.
	 * @param	obj		The object to search around
	 * @param	radius		How many cells out to look (eg 1 will return all allies within a 2x2 area)
	 */
	this.getNeighbors = function(obj, threshold) {
		var i, l, cell, other,
			x = ~~(obj.center.x * _sizeMulti), y = ~~(obj.center.y * _sizeMulti),
			sx = x, ex = x+3, sy = y,
			threshold = threshold ? threshold : this.cellSize,
			influence = threshold * threshold,
			dx, dy;
		
		for (x = 0; x < ex; x++) {
			cell = this.cells[x][y];
			if (!cell) continue;
			
			l = cell.length;
			for (i = 0; i < l; i++) {
				
				other = cell[i];
				dx = obj.center.x - other.center.x;
				dy = obj.center.y - other.center.y;
				
				if ((dx * dx) + (dy * dy) <= influence) {
					// Vec2.draw(obj.center, other.center);
				}
				
			}
			if (x == x+3) {
				if (y == sy+3) break;
				x = sx;
				y++;
			}
		}
	};
	
	
	init();
	function init() {
		var i, j;
		
		for (i = 0; i < _self.widthInCells; ++i) {
			_self.cells[i] = [];
			
			for (j = 0; j < _self.heightInCells; ++j) {
				_self.cells[i][j] = []; // TODO: linked list from https://github.com/playcraft/gamecore.js
				
			}
		}
		
		Kai.grid = _self;
		console.log('[CollisionGrid] '+_self.widthInCells+'x'+_self.heightInCells);
	}
		
} // class
});