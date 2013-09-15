function Point3(x, y, z) {
	if (typeof x === 'undefined') x = 0;
	if (typeof y === 'undefined') y = 0;
	if (typeof z === 'undefined') z = 0;
	this.x = x;
	this.y = y;
	this.z = z;
}