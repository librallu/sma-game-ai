
// Add different events for the game controls
function KeyboardControls(object, options)
{
  this.object = object;
  options = options || {};
  this.domElement = options.domElement || document;
  this.moveSpeed = options.moveSpeed || 1;
  this.zoomCounter = 0;
  this.domElement.addEventListener('keydown', this.onKeyDown.bind(this), false);
  this.domElement.addEventListener('keyup', this.onKeyUp.bind(this), false);
  this.domElement.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);
  this.domElement.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), false);
}

KeyboardControls.prototype = {
  update: function()
  {
    if ( this.moveForward && this.object.position.z > 0 )
      this.object.position.z -= this.moveSpeed;
    if ( this.moveBackward && this.object.position.z < 100 )
      this.object.position.z += this.moveSpeed;
    if ( this.moveLeft && this.object.position.x > -100 )
      this.object.position.x -= this.moveSpeed;
    if ( this.moveRight && this.object.position.x < 100 )
      this.object.position.x += this.moveSpeed;
  },

  onMouseWheel: function(event)
  {
    if ( event.wheelDeltaY )
    {
      var direction = -2*event.wheelDeltaY/Math.abs(event.wheelDeltaY);
    } else { // firefox
      var direction = 2*event.detail;
    }
    if ( this.zoomCounter > -100 || direction > 0 )
    {
      if ( this.zoomCounter <= 10 || direction < 0 )
      {
        this.zoomCounter += direction;
        this.object.translateZ(direction);
        this.object.rotation.x += -0.005*direction;
      }
    }
  },

  onKeyDown: function(event)
  {
    switch (event.keyCode)
    {
      case 38: /* up */
      case 87: /* W */
        this.moveForward = true;
        break;
      case 37:
      case 65: /*A*/
        this.moveLeft = true;
        break;
      case 40: /*down */
      case 83:
        this.moveBackward = true; break;
      case 39:
      case 68: /* right */
        this.moveRight = true; break;
    }
  },

  onKeyUp: function(event)
  {
    switch (event.keyCode)
    {
      case 38: /* up */
      case 87: /* W */
        this.moveForward = false;
        break;
      case 37:
      case 65: /*A*/
        this.moveLeft = false;
        break;
      case 40: /*down */
      case 83:
        this.moveBackward = false;
        break;
      case 39:
      case 68: /* right */
        this.moveRight = false;
        break;
    }
  }
}

// Mouse click event
function setupClick() {
  var projector = new THREE.Projector();

  renderer.domElement.addEventListener('mousedown', function(event) {
    var top = 0;
    var left = 0;
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
      selectCity(intersects[0].object.cityId);
    }
    else {
      deselectCity();
    }
  }, false);
}

// Select the city desired
function selectCity(cityId)
{
  if (world.selected == undefined ) { // if no selection we select the city
    deselectCity();
    world.selected = cityId;
    change_outline(0x00ffff, cityId);
    for ( var i = 0 ; i < world.links.length ; i++ ) {
      if (world.links[i][0] == cityId) {
        change_outline(0xffff00, world.links[i][1]);
        change_line(0xffff00, i);
      }
      if (world.links[i][1] == cityId) {
        change_outline(0xffff00, world.links[i][0]);
        change_line(0xffff00, i);
      }
    }
  }
  else {
    if (world.selected == cityId) { // if selection = city selected we deselect the city
        deselectCity();
    }
    else { // we check if city is neighboor of selection
      var tmp = false;
      for ( var i = 0 ; i < world.links.length ; i++ ) {
        if (world.links[i][0] == cityId && world.links[i][1] == world.selected) {
          tmp = true;
          SendSoldiers(world.selected, cityId);
        }
        if (world.links[i][1] == cityId && world.links[i][0] == world.selected) {
          tmp = true;
          SendSoldiers(world.selected, cityId);
        }
      }
      if (!tmp) { // if city is not neighboor of selection, we select the city
        world.selected = undefined;
        selectCity(cityId);
      }
    }
  }
}

// Deselect the city
function deselectCity()
{
  world.selected = undefined;
  for ( var i = 0 ; i < world.cities.length ; i++ ) {
    if ( world.cities[i].ok )
      remove_outline(i);
  }
  for ( var i = 0 ; i < world.links.length ; i++ ) {
      change_line(0xffffff, i);
    }
}
