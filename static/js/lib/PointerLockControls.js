/**
 * @author mrdoob / http://mrdoob.com/
 */
define('PointerLockControls', ['three', 'physijs'], function(three, physijs){
THREE.PointerLockControls = function ( camera,  x, y, z, cameraScene ) {
	var scene = cameraScene;
	var scope = this;
    this.camera = camera;
	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.x = y || 0;
	yawObject.position.y = y || 10;
	yawObject.position.z = z || 0;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var resetLook = false;

	var isOnObject = false;
	var canJump = false;
    var raycaster = new THREE.Raycaster();
    raycaster.near = 0.1;
    raycaster.far = 100;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.01;
		pitchObject.rotation.x -= movementY * 0.01;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 10;
				canJump = false;
				break;
			case 82: // r
				resetLook = true;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // a
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};


	

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	
    this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};


	this.lookAt = function( target ) {
		var rotVec, axisTarget, toTarget, angle, sign;

		// Get the rotation vector, this is a vector from the current position to 1 unit in front of the camera
		rotVec = yawObject.localToWorld(new THREE.Vector3(0,0,-1)).sub(yawObject.position);
		rotVec.y = 0;
		rotVec.normalize();

        // The target has to be flattened to the xz plane so that rotation only occurs on the y axis
        axisTarget = target.clone().sub(yawObject.position);
        axisTarget.y = 0;
        axisTarget.normalize();

        //The angle to rotate on the y-axis (because we flattened it to the xz plane) 
        angle = Math.acos(rotVec.dot(axisTarget));

        // Finally figure out which direction to rotate in, and rotate the correct angle!
        axisTarget.add(yawObject.position);
        axisTarget = yawObject.worldToLocal(axisTarget);
        rotVec.add(yawObject.position);
        rotVec = yawObject.worldToLocal(rotVec);
        sign = ( rotVec.x - axisTarget.x ) / Math.abs( rotVec.x - axisTarget.x );
        behindCorrection = (axisTarget.z > 0) ? PI_2 : 0
        yawObject.rotateOnAxis(new THREE.Vector3(0,1,0), sign * angle + behindCorrection);

		
		// Get the rotation vector, this is a vector from the current position to 1 unit in front of the camera
		// Have to make this from the yawObject because the pitchObject is a child
		rotVec = pitchObject.localToWorld(new THREE.Vector3(0,0,-1)).sub(yawObject.position);
		rotVec.x = 0;
		rotVec.normalize();

        // The target has to be flattened to the yz plane so that rotation only occurs on the y axis
        axisTarget = target.clone().sub(yawObject.position);
        axisTarget.x = 0;
        axisTarget.normalize();

        //The angle to rotate on the x-axis (because we flattened it to the yz plane) 
        angle = Math.acos(rotVec.dot(axisTarget));

        // Finally figure out which direction to rotate in, and rotate the correct angle!
        axisTarget.add(yawObject.position);
        axisTarget = yawObject.worldToLocal(axisTarget);
        rotVec.add(yawObject.position);
        rotVec = yawObject.worldToLocal(rotVec);

        sign = ( axisTarget.y -  rotVec.y ) / Math.abs( axisTarget.y - rotVec.y );
        pitchObject.rotateOnAxis(new THREE.Vector3(1,0,0), sign * angle);

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

		resetLook = false;
	}

	this.update = function ( delta, objects ) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		velocity.x += ( - velocity.x ) * 0.08 * delta;
		velocity.z += ( - velocity.z ) * 0.08 * delta;

		velocity.y -= 0.25 * delta;

		if ( moveForward ) velocity.z -= 0.12 * delta;
		if ( moveBackward ) velocity.z += 0.12 * delta;

		if ( moveLeft ) velocity.x -= 0.12 * delta;
		if ( moveRight ) velocity.x += 0.12 * delta;

		if ( resetLook ) this.lookAt(new THREE.Vector3(0,0,0));
        
        
        if(this.consoleCount === undefined) this.consoleCount = 0;
        if(this.consoleCount < 100 && velocity.x != 0){
            this.consoleCount++;
        }

		if ( isOnObject === true ) {
			
            velocity.y = Math.max( 0, velocity.y );

		}



		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y ); 
		yawObject.translateZ( velocity.z );

		if ( yawObject.position.y < 10 ) {

			velocity.y = 0;
			yawObject.position.y = 10;

			canJump = true;

		}

	};

};
});
