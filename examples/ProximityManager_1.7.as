/**
 * ProximityManager by Grant Skinner. Nov 10, 2009
 * Visit www.gskinner.com/blog for documentation, updates and more free code.
 *
 *
 * Copyright (c) 2009 Grant Skinner
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 https://github.com/mikechambers/ActionScript-3-Development-Task-Contests/tree/master/AS3DTC_1
 **/

package {
	
	import flash.display.DisplayObject;
	import flash.geom.Rectangle;
	
	public class ProximityManager {
		protected var grid:Vector.<DisplayObject>;
		protected var gridSize:Number;
		protected var bounds:Rectangle;
		protected var w:uint;
		protected var h:uint;
		protected var length:uint;
		protected var lengths:Vector.<uint>;
		protected var m:Number;
		
		public function ProximityManager(gridSize:Number=10,bounds:Rectangle=null) {
			this.gridSize = gridSize;
			this.bounds = bounds;
			init();
		}
		
		protected function init():void {
			// calculate the w/h of the grid (number of columns and rows):
			w = Math.ceil(bounds.width/gridSize)+1;
			h = Math.ceil(bounds.height/gridSize)+1;
			
			// calculate the number of cells in the grid:
			length = w*h;
			
			// precalculate the multiplier for determining grid position, because mult is faster than div:
			m = 1/gridSize;
			
			// this vector will store the lengths of the lists of items in each cell:
			lengths = new Vector.<uint>();
			
			
			// create a one dimensional representation of the grid. Shift the length by 7 bits
			// to leave room (128 values) in each grid position to store items in.
			// note that this could be increased to <<8 or <<10 (256 items or 1024 per position) without
			// impacting the speed, of update and getNeighbors but it has memory implications:
			grid = new Vector.<DisplayObject>(length<<7,true);
		}
		
		public function update(items:Vector.<DisplayObject>):void {
			// clear the lengths vector:
			lengths.length = 0;
			// reset it's length, so we can access positions in the vector arbitrarily:
			lengths.length = length;
			
			// grab length once, instead of recalculating:
			var l:uint = items.length;
			for (var i:uint=0; i<l; i++) {
				// grab a reference to the current item so we don't incur the lookup cost multiple times:
				var item:DisplayObject = items[i];
				
				// calculate the combined grid position:
				var pos:uint = (item.x*m|0)*h+item.y*m;
				
				// store the item in the one dimensional vector based on a unique combined index,
				// and increment the length count (so we will have a unique index at this position next time):
				grid[pos<<7|lengths[pos]++] = item;
			}
		}
		
		public function getNeighbors(item:DisplayObject,radius:uint=1):Vector.<DisplayObject> {
			var results:Vector.<DisplayObject> = new Vector.<DisplayObject>();
			
			// calculate the row / col position:
			var itemX:uint = item.x*m|0;
			var itemY:uint = item.y*m|0;
			
			// enforce grid boundaries:
			var minX:int = itemX-radius;
			if (minX < 0) { minX = 0; }
			var minY:int = itemY-radius;
			if (minY < 0) { minY = 0; }
			var maxX:uint = itemX+radius;
			if (maxX > w) { maxX = w; }
			var maxY:uint = itemY+radius;
			if (maxY > h) { maxY = h; }
			
			
			var l:uint=0;
			// loop through rows / cols and add items to the results vector:
			for (var x:int=minX; x<=maxX; x++) {
				for (var y:int=minY; y<=maxY; y++) {
					var pos:uint = x*h+y;
					var count:int=lengths[pos];
					while(count-->0) {
						// it's faster to add items to a specified index than to use push:
						results[l++] = grid[pos<<7|count];
					}
				}
			}
			return results;
		}
	}
}