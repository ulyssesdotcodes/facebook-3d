define('Post', ['three'], function(three) {
	var Post = function(message) {
		THREE.CubeGeometry.call(this, 20, 10, 2, 20, 10, 2);

		this.prototype = THREE.CubeGeometry();
		this.prototype.contructor = Post;
	}
});