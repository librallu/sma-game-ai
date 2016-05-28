
/* The main loop function of the game
  Update the position of the elements on the scene
  Apply control events
  */
function main_loop()
{
  updateClouds();
  updateTooltips();
  renderer.render(scene, camera);
  controls.update(clock.getDelta());
  requestAnimationFrame(main_loop);
}

// Move the cloud's position
function updateClouds()
{
  for ( var i = 0 ; i < world.clouds.length ; i++ )
  {
    if ( world.clouds[i].ok )
    {
      world.clouds[i].mesh.position.x += .1*world.clouds[i].direction;
      if ( world.clouds[i].mesh.position.x > 500 )
        world.clouds[i].direction = -1;
      if ( world.clouds[i].mesh.position.x < -500 )
        world.clouds[i].direction = 1;
    }
  }
}

/* Update the tooltips from each castle
  Change their position
  Update their content
  */
function updateTooltips()
{
  for ( var i = 0 ; i < world.cities.length ; i++ )
  {
    if ( world.cities[i].ok )
    {
      var v = projectionObj(world.cities[i].mesh);
      world.cities[i].tooltip.style.left = (v.x+50)+'px';
      world.cities[i].tooltip.style.top = (v.y-130)+'px';
      tooltipContent(i);
    }
  }
}

// regenerates content for a city 'i' tooltip.
function tooltipContent(i) {
  var tooltip = world.cities[i].tooltip;
  var text = '<ul>';
  text += '<li><img src="gold.png"/><span class="value">'+world.cities[i].gold+'</span></li>';
  text += '<li><img src="sword.png"/><span class="value">'+world.cities[i].soldiers+'</span></li>';
  text += '<li><img src="shield.png"/><span class="value">'+world.cities[i].defense+'</span></li>';
  text += '<li><img src="showel.png"/><span class="value">'+world.cities[i].mines+'</span></li>';
  text += '</ul>';
  tooltip.innerHTML = text;
}

// change color of outline of city i
// ex color = 0x00ff00 (green)
function change_outline(color, i) {
  if ( world.cities[i].ok ) {
    world.cities[i].outline.material.color.setHex(color);
  }
}

function remove_outline(i) {
  if ( world.cities[i].ok ) {
    world.cities[i].outline.material.transparent = true;
    world.cities[i].outline.material.opacity = 0.;
  }
}
