
window.addEventListener('load', init, false);

var camera, scene, renderer;
var WIDTH, HEIGHT;

var controls, clock;

function setupThreeJS() {
  clock = new THREE.Clock();
  controls = new KeyboardControls(camera);
  controls.movementSpeed = 200;
  controls.lookSpeed = 0.1;
}

function setupClick() {
  var projector = new THREE.Projector();

  renderer.domElement.addEventListener('mousedown', function(event) {
    var top = 0;
    var left = 0;
    console.log(top);
    var vector = new THREE.Vector3(
      (event.pageX - left) / this.width * 2 - 1,
      -(event.pageY - top) / this.height * 2 + 1,
      0
    );
    vector.unproject(camera);
    var raycaster = new THREE.Raycaster(
      camera.position,
      vector.sub(camera.position).normalize()
    );

    var OBJECTS = [];
    for ( var i = 0 ; i < world.cities.length ; i++ ) {
      if ( world.cities[i].ok )
        OBJECTS.push(world.cities[i].mesh);
    }

    var intersects = raycaster.intersectObjects(OBJECTS);
    if ( intersects.length ) {
      intersects[0].object.position.x += 10;
    }
  }, false);
}

var world = {
  cities: [
    {
      position: {x: 30, z: 0},
      rotation: 0,
      ok: false,
      player: 'red',
      soldiers: 4,
      mines: 2,
      resources: 10,
      defense: 2
    },
    {
      position: {x: -100, z: -40},
      rotation: 0,
      ok: false,
      player: 'blue',
      soldiers: 3,
      mines: 2,
      resources: 5,
      defense: 5
    }
  ],

  links: [
    [0, 1]
  ],

  clouds: [
    {
      position: {x: -500, y: 30, z: 100},
      rotation: 0,
      ok: false,
      scale: 20,
      direction: 1
    }
  ],

  ground: {
    ok: false
  },

  lights: [
  ],

  context: [
  ]
};


function init() {

  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  // SET SCENE, RENDERER AND CAMERA
  scene = new THREE.Scene();

  // SET context
  world.context.elt = document.getElementById('context');
  world.context.elt.style.height = HEIGHT+'px';
  world.context.elt.style.display = 'none';

  renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

  // LOAD ASSETS
  loadAssets();

  // LOAD LIGHT
  createLights();
  renderer.setSize(WIDTH, HEIGHT-10);
  // renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, 1, 1000);
  camera.position.z = 110;
  camera.position.y = 120;
  camera.rotation.x = -1;



  // CALL THE RENDERER AND MAKE MAIN LOOP
  renderer.render(scene, camera);


  // CALL KEYBOARD EVENT LOADING
  setupThreeJS();
  setupClick();

  main_loop();
}

function loadAssets() {
  loadSky();
  loadGround();
  loadCities();
  loadClouds();
}

function loadSky() {
  var skyBoxMaterial = new THREE.MeshBasicMaterial({
    color: 0xc1dafa,
    side: THREE.BackSide
  });

  var skybox = new THREE.Mesh(
    new THREE.CubeGeometry(1000, 1000, 1000),
    skyBoxMaterial
  );
  scene.add(skybox);
}

function loadGround() {
  // var geom = new THREE.CubeGeometry(250, 5, 150);
  // var mat = new THREE.MeshLambertMaterial({color: '#77aa66'});
  // world.ground.mesh = new THREE.Mesh(geom, mat);
  // // world.ground.mesh.receiveShadow = true;
  // // world.ground.mesh.castShadow = true;
  // scene.add(world.ground.mesh);
  // var mat = new THREE.MeshLambertMaterial({color: '#aa8855'});
  // world.ground.mesh2 = new THREE.Mesh(geom, mat);
  // world.ground.mesh2.position.y -= 5;
  // scene.add(world.ground.mesh2);
  // world.ground.ok = true;
  var loader = new THREE.JSONLoader();
  loader.load("./isle2.json", function(geometry,materials){
    var mesh = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    var s = 120;
    mesh.position.y -= 114;
    mesh.position.z = -40;
    mesh.scale.set(s+90,s,s-5);
    scene.add(mesh);

    var mesh2 = new THREE.SkinnedMesh(geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    mesh2.position.y = -90;
    mesh2.position.z = -200;
    mesh2.position.x = -500;
    mesh2.scale.set(30,30,30);

    scene.add(mesh2);

    var mesh3 = new THREE.SkinnedMesh(geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    mesh3.position.y = 10;
    mesh3.position.z = -200;
    mesh3.position.x = 400;
    mesh3.rotation.y = Math.PI/2;
    mesh3.scale.set(10,10,10);

    scene.add(mesh3);
  });

}

function loadClouds() {
  var loader = new THREE.JSONLoader();
  loader.load("./cloud.json", function(geometry,materials){
    for ( var i = 0 ; i < world.clouds.length ; i++ ) {
      world.clouds[i].mesh = new THREE.SkinnedMesh(
        geometry,
        new THREE.MeshFaceMaterial(materials)
      );
      world.clouds[i].ok = true;
      world.clouds[i].mesh.position.x = world.clouds[i].position.x;
      world.clouds[i].mesh.position.z = world.clouds[i].position.z;
      world.clouds[i].mesh.position.y = world.clouds[i].position.y;
      world.clouds[i].mesh.rotation.y = world.clouds[i].rotation;
      var s = world.clouds[i].scale;
      world.clouds[i].mesh.scale.set(s,s,s);
      scene.add(world.clouds[i].mesh);
    }
  });
}

function loadCities() {
  var worldElt = document.getElementById('world');
  var loader = new THREE.JSONLoader();
  loader.load("./city.json", function(geometry,materials){
    geometry.translate(-4.2,0,-1.9);
    for ( var i = 0 ; i < world.cities.length ; i++ ) {
      world.cities[i].mesh = new THREE.SkinnedMesh(
        geometry,
        new THREE.MeshFaceMaterial(materials)
      );
      var s = 10;
      world.cities[i].mesh.scale.set(s,s,s);
      console.log(world.cities[i].mesh);
      world.cities[i].ok = true;
      world.cities[i].mesh.position.x = world.cities[i].position.x;
      world.cities[i].mesh.position.z = world.cities[i].position.z;
      world.cities[i].mesh.position.y = 5;
      world.cities[i].mesh.rotation.y = world.cities[i].rotation;
      // world.cities[i].mesh.receiveShadow = true;
      // world.cities[i].mesh.castShadow = true;
      scene.add(world.cities[i].mesh);

      // create a tooltip
      var tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      document.body.insertBefore(tooltip, worldElt);
      world.cities[i].tooltip = tooltip;
    }

    // draw lines between cities
    var lineMaterial = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
      linewidth: 7,
      fog: true
    });
    for ( var j = 0 ; j < world.links.length ; j++ ) {
      var geometry = new THREE.Geometry();
      var a = world.links[j][0];
      var b = world.links[j][1];
      var pa = new THREE.Vector3(
        world.cities[a].position.x,
        3,
        world.cities[a].position.z
      );
      var pb = new THREE.Vector3(
        world.cities[b].position.x,
        3,
        world.cities[b].position.z
      );
      console.log(pa);
      geometry.vertices.push(pa);
      geometry.vertices.push(pb);
      var line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
    }
  });

}

function createLights() {
  var hemisphereLight = new THREE.HemisphereLight(0xa29C78, 0x000000, .6);
  scene.add(hemisphereLight);
  scene.fog = new THREE.FogExp2(0x9db3b5, 0.003);

  var directional = new THREE.DirectionalLight(0xa29Ca8, .5);
  var dir_size = 100
  directional.position.set(-200, 125, -100);
  // directional.castShadow = true;
  // directional.shadow.mapSize.width = 2048;
  // directional.shadow.mapSize.height = 2048;
  // directional.shadow.camera.far = 500;
  // directional.shadow.camera.left = -dir_size;
  // directional.shadow.camera.right = dir_size;
  // directional.shadow.camera.top = dir_size;
  // directional.shadow.camera.bottom = -dir_size;
  scene.add(directional);

  var loader = new THREE.TextureLoader();
  loader.load('./lens.png', function(texture) {
    var color = new THREE.Color(0xffaacc);
    var flare = new THREE.LensFlare(texture, 350, 0.0, THREE.AdditiveBlending, color);
    flare.position.set(-475, 0, -350);
    // flare.add(flare,60, 0.6, THREE.AdditiveBlending);
    // flare.add(flare,70, 0.7, THREE.AdditiveBlending);
    // flare.add(flare, 120, 0.9, THREE.AdditiveBlending);
    // flare.add(flare,70, 1.0, THREE.AdditiveBlending);

    scene.add(flare);
  });
}

function updateClouds() {
  for ( var i = 0 ; i < world.clouds.length ; i++ ) {
    if ( world.clouds[i].ok ) {
      world.clouds[i].mesh.position.x += .1*world.clouds[i].direction;
      if ( world.clouds[i].mesh.position.x > 500 ) world.clouds[i].direction = -1;
      if ( world.clouds[i].mesh.position.x < -500 ) world.clouds[i].direction = 1;
    }
  }
}

function projectionObj(obj) {
  var vector = new THREE.Vector3();
  vector.x = obj.position.x;
  vector.y = obj.position.y;
  vector.z = obj.position.z;

  vector.project(camera);

  // adapt size for screen coordinates
  var w = WIDTH/2;
  var h = HEIGHT/2;

  vector.x = (vector.x * w) + w;
  vector.y = -(vector.y * h) + h;

  return vector;
}

function updateTooltips() {
  // change position on screen
  for ( var i = 0 ; i < world.cities.length ; i++ ) {
    if ( world.cities[i].ok ) {
      var v = projectionObj(world.cities[i].mesh);
      world.cities[i].tooltip.style.left = (v.x+50)+'px';
      world.cities[i].tooltip.style.top = (v.y-130)+'px';
    }
  }
}

function main_loop() {

  updateClouds();
  updateTooltips();
  renderer.render(scene, camera);
  controls.update(clock.getDelta());
  requestAnimationFrame(main_loop);

}
