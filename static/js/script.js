/* Author: Ulysses Popple
	NEXT: Get the list of posts and make 3d objects of them.
*/
define('App', 
	['jquery', 'three', 'PointerLockControls', 'Post'],
	function($, three, fpcs, post) {
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
        
        var ambientColor = 0x050505;

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
            renderer.setClearColor(0x000000, 1);

			camera  = new THREE.PerspectiveCamera(
				VIEW_ANGLE,
				ASPECT,
				NEAR,
				FAR);

			scene = new THREE.Scene();
            
            ////////////////////
            // Controls
            ////////////////////

		    controls = new THREE.PointerLockControls(camera, 0, 10, 50, scene);
            controls.enabled = true;
			scene.add(controls.getObject());
            
            ////////////////////
            // Lights
            ////////////////////

            var ambient = new THREE.AmbientLight(ambientColor);
            scene.add(ambient);


            /////////////////////
            // Ground
            // //////////////////
            var mesh, material;

            plane = new THREE.PlaneGeometry(groundSize, groundSize, groundSize / 10, groundSize / 10);
            material = new THREE.MeshPhongMaterial({ wireframe:true, color:0x3B5998});
            mesh = new THREE.Mesh(plane, material);
            mesh.receiveShadow = true;
            mesh.castShadow = false;
            scene.add(mesh);

            // Flip plane to be horizontal
            plane.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );


            /////////////////////
            // Skybox
            // //////////////////

            //TODO
            
            /////////////////////
            // The Scene!
            // //////////////////
            
            var postMesh = new THREE.PostMesh("All the world\'s a stage!", "Shakespeare", 50, 50);
            scene.add(postMesh);

            // Add the renderer to the page
			container.append(renderer.domElement);
        }

        function fillPost(context, text, x, y, maxWidth, lineHeight, author) {
            var authorY = wrapText(context, text, x, y, maxWidth, lineHeight);

            var align = context.align;
            context.textAlign = "end";
            context.fillText('- ' + author, maxWidth, authorY);
            context.textAlign = align;
        }

        function wrapText(context, text, x, y, maxWidth, lineHeight) {
            var words = text.split(' ');
            var line = '';

            for(var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = context.measureText(testLine);
                var textWidth = metrics.width;
                if(textWidth > maxWidth && n > 0) {
                    context.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                    console.log(y);
                } else {
                    line = testLine;
                }
            }

            context.fillText(line, x, y);

            return y + lineHeight;
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
