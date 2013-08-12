/// <reference path="Kai.ts" />
/// <reference path="Vec2.ts" />
/// <reference path="IEntity.ts" />

module von {
	
	var _sizeMulti:number;
	
	class Grid {
		width:number; // number of cells wide
		height:number; // cells high
		cellWidth:number; // size of cell in pixels
		cellHeight:number;
		
		numCells:number;
		cells:any[];
		
		//debugging
		private _rec:Rectangle;
		
		/**
		 * 
		 */
		constructor(widthInCells:number, heightInCells:number) {
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
			
			var i:number, j:number, cx:number = 0, cy:number = 0,
				cell:any;
			
			for (i = 0; i < this.width; ++i) {
				this.cells[i] = [];
				
				for (j = 0; j < this.height; ++j) {
					this.cells[i][j] = []; // TODO: linked list from https://github.com/playcraft/gamecore.js
					
				}
			}
			
			Kai.grid = this;
			console.log('[Grid] '+this.cellWidth+'x'+this.cellHeight);
		}
		
		/**
		 * Insert an entity into the grid and check for collisions with whatever is already in those cells.
		 */
		public function add(obj:IEntity, pos:Vec2):void {
			var gr:Rectangle = obj.sprRect;
			var x:number = (gr.x - G.scroll.x) >> 0;
			var y:number = (gr.y - G.scroll.y) >> 0;
			var sx:number = (x * sizeMulti) + 1; // starting grid cell coordinates (top-left)
			var ssx:number = sx;
			var sy:number = (y * sizeMulti) + 1;
			var ex:number = ((x+obj.width) * sizeMulti) + 1; // ending grid cell coordinates (bottom-right)
			var ey:number = ((y+obj.height) * sizeMulti) + 1;
			// figure out dimensional occupation (in cells)
			var ow:number = ex - sx + 1;
			var oh:number = ey - sy + 1;
			var numCells:number = ow * oh;
			// loop through each cell
			var i:number, index:number;
			var cell:GridCell;
			//var node:ImageListNode;
			//var nodeSprite:Image;
			//var ikk:number;
			for (i = 0; i < numCells; ++i) {
				index = (sy * width) + sx;
				if (index < 0) continue;
				if (index >= size) continue;
				//if (!obj.fixed) {
					//dr.x = ((sx-1)*cellSize) + G.scroll.x; // DEBUG
					//dr.y = ((sy-1)*cellSize) + G.scroll.y;
					//U.drawRect(dr, true);
				//}
				
				cell = cells[index];
				cell.add(obj);
				sx++;
				if (sx == ssx + ow) {
					sx = ssx;
					sy++;
				}
			}
		}
		
		/**
		 * Get a list of all nearby allies of the provided sprite within the provided radius
		 * @param	sprite		The object to search around
		 * @param	radius		How many cells out to look (eg 1 will return all allies within a 2x2 area)
		 */
		public function getNeighbors(sprite:Image, radius:number=1):void {
			var n:ImageList = sprite.neightbors;
			n.clear();
			var centerX:number = sprite.x + sprite.halfWidth;
			var centerY:number = sprite.y + sprite.halfHeight;
			var sx:number = (centerX * sizeMulti) - radius; // starting grid cell coordinates (top-left)
			var ssx:number = sx;
			var sy:number = (centerY * sizeMulti) - radius;
			var ex:number = (centerX * sizeMulti) + radius; // ending grid cell coordinates (bottom-right)
			var ey:number = (centerY * sizeMulti) + radius;
			// figure out dimensional occupation (in cells)
			var ow:number = ex - sx + 1;
			var oh:number = ey - sy + 1;
			var numCells:number = ow * oh;
			// loop through each cell
			var i:number, index:number;
			var cell:GridCell;
			var node:ImageListNode;
			var nodeSprite:Image;
			var ikString:String;
			for (i = 0; i < numCells; ++i) {
				if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;
				index = (sy * width) + sx;
				cell = cells[index];
				node = cell.head;
				while (node) {
					nodeSprite = node.data;
					if (sprite.ikID == nodeSprite.ikID) continue;
					n.append(nodeSprite);
					node = node.next;
				}
				sx++;
				if (sx == ssx + ow) {
					sx = ssx;
					sy++;
				}
			}
		}
		
		
	}//class
}