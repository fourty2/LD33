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
		this.renderer.setClearColor(0x402020, 1);


		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(FOV, WIDTH/ HEIGHT, NEAR, FAR);
		this.camera.position.set(-400,50,0);
		this.scene.add(this.camera);

		// 
		var light = new THREE.SpotLight(0xffa0a0, 1.5);
		light.position.set(140,140,-200);
		light.target.position.set(0, 0, 0);
		light.castShadow = true;

		light.shadowCameraNear = 0.1;
		light.shadowCameraFar = 400;

		light.shadowCameraLeft = -75;
		light.shadowCameraRight = 75;
		light.shadowCameraTop = 75;
		light.shadowCameraBottom = -75;
		//light.shadowCameraVisible = true;
		  
		this.scene.add(light);

	var light2 = new THREE.SpotLight(0xff0000, 1.0);
		light2.position.set(-140,140,200);
		light2.target.position.set(0, 0, 0);
	/*	light2.castShadow = true;

		light2.shadowCameraNear = 0.1;
		light2.shadowCameraFar = 400;

		light2.shadowCameraLeft = -75;
		light2.shadowCameraRight = 75;
		light2.shadowCameraTop = 75;
		light2.shadowCameraBottom = -75;
		//light.shadowCameraVisible = true;
		  */
		this.scene.add(light2);


		// starfield
		var geometry  = new THREE.SphereGeometry(500, 32, 32)
		// create the material, using a texture of startfield
		var material  = new THREE.MeshBasicMaterial()
		material.map   = THREE.ImageUtils.loadTexture('images/starfield.jpg')
		material.side  = THREE.BackSide
		// create the mesh based on geometry and material
		var mesh  = new THREE.Mesh(geometry, material)
		this.scene.add(mesh);


		var xS = 63, yS = 63;

		this.field = new THREE.Object3D();

		var materials = [
				new THREE.MeshBasicMaterial( { visible: false } ),
				new THREE.MeshLambertMaterial({color: 0x40ff40, shading: THREE.FlatShading, side:THREE.DoubleSide})
		];

		var fmat = new THREE.MeshFaceMaterial(materials);


		var terrain = THREE.Terrain({
		    easing: THREE.Terrain.Linear,
		    frequency: 2.5,
		    heightmap: THREE.Terrain.HillIsland,
		    material: fmat,
		    maxHeight: 15,
		    minHeight: 0,
		    steps: 1,
		    useBufferGeometry: false,
		    xSegments: xS,
		    xSize: 200,
		    ySegments: yS,
		    ySize: 200,
		});
		terrain.children[0].receiveShadow = true;


		terrain.children[0].materials = materials;

		terrain.children[0].geometry.materials = materials;



		// Assuming you already have your global scene
		this.field.add(terrain);

		console.log(terrain);

		var rmaterials = [
				new THREE.MeshBasicMaterial( { visible: false } ),
				new THREE.MeshLambertMaterial({color: 0x904000, shading: THREE.FlatShading, side:THREE.DoubleSide}),
				new THREE.MeshLambertMaterial({color: 0x80f080, shading: THREE.FlatShading, side:THREE.DoubleSide})
		];

		var rfmat = new THREE.MeshFaceMaterial(rmaterials);

 		//xS = 163, yS = 163;
		var rock = THREE.Terrain({
		    easing: THREE.Terrain.Linear,
		    frequency: 2.5,
		    heightmap: THREE.Terrain.HillIsland,
		    material: rfmat,
		    maxHeight: 200,
		    minHeight: 0.1,
		    steps: 1,
		    useBufferGeometry: false,
		    xSegments: xS,
		    xSize: 195,
		    ySegments: yS,
		    ySize: 195,
		});
		rock.children[0].receiveShadow = true;

//		63 * 63 faces .. 		
		
		for ( var i = 0, l = terrain.children[0].geometry.faces.length; i < l; i ++ ) {

					var face = terrain.children[0].geometry.faces[ i ];
					//var rockface = rock.children[0].geometry.faces[ i ]

					var row = Math.floor(i / 126);
					var desiredRow = 62 - row;
					var desiredFace = Math.floor(i % 126);

					var rockface = rock.children[0].geometry.faces[ desiredRow * 126 + (desiredFace)];


					if ((terrain.children[0].geometry.vertices[face.a].z  <= 0 ||
						terrain.children[0].geometry.vertices[face.b].z  <= 0 ||
						terrain.children[0].geometry.vertices[face.c].z  <= 0 )
						&&
						(
						rock.children[0].geometry.vertices[rockface.a].z < 10 ||
						rock.children[0].geometry.vertices[rockface.b].z < 10 ||
						rock.children[0].geometry.vertices[rockface.c].z < 10

						)
						) {

						if (rock.children[0].geometry.vertices[rockface.a].z <1 || 
						rock.children[0].geometry.vertices[rockface.b].z < 1 ||
						rock.children[0].geometry.vertices[rockface.c].z < 1
							) {
							
							face.materialIndex = 0;

							rockface.materialIndex = 0;	
						} else {
							rockface.materialIndex = 2;
							face.materialIndex = 1;
						}



						
					} else {
						face.materialIndex = 1;
						rockface.materialIndex = 1;
					}

		}


		rock.rotation.x = Math.PI / 2;
		this.field.add(rock);

	
		this.scene.add(this.field);

		console.log(this.camera.position);
		this.camera.lookAt(this.field.position);


		// init player
		this.player1 = new Player("P1");//.init();
		this.player1.init(new THREE.Vector3(-30,30,-30), 0xff8080);
		this.scene.add(this.player1.mesh);

		this.scene.add(this.player1.playerText);

		this.player2 = new Player("P2");//.init();
		this.player2.init(new THREE.Vector3(30,30,30), 0xffff00);
		this.scene.add(this.player2.mesh);

		this.scene.add(this.player2.playerText);


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
			this.player1.accX = this.player1.accY = this.player1.accZ = 0;
			this.player1.mesh.position.set(-30,30,-30);
		}

		if (this.player2.mesh.position.y < -30) {
			console.log("player2 lost");
			this.pointsP1++;
			this.updatePoints();
			this.player2.accX = this.player2.accY = this.player2.accZ = 0;
			this.player2.mesh.position.set(30,30,30);
		}


	},

	createMenu: function(newText) {

		var text = newText || "HanniBall";
		this.menuLine = new THREE.Mesh(
				new THREE.TextGeometry(text,
						{
							size: 30,
							height: 2,
							font: 'LobsterLove',
							weight: 'normal',
							style: 'normal'
						}
					),
				new THREE.MeshLambertMaterial({color: 0x8800ff})
			);

		this.menuLine.position.set(85,40,00);
		this.menuLine.rotation.y = Math.PI;
	//	this.menuLine.rotation.x = Math.PI/2;
		this.menuLine.castShadow = true;
		this.scene.add(this.menuLine);
		//this.menuLine.lookAt(this.camera.position);


	
	}, 

	startGame: function() {

		console.log("start game");
		var introMusic = document.getElementById('intro');
		introMusic.volume = 0.3;

		this.scene.remove(this.menuLine);
		var infoElem = document.getElementById('infoText');
		infoText.style.display = 'none';		
		this.startTime = new Date();
		this.pointsP1 = 0;
		this.pointsP2 = 0;
		this.updateTimer();
		this.updatePoints();
		this.camera.lookAt(this.field.position); 
 		TWEEN.removeAll();
		new TWEEN.Tween( this.camera.position ).to(
			{
		        x: 0,
		        y: 150,
		        z: -200
		    },
		    600 )
    
    		.onUpdate(function(o) {
    			this.camera.lookAt(this.field.position); 
    		}.bind(this))
    		.start();
    	//this.camera.position.set(0,150,-200);
		
		this.player1.mesh.position.set(-30,30,-30);
		this.player2.mesh.position.set(30,30,30);
	},

	stopGame: function() {

		this.gameState = 0;
		var introMusic = document.getElementById('intro');
		introMusic.volume = 0.8;
		this.createMenu(this.pointsP1 > this.pointsP2 ? "P1 WINS!" : (this.pointsP1 == this.pointsP2)? "DRAW!" : "P2 WINS!");
		var infoElem = document.getElementById('infoText');
		infoText.style.display = 'block';		
		
			new TWEEN.Tween( this.camera.position ).to(
			{
		        x: -400,
		        y: 50,
		        z: 0
		    },
		    600 )
    
    		.onUpdate(function(o) {
    			this.camera.lookAt(this.field.position); 
    		}.bind(this))
    		.start();
		

	},

	render: function() {

		if (this.gameState == 0) {
			// menu
			this.checkMenuInput();

			var theta = -0.005;

			var x = this.camera.position.x;
			var z = this.camera.position.z;

			this.camera.position.x = x * Math.cos(theta) + z * Math.sin(theta);
			this.camera.position.z = z * Math.cos(theta) - x * Math.sin(theta);
			this.camera.lookAt(this.field.position); 

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
		//
	},

	animate: function() {
		requestAnimationFrame(ld33.animate);
		TWEEN.update();
		ld33.render()
	},


	// @todo later:
	onResize: function() {

	}
};


ld33.init();