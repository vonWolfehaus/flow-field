/**
 * Global state resource.
 */
define(['components/input/MouseController', 'components/input/KeyboardController'], function(MouseController, KeyboardController) {
	return {
		stage: null,
		renderer: null,
		grid: null,
		flow: null,
		
		debugCtx: null,
		components: null,
		
		elapsed: 0,
		
		// sim world dimensions
		width: window.innerWidth,
		height: window.innerHeight,
		
		mouse: new MouseController(),
		keys: new KeyboardController()
	};
});