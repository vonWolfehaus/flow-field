module von {
	
	class Grid {
		public width:number, height:number;
		public cellSize:number, sizeMulti:number;
		public size:number;
		public cells:GridCell[];
		
		// collision helpers
		public caster:Image;
		public raySprite:Image;
		public hitRect:Rectangle;
		public angle:number;
		public cosa:number;
		public sina:number;
		
		public flxp:Point;
		public flxpRef:Point;
		public v1:Point;
		public v2:Point;
		
		//debugging
		private dr:Rectangle;
		
		/**
		 * Initializes a two-dimensional array to match a given cell size.
		 * @param s The size of a grid cell in pixels.
		 */
		public function Grid(s:number) {
			cellSize = s;
			sizeMulti = 1 / s;
			flxpRef = new Point();
			v1 = new Point();
			v2 = new Point();
			
			dr = new Rectangle();
			dr.width = dr.height = cellSize;
			
			hitRect = new Rectangle();
			width = (G.lvlSize * sizeMulti)+1;
			height = (G.lvlSize * sizeMulti)+1;
			size = width * height + 1;
			console.log('grid w: '+width+' h: '+height);
			cells = new Vector.<GridCell>(size, true);
			
			var i:number = 0;
			var cx:number = 0;
			var cy:number = 0;
			var cell:GridCell;
			
			for (i; i < size; ++i) {
				cell = new GridCell();
				cell.x = cx;
				cell.y = cy;
				cells[i] = cell;
				
				cx++;
				if (cx == width) {
					cx = 0;
					cy++;
				}
			}
			G.grid = this;
		}
		
		/**
		 * Insert a Image into the grid and check for collisions
		 * with whatever is already in those cells.
		 * @param x   The X position, in pixels.
		 * @param y   The Y position, in pixels.
		 * @param obj The object to be inserted/checked.
		 */
		public function add(X:number, Y:number, obj:Image):void {
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