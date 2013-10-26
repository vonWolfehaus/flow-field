// instead of typing all this shit out by hand, have a script that build the list of all js files in
// the components folder and just load that in (they'll have to be sorted by dependencies)
define(['components/behaviors/Flock', 'components/VectorFieldState', 'components/BoundingCircle'],
       function(Flock, VectorFieldState, BoundingCircle) {
	
	var c = {
		VECTOR_FIELD: { accessor: 'vecFieldState', index: 0, proto: VectorFieldState },
		FLOCK: { accessor: 'flock', index: 1, proto: Flock },
		RADIAL_COLLIDER: { accessor: 'collider', index: 1, proto: BoundingCircle }
	};
	
	window.ComponentType = c;
	
	return c;

});
