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
        

        var container;

        var camera, scene, renderer, controls;

        var plane, sphere, objects = [];
       
        var directionalLight;
        
        var ambientColor = 0x050505, directionalColor = 0xffffff;

        var groundSize = 300;

        var lastTime = 0;

        function init(){

            ////////////////////
            // Init variables after page loads
            ////////////////////
            var WIDTH = $(window).innerWidth(),
                HEIGHT = $(window).innerHeight();
            
            var VIEW_ANGLE = 45,
                ASPECT = WIDTH / HEIGHT,
                NEAR = 0.1,
                FAR = 10000;
            
            ////////////////////
            // Setting the scene
            ////////////////////
            container = $("#stage");
			
            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.shadowMapEnabled = true;
            renderer.shadowMapSoft = true;
            renderer.setSize(WIDTH, HEIGHT);

			camera  = new THREE.PerspectiveCamera(
				VIEW_ANGLE,
				ASPECT,
				NEAR,
				FAR);

			scene = new THREE.Scene();
            
            ////////////////////
            // Controls
            ////////////////////

		    controls = new THREE.PointerLockControls(camera, 0, 10, 50);
            controls.enabled = true;
			scene.add(controls.getObject());
            
            ////////////////////
            // Lights
            ////////////////////

            var ambient = new THREE.AmbientLight(ambientColor);
            scene.add(ambient);

            directionalLight = new THREE.DirectionalLight(directionalColor, 1);
            directionalLight.position.set(100, 100, 0);
            scene.add(directionalLight);

            directionalLight.castShadow = true;

            directionalLight.shadowMapWidth = 2048;
            directionalLight.shadowMapHeight = 2048;

            var d = 50;

            directionalLight.shadowCameraRight     =  d;
            directionalLight.shadowCameraLeft     = -d;
            directionalLight.shadowCameraTop      =  d;
            directionalLight.shadowCameraBottom   = -d;

            /////////////////////
            // Ground
            // //////////////////
            var mesh, material;

            plane = new THREE.PlaneGeometry(groundSize, groundSize);
            material = new THREE.MeshPhongMaterial({emissive: 0xbbbbbb, shininess: 50, reflectivity: 0.9});
            mesh = new THREE.Mesh(plane, material);
            mesh.receiveShadow = true;
            mesh.castShadow = false;
            scene.add(mesh);

            // Flip plane to be horizontal
            plane.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
            
            /////////////////////
            // The Scene!
            // //////////////////
            
            sphere = new THREE.SphereGeometry(10, 20, 20);
            material = new THREE.MeshPhongMaterial({specular: 0x3B5998, diffuse: 0x3B5998});
            mesh = new THREE.Mesh(sphere, material);
            mesh.position.y = 15;
            mesh.receiveShadow = false;
            mesh.castShadow = true;
            scene.add(mesh);

            //Point the light at it
            directionalLight.target = mesh;

            // Add the renderer to the page
			container.append(renderer.domElement);
        }


        function animate(){
            // request new frame
            requestAnimFrame(animate);
            
            // update
            var time = $.now();
            var timeDiff = time - lastTime;

            // Animation logic
            controls.update(timeDiff, objects);

            //Update the time
            lastTime = time;
            
            //Render
            renderer.render(scene, camera);
        };

        function onWindowResize() {
            WIDTH = $(window).innerWidth();
            HEIGHT = $(window).innerHeight();

            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
            
            renderer.setSize(WIDTH, HEIGHT);
        }


		$(document).ready(function() {   

            init();
            animate();
            
            $(window).resize(onWindowResize);
		});
	}
);
