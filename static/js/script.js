/* Author: Ulysses Popple
	NEXT: Get the list of posts and make 3d objects of them.
*/
define('App', 
	['jquery', 'three', 'PointerLockControls'],
	function($, three, fpcs) {
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
            
            var objects = [];

			var renderer = new THREE.WebGLRenderer();

			var camera  = new THREE.PerspectiveCamera(
				VIEW_ANGLE,
				ASPECT,
				NEAR,
				FAR);
            camera.position.x = 0;
            camera.position.y = 10;
            camera.position.z = 0;

			var scene = new THREE.Scene();


			var controls = new THREE.PointerLockControls(camera);
            controls.enabled = true;
			scene.add(controls.getObject());

			renderer.setSize(WIDTH,HEIGHT);
            
            var ray = new THREE.Raycaster();
            ray.ray.direction.set(0,-1,0);

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
            plane.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
			// add the plane to the scene
			scene.add(plane);
            
            // Let's add a cube!

            var cube = new THREE.CubeGeometry(20, 20, 20);
            
            var startCube = new THREE.Mesh( new THREE.CubeGeometry(20,20,20),
                    new THREE.MeshLambertMaterial({ color: 0x00CC00 }));
            scene.add(startCube);

            for(var i = 0; i < cube.faces.length; i++){
                var face = cube.faces[i];

                face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
                face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
                face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
                face.vertexColors[ 3 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            }
            var material;

            // Add facebook code here 

            for(var i=0; i < 20; i++){
                material = new THREE.MeshPhongMaterial({specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });

                var mesh = new THREE.Mesh( cube, material );
                mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
                mesh.position.y = 10; 
                mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

                scene.add(mesh);

                material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                
                objects.push(mesh);

            }

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
			function animate(){
		        // request new frame
		        requestAnimFrame(animate);
                
                // update
		        var time = $.now();
		        var timeDiff = time - lastTime;

		        // Animation logic
                
                // Intersect below logic
		        //controls.isOnObject(false);
                //ray.ray.origin.copy(controls.getObject().position);
                //ray.ray.origin.y -= 10;

                //var intersections = ray.intersectObjects(objects);

                //if(intersections.length > 0){
                //   var distance = intersections[0].distance;

                 //   if(distance > 0 && distance < 10){
                   //     controls.isOnObject(true);
                    //}
               // }
                
                controls.update(timeDiff, objects);

                //console.log(controls.yawObject);

		        lastTime = time;
		        //scene.simulate();
		        // render
		        renderer.render(scene, camera);
		    };
			requestAnimFrame(animate);
		});		
	}
);
