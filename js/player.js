var Player = {
	mesh: null,
	accX: 0,
	accY: 0,
	accZ: 0,
	damping: 10,
	init: function() {

		this.mesh = new THREE.Mesh(
				new THREE.SphereGeometry(5, 16, 16),
				new THREE.MeshLambertMaterial({color: 0x0000ff})
			);
		this.mesh.castShadow = true;

		this.mesh.position.set(0,10,0);

	},
	updatePosition: function() {
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



		if (this.mesh.position.y > 10) {
			this.accZ -= 0.13;
			
		} else if (this.accZ < -1) {
			this.mesh.position.y = 10;
			this.accZ = -this.accZ * 0.80;
		} else {
			this.accZ = 0;
		}
		
		

	},
	move: function(x, y, btnA) {
		if (x < -0.18 || x > 0.18) {
			this.accX -= x * 0.3;
		}
		if (y < -0.08 || y > 0.08) {
			this.accY -= y * 0.3;
		}
		if (btnA.pressed) {
			this.accZ = 2;
		}
	}


};