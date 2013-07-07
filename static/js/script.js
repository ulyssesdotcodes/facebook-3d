/* Author: YOUR NAME HERE
*/
define('App', 
	['jquery', 'three'],
	function($, three) {
		// Using the correct requestAnimationFrame
		window.requestAnimFrame = (function(){
		  return  window.requestAnimationFrame       ||
		          window.webkitRequestAnimationFrame ||
		          window.mozRequestAnimationFrame    ||
		          function( callback ){
		            window.setTimeout(callback, 1000 / 60);
		          };
		})();
		$(document).ready(function() {   
			//START THE THREENESS!

			var WIDTH = $(window).width()-20,
				HEIGHT = $(window).height()-20;

			var VIEW_ANGLE = 45,
				ASPECT = WIDTH / HEIGHT,
				NEAR = 0.1,
				FAR = 10000;

			var $container = $('#stage');

			var renderer = new THREE.WebGLRenderer();

			var camera  = new THREE.PerspectiveCamera(
				VIEW_ANGLE,
				ASPECT,
				NEAR,
				FAR);

			var scene = new THREE.Scene();

			scene.add(camera);

			camera.position.z = 300;
			camera.position.y = -300;
			camera.lookAt(new THREE.Vector3(0,-65,0));

			renderer.setSize(WIDTH,HEIGHT);

			$container.append(renderer.domElement);

			var planeMaterial =
			  new THREE.MeshLambertMaterial(
			    {
			      color: 0xCC0000
			    });
			// set up the sphere vars
			var radius = 50,
			    segments = 16,
			    rings = 16;

			// create a new mesh with
			// sphere geometry - we will cover
			// the sphereMaterial next!
			var plane = new THREE.Mesh(

			  new THREE.PlaneGeometry(
			    300, 300),

			  planeMaterial);

			// add the sphere to the scene
			scene.add(plane);


			// create a point light
			var pointLight =
			  new THREE.PointLight(0xFFFFFF);

			// set its position
			pointLight.position.x = 10;
			pointLight.position.y = 50;
			pointLight.position.z = 130;

			// add to the scene
			scene.add(pointLight);

			renderer.render(scene, camera);

			//Animation

			var lastTime = 0;
			var angularSpeed = 0.2;
			(function animate(){
		        // update
		        var time = $.now();
		        var timeDiff = time - lastTime;
		        var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
		        plane.rotation.z += angleChange;
		        lastTime = time;
		 
		        // request new frame
		        requestAnimFrame(animate);

		        // render
		        renderer.render(scene, camera);
		    })();
			requestAnimFrame(animate);
		});		
	}
);
