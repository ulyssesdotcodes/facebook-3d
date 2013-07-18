define('Post', ['three'], function(three) {
	THREE.PostMesh = function(text, author, x, z) {
		var position =  {
			x: x || 0,
			y: 0,
			z: z || 0
		}

		var directionalLight, directionalColor = 0xffffff;

		var canvas = document.createElement('canvas');

        var context = canvas.getContext('2d');
        var maxWidth = 1050, lineHeight = 75;
        
        canvas.style.border = "1px black solid";
        context.font = '60px Ariel';
        canvas.width = Math.min(maxWidth + lineHeight * 2, context.measureText(text).width + lineHeight * 3 );
        if(canvas.width < maxWidth + lineHeight * 2) maxWidth = canvas.width - lineHeight * 2;
        canvas.height = ((context.measureText(text).width / maxWidth) + 4) * lineHeight;

        context.strokeStyle = 'white';
        context.strokeRect(0, 0, canvas.width, canvas.height);
        context.font = '60px Ariel';
        context.fillStyle = "rgba(255, 255, 255, 0.95)";
        context.textBaseline = 'top';

        fillPost(context, text, (canvas.width - maxWidth) / 2, lineHeight, maxWidth, lineHeight, author);
        var wall =  {width: canvas.width / 16, height: canvas.height / 16};

        // Use the canvas as a texture
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        material = new THREE.MeshBasicMaterial( {map: texture, overdraw: true, transparent: true} );

        var materials = new Array();
        for(var i = 0; i < 6; i++) {
            if(i == 2 || i == 3) materials.push(new THREE.MeshBasicMaterial( {transparent: true}));
            else materials.push(material);
        }
        mesh = new THREE.Mesh(
                new THREE.CubeGeometry(wall.width, wall.height, wall.width, 10, 10, 10),
                new THREE.MeshFaceMaterial(materials)
            );
        position.y = wall.height / 2;
        mesh.position.set(position.x, position.y, position.z);
        mesh.receiveShadow = false;
        mesh.castShadow = false;

        for(var i =0; i < 4; i++) {
            directionalLight = new THREE.DirectionalLight(directionalColor, 1);
            switch(i) {
                case 0: directionalLight.position.set(0, 100, 100); break;
                case 1: directionalLight.position.set(0, 100, -100); break;
                case 2: directionalLight.position.set(100, 100, 0); break;
                case 3: directionalLight.position.set(-100, 100, 0); break;
            }
            mesh.add(directionalLight);

            directionalLight.castShadow = true;

            directionalLight.shadowMapWidth = 2048;
            directionalLight.shadowMapHeight = 2048;

            var d = 100;

            directionalLight.shadowCameraRight     =  d;
            directionalLight.shadowCameraLeft     = -d;
            directionalLight.shadowCameraTop      =  d;
            directionalLight.shadowCameraBottom   = -d;
            directionalLight.shadowCameraVisible = false;    

            directionalLight.target = mesh;
        }


        return mesh;
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
});