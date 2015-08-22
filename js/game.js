var ld33 = {
	renderer: null,
	gamecanvas: null,
	camera: null,
	scene: null,
	field: null,
	init: function() {
	
		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;

		var NEAR = 0.1;
		var FAR = 5000;
		var FOV = 45;


		this.gamecanvas = document.getElementById('gamecanvas');
		this.renderer = new THREE.WebGLRenderer({canvas: this.gamecanvas});

		this.renderer.setSize(WIDTH, HEIGHT);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMapSoft = true;
		this.renderer.setClearColor(0xfff0f0, 1);


		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(FOV, WIDTH/ HEIGHT, NEAR, FAR);
		this.camera.position.set(0,100,-100);
		this.scene.add(this.camera);

		// 
		var light = new THREE.DirectionalLight(0xffffff);
		light.position.set(20,50,0);
		light.target.position.set(0, 0, 0);
		light.castShadow = true;

		light.shadowCameraNear = 0.1;
		light.shadowCameraFar = 300;

		light.shadowCameraLeft = -50;
		light.shadowCameraRight = 50;
		light.shadowCameraTop = 50;
		light.shadowCameraBottom = -50;
	//	light.shadowCameraVisible = true;
		
		this.scene.add(light);



                                                                                                                                                                                                                                                                          
		this.field = new THREE.Mesh(
			new THREE.BoxGeometry(100,10,100),
			new THREE.MeshLambertMaterial(
				{color: 0x80f080,
					shading: THREE.FlatShading
				}));
		this.field.receiveShadow = true;
		this.scene.add(this.field);


		console.log(this.camera.position);
		this.camera.lookAt(this.field.position);


		// init player
		this.player1 = new Player();//.init();
		this.player1.init(new THREE.Vector3(-30,30,-30), 0xff0000);
		this.scene.add(this.player1.mesh);

		this.player2 = new Player();//.init();
		this.player2.init(new THREE.Vector3(30,30,30), 0x0000ff);
		this.scene.add(this.player2.mesh);


		this.animate();
		// @todo onresize handling
	},

	checkInput: function() {



		var pads = navigator.getGamepads();
		if (pads[0]) {
			var pad = pads[0];

			this.player1.move(pad.axes[0], pad.axes[1], pad.buttons[0]);
			this.player2.move(pad.axes[2], pad.axes[3], pad.buttons[1]);

		}
	
	},

	checkWinOrLoose: function() {

		if (this.player1.mesh.position.y < -30) {
			console.log("player1 lost");
			this.player1.mesh.position.set(-30,30,-30);
		}

		if (this.player2.mesh.position.y < -30) {
			console.log("player2 lost");
			this.player2.mesh.position.set(30,30,30);
		}


	},

	render: function() {

		this.checkInput();
		this.player1.updatePosition(this.field, this.player2);
		this.player2.updatePosition(this.field, this.player1);

		this.checkWinOrLoose();

		this.renderer.render(this.scene, this.camera);
	},

	animate: function() {
		requestAnimationFrame(ld33.animate);
		ld33.render()
	},


	// @todo later:
	onResize: function() {

	}
};


ld33.init();