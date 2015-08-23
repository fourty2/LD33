var Player = function(playerName) {
	this.playerName = playerName;
}

Player.prototype = {
	mesh: null,
	accX: 0,
	accY: 0,
	accZ: 0,
	damping: 10,
	size: 8,
	init: function(position, color) {

 		
 		var texture =  THREE.ImageUtils.loadTexture( 'images/hannibal.jpg')  
		this.mesh = new THREE.Mesh(
				new THREE.SphereGeometry(this.size, 8, 8),
				new THREE.MeshLambertMaterial(
					{	color: color,
						shading: THREE.FlatShading,
						map: texture
					})
			);

		this.playerText = new THREE.Mesh(
				new THREE.TextGeometry(this.playerName,
						{
							size: 4,
							height: 1,
							font: 'LobsterLove',
							weight: 'normal',
							style: 'normal'
						}
					),
				new THREE.MeshLambertMaterial({color: 0x8800ff})
			);



		this.mesh.castShadow = true;

		this.mesh.position.set(position.x, position.y, position.z); 
		this.playerText.position.set(position.x, position.y + this.size + 5, position.z); 
		this.raycaster = new THREE.Raycaster();

	},
	updatePosition: function(field, player) {


		// raycasting to 
		this.raycaster.set (this.mesh.position, new THREE.Vector3(0, -1, 0).normalize());

		var intersects = this.raycaster.intersectObject(field, true);
		if (intersects.length > 0) {
			if (intersects[0].distance <= this.size + 1) {
				
				// 4.5
				this.mesh.position.y += (this.size - intersects[0].distance);
				/*
				console.log(this.mesh.position.y);
				console.log(this.accZ);*/
				this.accZ = -this.accZ * 0.80;
			} 
		}



		this.mesh.position.x = this.mesh.position.x + 
								this.accX;
		this.mesh.position.y = this.mesh.position.y + 
								this.accZ;

		this.mesh.position.z = this.mesh.position.z + 
								this.accY;

		this.accY = this.accY + (-this.accY * 0.1);
		
		this.accX = this.accX + (-this.accX * 0.1);

		if (this.accX > -0.18 && this.accX < 0.18) {
			this.accX = 0;
		}

		if (this.accY > -0.18 && this.accY < 0.18) {
			this.accY = 0;
		}

		if (this.accZ > -0.1 && this.accZ < 0.1) {
			this.accZ = 0;
		}



		// check for all directions

		this.raycaster.set (this.mesh.position, new THREE.Vector3(this.accX, this.accZ, this.accY).normalize());
		// check intersection on other player
		

		var bump = false;

		 var playerRays = [
		 		new THREE.Vector3(this.accX, this.accZ, this.accY).normalize(),
		      new THREE.Vector3(0, 0, 1),
		      new THREE.Vector3(1, 0, 1),
		      new THREE.Vector3(1, 0, 0),
		      new THREE.Vector3(1, 0, -1),
		      new THREE.Vector3(0, 0, -1),
		      new THREE.Vector3(-1, 0, -1),
		      new THREE.Vector3(-1, 0, 0),
		      new THREE.Vector3(-1, 0, 1)
		    ];

		  for (i = 0; i< playerRays.length; i++) {
			this.raycaster.set (this.mesh.position, playerRays[i]);
			var intersects = this.raycaster.intersectObject(player.mesh, false);
			if (intersects.length > 0) {
				if (intersects[0].distance <= this.size + 2) {
					bump = true;
					
				} else {
					
				}
			}
		  }

		  if (bump) {
				player.accX =this.accX * 2.50; 
				player.accY =this.accY * 2.50; 
				player.accZ =this.accZ * 1.0; 
				this.accX = -this.accX * 1.0;
				this.accY = -this.accY * 1.0;
				this.accZ = -this.accZ * 1.0;
		  }


		
		this.accZ -= 0.13;

		// cap accZ
		if (this.accZ > 5) {
			this.accZ = 5;
		}

		this.playerText.position.set(this.mesh.position.x + 5 , this.mesh.position.y + this.size + 3, this.mesh.position.z); 

		this.mesh.rotation.y += 0.01;
		//console.log(Math.tan(this.accX/this.accY));

	},
	move: function(x, y, btnA) {
		if (x < -0.18 || x > 0.18) {
			this.accX -= x * 0.3;
		}
		if (y < -0.08 || y > 0.08) {
			this.accY -= y * 0.3;
		}
		if (btnA.pressed && this.mesh.position.y < 50 + this.size && this.accZ < 0.5) {
			this.accZ = 3;
		}

	
	}


};