var ld33 = {
	renderer: null,
	gamecanvas: null,
	camera: null,
	scene: null,
	field: null,
	startTime: null,
	pointsP1: 0,
	pointsP2: 0,
	gameState: 0,
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


		var xS = 63, yS = 63;

		this.field = new THREE.Object3D();

		var terrain = THREE.Terrain({
		    easing: THREE.Terrain.Linear,
		    frequency: 2.5,
		    heightmap: THREE.Terrain.Hill,
		    material: new THREE.MeshLambertMaterial({color: 0x80f080, shading: THREE.FlatShading}),
		    maxHeight: 10,
		    minHeight: 0,
		    steps: 1,
		    useBufferGeometry: false,
		    xSegments: xS,
		    xSize: 100,
		    ySegments: yS,
		    ySize: 100,
		});
		terrain.children[0].receiveShadow = true;
		// Assuming you already have your global scene
		this.field.add(terrain);

		var base  = new THREE.Mesh(
			new THREE.BoxGeometry(100,1,100),
			new THREE.MeshLambertMaterial(
				{color: 0x80f080,
					shading: THREE.FlatShading
				}));
		base.receiveShadow = true;
		this.field.add(base);
	
		this.scene.add(this.field);
/*

                                                                                                                                                                                                                                                                          
		var base  = new THREE.Mesh(
			new THREE.BoxGeometry(100,10,100),
			new THREE.MeshLambertMaterial(
				{color: 0x80f080,
					shading: THREE.FlatShading
				}));
		this.field.receiveShadow = true;
		*/
//		this.scene.add(this.field);


		console.log(this.camera.position);
		this.camera.lookAt(this.field.position);


		// init player
		this.player1 = new Player("P1");//.init();
		this.player1.init(new THREE.Vector3(-30,30,-30), 0xff0000);
		this.scene.add(this.player1.mesh);

		this.scene.add(this.player1.playerText);

		this.player2 = new Player("P2");//.init();
		this.player2.init(new THREE.Vector3(30,30,30), 0x0000ff);
		this.scene.add(this.player2.mesh);

		this.scene.add(this.player2.playerText);


	
		//this.updateTimer();
		//this.updatePoints();
		this.createMenu();
		this.animate();
		// @todo onresize handling
	},

	updateTimer: function() {
		var actualTime = new Date();
		
		var difference = (3 * 30 )- Math.floor((actualTime - this.startTime) / 1000);

		var timerString = Math.floor(difference / 60) + ":" + Math.floor((difference % 60) )+ " min";


		var txElem = document.getElementById('timerText');
		txElem.innerText = timerString;

		if (difference <= 0) {
			this.stopGame();
		}

		if (this.gameState == 1) {
			window.setTimeout(ld33.updateTimer.bind(this), 1000);	
		}
	
	},

	updatePoints: function() {

		var txElem = document.getElementById('pointsText');
		txElem.innerText = "P1 " + this.pointsP1 + ":" + this.pointsP2 + " P2";

	},

	checkMenuInput: function() {
		var pads = navigator.getGamepads();
		if (pads[0]) {

			var pad = pads[0];
			
			for (var i=0; i< pad.buttons.length;i++) {
				
				if (pad.buttons[i].pressed) {
					this.gameState = 1;
					this.startGame();
					return;
				}
			}
		}
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
			this.pointsP2++;
			this.updatePoints();
			this.player1.mesh.position.set(-30,30,-30);
		}

		if (this.player2.mesh.position.y < -30) {
			console.log("player2 lost");
			this.pointsP1++;
			this.updatePoints();
			this.player2.mesh.position.set(30,30,30);
		}


	},

	createMenu: function(newText) {

		var text = newText || "HanniBall";
		this.menuLine = new THREE.Mesh(
				new THREE.TextGeometry(text,
						{
							size: 13,
							height: 2,
							font: 'LobsterLove',
							weight: 'normal',
							style: 'normal'
						}
					),
				new THREE.MeshLambertMaterial({color: 0x8800ff})
			);

		this.menuLine.position.set(35,10,-10);
		this.menuLine.rotation.y = Math.PI;
		this.menuLine.rotation.x = Math.PI/2;
		this.menuLine.castShadow = true;
		this.scene.add(this.menuLine);
		//this.menuLine.lookAt(this.camera.position);


	
	}, 

	startGame: function() {

		console.log("start game");
		this.scene.remove(this.menuLine);
		var infoElem = document.getElementById('infoText');
		infoText.style.display = 'none';		
		this.startTime = new Date();
		this.pointsP1 = 0;
		this.pointsP2 = 0;
		this.updateTimer();
		this.updatePoints();
		this.player1.mesh.position.set(-30,30,-30);
		this.player2.mesh.position.set(30,30,30);
	},

	stopGame: function() {

		this.gameState = 0;

		this.createMenu(this.pointsP1 > this.pointsP2 ? "P1 WINS!" : (this.pointsP1 == this.pointsP2)? "DRAW!" : "P2 WINS!");
		var infoElem = document.getElementById('infoText');
		infoText.style.display = 'block';		


	},

	render: function() {

		if (this.gameState == 0) {
			// menu
			this.checkMenuInput();




		} else if (this.gameState = 1) {

			// running
			this.checkInput();
			this.checkWinOrLoose();


		} else {

			// something else
		}

		this.player1.updatePosition(this.field, this.player2);
		this.player2.updatePosition(this.field, this.player1);
		this.player1.playerText.lookAt(this.camera.position);
		this.player2.playerText.lookAt(this.camera.position);


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