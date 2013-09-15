// https://github.com/ekelleyv/Flocking/blob/master/js/bird.js

	if (vector.length() > max) {
		vector.normalize();
		vector.multiplyScalar(max);
	}

	if (vector.length() < min) {
		vector.normalize();
		vector.multiplyScalar(min);
	}

	vector.y = Math.min(vector.y, 2*this.max_climb);