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

		    controls = new THREE.PointerLockControls(camera, 0, 10, 50, scene);
            controls.enabled = true;
			scene.add(controls.getObject());
            
            ////////////////////
            // Lights
            ////////////////////

            var ambient = new THREE.AmbientLight(ambientColor);
            scene.add(ambient);

            directionalLight = new THREE.DirectionalLight(directionalColor, 1);
            directionalLight.position.set(0, 100, 100);
            scene.add(directionalLight);

            directionalLight.castShadow = true;

            directionalLight.shadowMapWidth = 2048;
            directionalLight.shadowMapHeight = 2048;

            var d = 100;

            directionalLight.shadowCameraRight     =  d;
            directionalLight.shadowCameraLeft     = -d;
            directionalLight.shadowCameraTop      =  d;
            directionalLight.shadowCameraBottom   = -d;
            directionalLight.shadowCameraVisible = false;


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
        
            // Making a post object
            //The text
            var canvas = document.createElement('canvas');

            var text = "All the world\'s a stage and all the men and women merely players. Something about the stages of life.";

            var context = canvas.getContext('2d');
            var maxWidth = 1050, lineHeight = 75;
            
            canvas.style.border = "1px black solid"
            canvas.width = maxWidth + lineHeight * 2;
            context.font = '60px Ariel';
            canvas.height = ((context.measureText(text).width / maxWidth) + 4) * lineHeight;

            context.fillStyle = 'black';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'white';
            context.fillRect(2, 2, canvas.width-4, canvas.height-4);
            context.font = '60px Ariel';
            context.fillStyle = "rgba(0, 0, 0, 0.95)";
            context.textBaseline = 'top';

            fillPost(context, text, (canvas.width - maxWidth) / 2, lineHeight, maxWidth, lineHeight, "Shakespeare");
            var wall =  {width: canvas.width / 16, height: canvas.height / 16};

            //context.fillText("Hello World this is a status which goes on and on and on", 0, 50);
            console.log(wall.width + ' ' + wall.height + ', ' + canvas.width + ' ' + canvas.height);
            // Use the canvas as a texture
            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;

            material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide })
            //material.transparent = true;

            mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(wall.width, wall.height),
                    material
                );

            mesh.position.set(0, wall.height / 2, 0);
            mesh.receiveShadow = false;
            mesh.castShadow = false;
            scene.add(mesh);

            // Now make a cube to act as a wall
            material = new THREE.MeshPhongMaterial({ambient: 0x000000, color: 0xffffff, specular: 0x555555, shininess: 30});
            mesh = new THREE.Mesh(
                    new THREE.CubeGeometry(wall.width, wall.height, 6, 10, 10, 10),
                    material
                );
            mesh.position.set(0, wall.height / 2, -3.1);
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            scene.add(mesh);

            //Now add a cube in front
            material = new THREE.MeshPhongMaterial({ambient: 0x000000, color: 0xffffff, specular: 0x555555, shininess: 30});
            mesh = new THREE.Mesh(
                    new THREE.CubeGeometry(10, 10, 10, 10, 10, 10),
                    material
                );
            mesh.position.set(0, 5, 20);
            mesh.receiveShadow = false;
            mesh.castShadow = true;
            scene.add(mesh);

            //controls.lookAt(directionalLight.position);

            //Point the light at it
            directionalLight.target = mesh;

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
