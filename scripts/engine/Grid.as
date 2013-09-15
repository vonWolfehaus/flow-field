package pixelhaus {
	import flash.geom.Rectangle;
	import pixelhaus.PxG;
	import pixelhaus.PxPoint;
	import pixelhaus.PxImage;
	import pixelhaus.structures.*;
	//import no.doomsday.console.//ConsoleUtil;
	/**
	 * A two-dimensional array.
	 */
	public class PxGrid {
		public var width:int, height:int;
		public var cellSize:int, sizeMulti:Number;
		public var size:int;
		public var cells:Vector.<PxGridCell>; // ships
		public var gcells:Vector.<PxGridCell>; // ground units
		public var mcells:Vector.<PxGridCellMeta>; // meta objects
		
		// collision helpers
		public var caster:PxImage;
		public var raySprite:PxImage;
		public var hitRect:Rectangle;
		public var angle:Number;
		public var cosa:Number;
		public var sina:Number;
		
		public var flxp:PxPoint;
		public var flxpRef:PxPoint;
		public var v1:PxPoint;
		public var v2:PxPoint;
		//debuging
		private var dr:Rectangle;
		
		/**
		 * Initializes a two-dimensional array to match a given cell size. Handles obj-to-obj collision
		 * detection and reaction physics. Provides a 2d array of all major GOs, organizing them nicely.
		 * @param Size The size of a grid cell in pixels. Grid figures out the rest.
		 */
		public function PxGrid(s:int) {
			cellSize = s;
			sizeMulti = 1 / s;
			flxpRef = new PxPoint();
			v1 = new PxPoint();
			v2 = new PxPoint();
			
			dr = new Rectangle();
			dr.width = dr.height = cellSize;
			
			hitRect = new Rectangle();
			width = (PxG.lvlSize * sizeMulti)+1;
			height = (PxG.lvlSize * sizeMulti)+1;
			size = width * height + 1;
			////ConsoleUtil.("grid w: "+width+" h: "+height);
			cells = new Vector.<PxGridCell>(size, true);
			gcells = new Vector.<PxGridCell>(size, true);
			//mcells = new Vector.<PxGridCellMeta>(size, true);
			var i:int = 0;
			var cx:int = 0;
			var cy:int = 0;
			var cell:PxGridCell;
			
			for (i; i < size; ++i) {
				cell = new PxGridCell();
				cell.x = cx;
				cell.y = cy;
				cells[i] = cell;
				
				cx++;
				if (cx == width) {
					cx = 0;
					cy++;
				}
			}
			PxG.grid = this;
		}
		
		/**
		 * Insert a PxImage into the grid and check for collisions
		 * with whatever is already in those cells.
		 * @param x   The X position, in pixels.
		 * @param y   The Y position, in pixels.
		 * @param obj The object to be inserted/checked.
		 */
		public function add(X:int, Y:int, obj:PxImage):void {
			var gr:Rectangle = obj.sprRect;
			var x:int = (gr.x - PxG.scroll.x) >> 0;
			var y:int = (gr.y - PxG.scroll.y) >> 0;
			var sx:int = (x * sizeMulti) + 1; // starting grid cell coordinates (top-left)
			var ssx:int = sx;
			var sy:int = (y * sizeMulti) + 1;
			var ex:int = ((x+obj.width) * sizeMulti) + 1; // ending grid cell coordinates (bottom-right)
			var ey:int = ((y+obj.height) * sizeMulti) + 1;
			// figure out dimensional occupation (in cells)
			var ow:int = ex - sx + 1;
			var oh:int = ey - sy + 1;
			var numCells:int = ow * oh;
			// loop through each cell
			var i:int, index:int;
			var cell:PxGridCell;
			//var node:ImageListNode;
			//var nodeSprite:PxImage;
			//var ikk:Number;
			for (i = 0; i < numCells; ++i) {
				index = (sy * width) + sx;
				if (index < 0) continue;
				if (index >= size) continue;
				//if (!obj.fixed) {
					//dr.x = ((sx-1)*cellSize) + PxG.scroll.x; // DEBUG
					//dr.y = ((sy-1)*cellSize) + PxG.scroll.y;
					//PxU.drawRect(dr, true);
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
		public function getNeighbors(sprite:PxImage, radius:int=1):void {
			var n:ImageList = sprite.neightbors;
			n.clear();
			var centerX:int = sprite.x + sprite.halfWidth;
			var centerY:int = sprite.y + sprite.halfHeight;
			var sx:int = (centerX * sizeMulti) - radius; // starting grid cell coordinates (top-left)
			var ssx:int = sx;
			var sy:int = (centerY * sizeMulti) - radius;
			var ex:int = (centerX * sizeMulti) + radius; // ending grid cell coordinates (bottom-right)
			var ey:int = (centerY * sizeMulti) + radius;
			// figure out dimensional occupation (in cells)
			var ow:int = ex - sx + 1;
			var oh:int = ey - sy + 1;
			var numCells:int = ow * oh;
			// loop through each cell
			var i:int, index:int;
			var cell:PxGridCell;
			var node:ImageListNode;
			var nodeSprite:PxImage;
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