/**
 * Global state resources.
 */
define(['components/input/MouseController', 'components/input/KeyboardController'], function(MouseController, KeyboardController) {
	var g = {
		stage: null,
		renderer: null,
		grid: null,
		flow: null,
		map: null,
		
		debugCtx: null,
		components: null,
		settings: {
			drawVectors: true,
			flocking: true,
			followVectors: true,
			collision: true
		},
		
		elapsed: 0,
		
		// sim world dimensions
		width: window.innerWidth,
		height: window.innerHeight,
		
		mouse: new MouseController(),
		keys: new KeyboardController(),
		
		addComponent: function(entity, componentData, options) {
			var prop, idx, ComponentObject;
			options = options || null;
			
			prop = componentData.accessor;
			idx = componentData.index;
			ComponentObject = componentData.proto;
			
			if (!entity[prop]) {
				// console.log('[Kai] Adding '+prop);
				entity[prop] = new ComponentObject(entity, options);
				// engine.systemList[idx].add(entity[prop]);
			} /*else console.log('[Kai] '+prop+' already exists on entity');*/
			
			return entity[prop];
		},
		
		removeComponent: function(entity, componentData) {
			
		}
	};
	window.Kai = g;
	return g;
});