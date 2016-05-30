
// Load the different elements of the game
function loadAssets()
{
  loadSky();
  loadGround();
  loadCities();
  loadClouds();
}

// Create the sky
function loadSky()
{
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

// Create the ground of the game
// Create the different isles
function loadGround()
{
  var loader = new THREE.JSONLoader();
  loader.load("./mainisle.json", function(geometry,materials){
      var mesh = new THREE.SkinnedMesh(
        geometry,
        new THREE.MeshFaceMaterial(materials)
      );
      var s = 75;
      mesh.position.y -= 71;
      mesh.position.z = -60;
      mesh.scale.set(s+90,s,s-5);
      scene.add(mesh);
    });

    loader.load("./isle2.json", function(geometry,materials){

      var mesh2 = new THREE.SkinnedMesh(geometry,
        new THREE.MeshFaceMaterial(materials)
      );
      mesh2.position.y = -20;
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

// Load the different cities of the game
// Place the cities in the game field
function loadCities()
{
  var worldElt = document.getElementById('world');
  var loader = new THREE.JSONLoader();
  loader.load("./city.json", function(geometry,materials){
    geometry.translate(-4.2,0,-1.9);
    for ( var i = 0 ; i < world.cities.length ; i++ )
    {
      world.cities[i].mesh = new THREE.SkinnedMesh(
        geometry,
        new THREE.MeshFaceMaterial(materials)
      );
      var s = 10;
      world.cities[i].mesh.scale.set(s,s,s);
      console.log(world.cities[i].mesh);
      world.cities[i].ok = true;
      world.cities[i].mesh.cityId = i;
      world.cities[i].mesh.position.x = world.cities[i].position.x;
      world.cities[i].mesh.position.z = world.cities[i].position.z;
      world.cities[i].mesh.position.y = 5;
      world.cities[i].mesh.rotation.y = world.cities[i].rotation;
      scene.add(world.cities[i].mesh);

      // add halo
      var outlineMat = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
      world.cities[i].outline = new THREE.Mesh( geometry, outlineMat );
      world.cities[i].outline.scale.set(s*1.05,s*1.05,s*1.05);

      world.cities[i].outline.position.x = world.cities[i].mesh.position.x;
      world.cities[i].outline.position.z = world.cities[i].mesh.position.z;
      world.cities[i].outline.position.y = world.cities[i].mesh.position.y;
      world.cities[i].outline.rotation.y = world.cities[i].mesh.rotation.y;
      world.cities[i].outline.material.transparent = true;
      world.cities[i].outline.material.opacity = 0.;
      scene.add(world.cities[i].outline);

      // create a tooltip
      var tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      document.body.insertBefore(tooltip, worldElt);
      world.cities[i].tooltip = tooltip;
      tooltipContent(i);
    }

    // draw lines between cities
    for ( var j = 0 ; j < world.links.length ; j++ )
    {
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
      var line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: 0xaaaaaa,
          linewidth: 7,
          fog: true
        })
      );
      world.links[j].mesh = line;
      scene.add(line);
      change_line(0xffffff, j);
    }
  });
}

// Create the cloud
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

// Create the lights of the game
function createLights()
{
  var hemisphereLight = new THREE.HemisphereLight(0xa29C78, 0x000000, .6);
  scene.add(hemisphereLight);
  scene.fog = new THREE.FogExp2(0x9db3b5, 0.003);

  var directional = new THREE.DirectionalLight(0xa29Ca8, .5);
  var dir_size = 100
  directional.position.set(-200, 125, -100);
  scene.add(directional);

  var loader = new THREE.TextureLoader();
  loader.load('./lens.png', function(texture) {
    var color = new THREE.Color(0xffaacc);
    var flare = new THREE.LensFlare(texture, 350, 0.0, THREE.AdditiveBlending, color);
    flare.position.set(-475, 0, -350);

    scene.add(flare);
  });
}
