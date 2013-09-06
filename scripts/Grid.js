/// <reference path="Kai.ts" />
/// <reference path="Vec2.ts" />
/// <reference path="BoundingCircle.ts" />

module von {
	
	var _sizeMulti:number;
	
	class Grid {
		width:number; // number of cells wide
		height:number; // cells high
		cellWidth:number; // size of cell in pixels
		cellHeight:number;
		
		numCells:number;
		cells:any[];
		
		/**
		 * 
		 */
		constructor(cellSize:number) {
			this.width = widthInCells;
			this.height = heightInCells;
			
			this.cellWidth = Math.floor(Kai.width / widthInCells);
			this.cellHeight = Math.floor(Kai.height / widthInCells);
			
			_sizeMulti = 1 / this.cellSize;
			
			// this._rec = new Rectangle();
			// this._rec.width = this.cellWidth;
			// this._rec.height = this.cellHeight;
			
			this.numCells = this.width * this.height + 1;
			
			this.cells = [];
			
			var i:number, j:number/*, cx:number = 0, cy:number = 0,
				cell:any*/;
			
			for (i = 0; i < this.width; ++i) {
				this.cells[i] = [];
				
				for (j = 0; j < this.height; ++j) {
					this.cells[i][j] = []; // TODO: linked list from https://github.com/playcraft/gamecore.js
					
				}
			}
			
			Kai.grid = this;
			console.log('[Grid] '+this.cellWidth+'x'+this.cellHeight);
		}
		
		update() {
			var i:number, j:number;
			for (i = 0; i < this.width; ++i) {
				for (j = 0; j < this.height; ++j) {
					this.cells[i][j].length = 0;
				}
			}
		}
		
		draw(ctx) {
			var i:number, j:number;
			
			ctx.lineWidth = 1;
			ctx.lineStyle = '#0f0';
			
			for (i = 0; i < this.width; ++i) {
				for (j = 0; j < this.height; ++j) {
					ctx.strokeRect(i, j, i*this.cellSize, j*this.cellSize);
				}
			}
		}
		
		/**
		 * Insert an entity into the grid and check for collisions with whatever is already in those cells.
		 */
		add(obj:BoundingCircle) {
			var /*i:number, l:number, */cell:BoundingCircle[], /*m:Manifold,*/
				x:number = ~~(obj.center.x * _sizeMulti), y:number = ~~(obj.center.y * _sizeMulti)/*,
				sx:number = x, ex:number = x+3, sy:number = y*/;
			
			// an optimization would be to find the quadrant it's in and only get the 3 cells touching that quadrant (4 instead of 9)
			// if we did that, it'd be a lot faster to get direct references instead of using a for loop
			/*for (x = 0; x < ex; x++) {
				// index = (y * width) + x;
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
		}
		
		/**
		 * Get a list of all nearby entities of the provided sprite within the provided radius
		 * @param	sprite		The object to search around
		 * @param	radius		How many cells out to look (eg 1 will return all allies within a 2x2 area)
		 */
		getNeighbors(obj:BoundingCircle, threshold:number = this.cellSize) {
			var i:number, l:number, cell:IEntity[], other:IEntity,
				x:number = ~~(obj.center.x * _sizeMulti), y:number = ~~(obj.center.y * _sizeMulti),
				sx:number = x, ex:number = x+3, sy:number = y,
				influence:number = threshold * threshold,
				dx:number, dy:number;
			
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
		}
		
		
	}//class
}