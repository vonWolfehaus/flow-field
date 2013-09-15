/*
	The MIT License

	Copyright (c) 2009 Arnaud Gatouillat / iq12 (fu AT iq12 D0T com)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

package
{
	import flash.display.DisplayObject;
	import __AS3__.vec.Vector;
	import flash.geom.Rectangle;
	import flash.utils.Dictionary;
	
	public class ProximityManager
	{
		/** Ratio of gridSize, calculated once to use multiplies instead of divisions */
		private var _gridSizeRatio:Number;
		
		/** The width of the grid in cells, includes an extra row on both edges */
		private var _gridWidth:int;
		/** The height of the grid in cells, includes an extra col on both edges */
		private var _gridHeight:int;
		
		/** bounds.x, stored in a class var for speedier access */
		private var _boundsX:Number;
		/** bounds.y, stored in a class var for speedier access */
		private var _boundsY:Number;
		
		/** The number of bits needed to store the height in a cellIndex */
		private var _heightNeededBits:int;
		/** Storage of items grouped by cellIndex */
		private var _itemsByCell:Vector.<Vector.<DisplayObject>>;
		/** The insertion point for each _itemsByCell vector */
		private var _itemsByCellInsertIdx:Vector.<int>;
		/** items.length at last #update */
		private var _lastItemsLength:int;
		/** Cache of cellIndexes by item */
		private var _lastCellIndexByItem:Dictionary = new Dictionary;
		
		/**
		*	Returns all display objects in the current and adjacent grid cells of the
		*	specified display object.
		*/
		public var getNeighbors:Function;
		
		/**
		*	Specifies a Vector of DisplayObjects that will be used to populate the grid.
		*/
		public var update:Function;
		
		/**
		 * The basic ideas are:
		 * 	-	use a vector to store for each cell, a vector of displayobjects
		 * 	-	identify each cell with an int.	as the cellIndex calculations with be called a lot of times use bitwise operations
		 *	-	for getting the actual neighbors, calculate all 9 cell indexes, and use Vector#concat to merge the vectors
		 * 	-	ints seem to be quicker than uints in this case (due to bitwise operators?)
		 * 
		 * Implementation:
		 * -	cell identifier:
		 * 			.	calculate to row# and col#
		 * 			.	shift the col# by the needed bits to store the maximum row# so they don't overlap each other
		 * 			.	use bitwise-OR (|) to merge col# and row#
		 * -	on the edges:
		 * 			. 	on bottom and right edges, we're created empty cells, nothing to do
		 * 			. 	on top and left edges, creating empty cells implied to +1 row# and col#, so it's slower
		 * 				we detect the cases and deflect the col# to the right cell (empty),  the row# to the top cell (empty)
		 * 
		 * Update 13.11.2009:
		 * 	-	added a check between runs to use the old data if items didn't move
		 * 		that check takes time: this is an optimization choice favoring still situations
		 * 
		 * @langversion ActionScript 3.0
		 * @playerversion Flash 10.0
		 *
		 * @author Arnaud Gatouillat / iq12 (fu AT iq12 D0T com)
		 * @since  12.11.2009
		 */
		public function ProximityManager(gridSize:int, bounds:Rectangle = null)
		{
			super();
			
			_gridSizeRatio		= 1 / Number(gridSize);
			
			// to avoid to test if we're on right and bottom edges,
			// we increase the grid dimensions by 1
			_gridWidth	= int( Math.ceil( bounds.width * _gridSizeRatio ) ) + 1;
			_gridHeight	= int( Math.ceil( bounds.height * _gridSizeRatio ) ) + 1;
			
			// calculate the number of bits needed to store the height in the cellIndexes
			_heightNeededBits = 1;
			
			var gridHeight:int = _gridHeight;
			while (gridHeight >>= 1)
				++_heightNeededBits;
			
			// the minimum vector length needed to store each cell with these parameters
			var l:int				= _gridWidth * (1 << _heightNeededBits);
			_itemsByCell			= new Vector.<Vector.<DisplayObject>>( l , true );
			_itemsByCellInsertIdx	= new Vector.<int>( l , true );
			
			// if true, we won't have to take bounds coordonates into account: use quicker methods			
			if ( bounds.x == 0 && bounds.y == 0 )
			{
				update					= updateZeroBased;
				getNeighbors			= getNeighborsZeroBased;
			}
			else
			{
				_boundsX 				= bounds.x;
				_boundsY 				= bounds.y;
				
				update					= updateNonZeroBased;
				getNeighbors			= getNeighborsNonZeroBased;
			}
		}
		
		/** Used to isolate #update speed */
		private function getNeighborsEmpty(item:DisplayObject):Vector.<DisplayObject>
		{
			return new Vector.<DisplayObject>;
		}
		
		private function updateZeroBased(items:Vector.<DisplayObject>):void
		{
			var cellIndex:int, item:DisplayObject;
			var itemLength:int = items.length;
			
			// if the items vector length changed since last run, don't try to use the cache from the previous run
			if (itemLength != _lastItemsLength)
			{
				var i:int = _itemsByCell.length;
				while (i)
				{
					_itemsByCell[--i] = new Vector.<DisplayObject>;
					_itemsByCellInsertIdx[i] = -1;
				}
				_lastItemsLength = itemLength;
				
				while (itemLength)
				{
					item							= items[--itemLength];
					_lastCellIndexByItem[item]		=	cellIndex 	= (int(item.x * _gridSizeRatio) << _heightNeededBits) | int(item.y * _gridSizeRatio);
					_itemsByCell[cellIndex][++_itemsByCellInsertIdx[cellIndex]] = item;
				}
			}
			else
			{
				// this will store invalid cell indexes (cells from whicht least one old item was removed)
				// we will remove these items later
				// also we store the length of these cell before this run as a commodity
				var cellsToCheck:Object = { };
				
				// do a pass on the items to check if any moved
				while (itemLength)
				{
					item		 			= items[--itemLength];
					cellIndex				= (int(item.x * _gridSizeRatio) << _heightNeededBits) | int(item.y * _gridSizeRatio);
					var lastCellIndex:int	= _lastCellIndexByItem[item];
					// is this item in the same cell as in the previous run?
					if ( lastCellIndex != cellIndex )
					{
						// mark the old cell as invalid
						cellsToCheck[lastCellIndex] = _itemsByCellInsertIdx[ cellIndex ];
						
						// push the item in its new cell
						_itemsByCell[ cellIndex ][ ++_itemsByCellInsertIdx[ cellIndex ] ] = item;
						
						// store the cellIndex for the next run
						_lastCellIndexByItem[item] = cellIndex;
					}
				}
				
				// do a pass on invalid cells
				for (var cellIndexS:String in cellsToCheck)
				{
					cellIndex = int(cellIndexS);
					
					var cellItems:Vector.<DisplayObject>			= _itemsByCell[ cellIndex ];
					// remove the old items (we have to check) from the vector and store these
					var cellItemsToCheck:Vector.<DisplayObject>		= cellItems.splice(0, cellsToCheck[ cellIndex ])
					var cellItemsInsertIdx:int						= cellItems.length - 1;
					
					i = cellItemsToCheck.length;
					// for each old item
					while (i)
					{
						item = cellItemsToCheck[--i];
						// the item didn't move
						if ( _lastCellIndexByItem[item] == cellIndex )
						{
							// so we insert him back in the cellItems vector
							cellItems[++cellItemsInsertIdx] = item;
						}
					}
					_itemsByCellInsertIdx[ cellIndex ] = cellItemsInsertIdx;
				}
			}
		}
		
		private function getNeighborsZeroBased(item:DisplayObject):Vector.<DisplayObject>
		{
			var gridX:int = int(item.x * _gridSizeRatio);
			var gridY:int = int(item.y * _gridSizeRatio);
			
			var encodedRightCol		:int = ( ( gridX ? gridX : _gridWidth ) - 1 ) 	<< _heightNeededBits;
			var encodedCenterCol	:int = gridX									<< _heightNeededBits;
			var encodedLeftCol		:int = (gridX + 1)								<< _heightNeededBits;
			
			var encodedTopRow		:int = ( ( gridY ? gridY : _gridHeight ) - 1 );
			var encodedCenterRow	:int = gridY;
			var encodedBottomRow	:int = gridY + 1;
			
			// storing centerCell as a vector speeds speeds up concat
			var centerCellVector	:Vector.<DisplayObject> = _itemsByCell[ encodedCenterCol | encodedCenterRow ];
			
			return  centerCellVector.concat(
						_itemsByCell[ encodedLeftCol	| encodedTopRow ],
						_itemsByCell[ encodedLeftCol	| encodedCenterRow ],
						_itemsByCell[ encodedLeftCol	| encodedBottomRow ],
						_itemsByCell[ encodedCenterCol	| encodedTopRow ],
						_itemsByCell[ encodedCenterCol	| encodedBottomRow ],
						_itemsByCell[ encodedRightCol	| encodedTopRow ],
						_itemsByCell[ encodedRightCol	| encodedCenterRow ],
						_itemsByCell[ encodedRightCol	| encodedBottomRow ]
					);
		}
		
		private function updateNonZeroBased(items:Vector.<DisplayObject>):void
		{
			var cellIndex:int, item:DisplayObject;
			var itemLength:int = items.length;
			
			// if the items vector length changed since last run, don't try to use the cache from the previous run
			if (itemLength != _lastItemsLength)
			{
				var i:int = _itemsByCell.length;
				while (i)
				{
					_itemsByCell[--i] = new Vector.<DisplayObject>;
					_itemsByCellInsertIdx[i] = -1;
				}
				_lastItemsLength = itemLength;
				
				while (itemLength)
				{
					item							= items[--itemLength];
					_lastCellIndexByItem[item]		=	cellIndex 	= (int( (item.x-_boundsX) * _gridSizeRatio) << _heightNeededBits) | int( (item.y-_boundsY) * _gridSizeRatio);
					_itemsByCell[cellIndex][++_itemsByCellInsertIdx[cellIndex]] = item;
				}
			}
			else
			{
				// this will store invalid cell indexes (cells from whicht least one old item was removed)
				// we will remove these items later
				// also we store the length of these cell before this run as a commodity
				var cellsToCheck:Object = { };
				
				// do a pass on the items to check if any moved
				while (itemLength)
				{
					item		 			= items[--itemLength];
					cellIndex				= (int( (item.x-_boundsX) * _gridSizeRatio) << _heightNeededBits) | int( (item.y-_boundsY) * _gridSizeRatio);
					var lastCellIndex:int	= _lastCellIndexByItem[item];
					// is this item in the same cell as in the previous run?
					if ( lastCellIndex != cellIndex )
					{
						// mark the old cell as invalid
						cellsToCheck[lastCellIndex] = _itemsByCellInsertIdx[ cellIndex ];
						
						// push the item in its new cell
						_itemsByCell[ cellIndex ][ ++_itemsByCellInsertIdx[ cellIndex ] ] = item;
						
						// store the cellIndex for the next run
						_lastCellIndexByItem[item] = cellIndex;
					}
				}
				
				// do a pass on invalid cells
				for (var cellIndexS:String in cellsToCheck)
				{
					cellIndex = int(cellIndexS);
					
					var cellItems:Vector.<DisplayObject>			= _itemsByCell[ cellIndex ];
					// remove the old items (we have to check) from the vector and store these
					var cellItemsToCheck:Vector.<DisplayObject>		= cellItems.splice(0, cellsToCheck[ cellIndex ])
					var cellItemsInsertIdx:int						= cellItems.length - 1;
					
					i = cellItemsToCheck.length;
					// for each old item
					while (i)
					{
						item = cellItemsToCheck[--i];
						// the item didn't move
						if ( _lastCellIndexByItem[item] == cellIndex )
						{
							// so we insert him back in the cellItems vector
							cellItems[++cellItemsInsertIdx] = item;
						}
					}
					_itemsByCellInsertIdx[ cellIndex ] = cellItemsInsertIdx;
				}
			}
		}
		
		private function getNeighborsNonZeroBased(item:DisplayObject):Vector.<DisplayObject>
		{
			var gridX:int = int( (item.x-_boundsX) * _gridSizeRatio);
			var gridY:int = int( (item.y-_boundsY) * _gridSizeRatio);
			
			var encodedRightCol		:int = ( ( gridX ? gridX : _gridWidth ) - 1 ) 	<< _heightNeededBits;
			var encodedCenterCol	:int = gridX									<< _heightNeededBits;
			var encodedLeftCol		:int = (gridX + 1)								<< _heightNeededBits;
			
			var encodedTopRow		:int = ( ( gridY ? gridY : _gridHeight ) - 1 );
			var encodedCenterRow	:int = gridY;
			var encodedBottomRow	:int = gridY + 1;
			
			// storing centerCell as a vector speeds speeds up concat
			var centerCellVector	:Vector.<DisplayObject> = _itemsByCell[ encodedCenterCol | encodedCenterRow ];
			
			return  centerCellVector.concat(
						_itemsByCell[ encodedLeftCol	| encodedTopRow ],
						_itemsByCell[ encodedLeftCol	| encodedCenterRow ],
						_itemsByCell[ encodedLeftCol	| encodedBottomRow ],
						_itemsByCell[ encodedCenterCol	| encodedTopRow ],
						_itemsByCell[ encodedCenterCol	| encodedBottomRow ],
						_itemsByCell[ encodedRightCol	| encodedTopRow ],
						_itemsByCell[ encodedRightCol	| encodedCenterRow ],
						_itemsByCell[ encodedRightCol	| encodedBottomRow ]
					);
		}
	}
}