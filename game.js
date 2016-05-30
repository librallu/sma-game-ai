
window.addEventListener('load', init, false);

var camera, scene, renderer;
var WIDTH, HEIGHT;

var controls, clock;

function setupThreeJS()
{
  clock = new THREE.Clock();
  controls = new KeyboardControls(camera);
  controls.movementSpeed = 200;
  controls.lookSpeed = 0.1;
}

var popup = document.getElementById('popup');
var popupButton = document.getElementById('popup-close');

function popTuto() {
  window.onclick = function(event) {
    if ( event.target == popup ) {
      popup.style.display = "none";
    }
  }
  popup.style.display = "block";
  popupButton.addEventListener('click', function() {
    popup.style.display = "none";
  });
}

/* Initial function
  Call the load main function
  Create the lights
  Place the camera
  Call the game loop
  */
function init()
{

  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  // SET SCENE, RENDERER AND CAMERA
  scene = new THREE.Scene();

  // SET context
  world.context.elt = document.getElementById('context');

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

  // attribute for the city selected
  world.selected = undefined;

  // CALL KEYBOARD EVENT LOADING
  setupThreeJS();
  setupClick();

  initRules();

  popTuto();

  main_loop();
}

// Change a 3d vector into a 2d vector
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
