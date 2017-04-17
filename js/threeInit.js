// Set up the scene, camera, and renderer as global variables.
var scene, camera, renderer;

var terrain = []; // array for terrain

document.addEventListener('DOMContentLoaded', function () {
	init();
 	animate();

 	$('#save-garden-button').click(function() {
 		controls.exportScene();
 	});
});

// Sets up the scene.
function init() {

	// Create the scene and set the scene size.
	scene = new THREE.Scene();
	var WIDTH = window.innerWidth,
	    HEIGHT = window.innerHeight;


	// Create a renderer and add it to the DOM.
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild(renderer.domElement);


	// Create a camera, zoom it out from the model a bit, and add it to the scene.
	var aspect = window.innerWidth / window.innerHeight
	var d = 7;
	camera = new THREE.OrthographicCamera(-d*aspect, d*aspect, d, -d, 0.1, 2000);
	//camera.position.set(0,6,0);

	camera.position.set( 20, 20, 20 );
	camera.lookAt( scene.position );
	scene.add(camera);

	// Create an event listener that resizes the renderer with the browser window.
	window.addEventListener('resize', function() {
		var WIDTH = window.innerWidth,
		HEIGHT = window.innerHeight;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	});

    // Set the background color of the scene.
    renderer.setClearColor(new THREE.Color(0.4, 0.4, 0.4, 1));

    scene.add( new THREE.AxisHelper( 5 ) );

    // grid
	var geometry = new THREE.PlaneBufferGeometry( 10, 10, 10, 10 );
	var material = new THREE.MeshBasicMaterial( { wireframe: true, opacity: 0.5, color: 'lightgrey', transparent: true } );
	var grid = new THREE.Mesh( geometry, material );
	grid.rotation.order = 'YXZ';
	grid.rotation.y = - Math.PI / 2;
	grid.rotation.x = - Math.PI / 2;
	scene.add( grid );

 
    // Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0xffffff);
    light.position.set(55,200,100);
    scene.add(light);

    // Create ambient light
    var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( ambientLight );

    createTerrain(3,3, terrain); // Creates the terrain
    
	// Add OrbitControls so that we can pan around with the mouse.
	//controls = new THREE.OrbitControls(camera, renderer.domElement);

	}	

// Renders the scene and updates the render as needed.
function animate() {
	// Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	requestAnimationFrame(animate);

	// Render the scene.
	renderer.render(scene, camera);
	//controls.update();
}

function createTerrain(cols, rows, terrain) {

	var loader = new THREE.JSONLoader();
	var textureLoader = new THREE.TextureLoader();
	var material = new THREE.MeshLambertMaterial({map: textureLoader.load('/assets/tile-grass/tile-grass.png')});
	
	loader.load(
		"/assets/tile-grass/tile-grass.json", 
		function(geometry){
			tileId = 1;
			var colsOffset = (cols / 2) - 0.5;
			var rowsOffset = (rows / 2) - 0.5;

			for (i = 0; i < rows; i++) {
				terrain[i] = [];
				for (j = 0; j < cols; j++) {
					terrain[i][j] = new THREE.Mesh(geometry, material);
					terrain[i][j].position.set(rowsOffset - i, 0, colsOffset - j);
					terrain[i][j].name = "terrainTile" + tileId;
					scene.add(terrain[i][j]);

					tileId++;
				}
			}
		}
	);
}

var controls = new function () {
    this.exportScene = function () {
        console.log('export scene');

    };
    this.clearScene = function () {
        scene = new THREE.Scene();
    };

};


