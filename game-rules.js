// used to store data about the rules

rules_data = {
  current_player: 'red',
  current_turn: 0,
  next_turn_button: document.getElementById('context')
}

// init rules for the game (should be called at the beginning of the game)
function initRules() {
  nextTurn();
  rules_data.next_turn_button.addEventListener('click', reactUserClick, false);
}

// called when the user click on the button
function reactUserClick() {
  nextTurn();
  console.log('click');
}


function checkActionUsed(i) {
  return world.cities[i].available;
}

function actionUsed(i) {
  world.cities[i].available = false;
}


function SendSoldiers(src, dest) {
  if ( checkActionUsed(src) ) {
    if ( rules_data.current_player == world.cities[src].player ) {
      console.log("sending troops from " + src + " to " + dest);
      actionUsed(src);
      if (world.cities[src].player == world.cities[dest].player) { // same player
        world.cities[dest].soldiers += world.cities[src].soldiers;
        world.cities[src].soldiers = 0;
      }
      else {
        // soldiers vs soldiers
        var lastSoldiersFirst = world.cities[src].soldiers - world.cities[dest].soldiers
        world.cities[dest].soldiers = Math.max(world.cities[dest].soldiers - world.cities[src].soldiers, 0)
        world.cities[src].soldiers = Math.max(lastSoldiersFirst, 0);

        // soldiers vs defense
        var lastSoldiersSecond = world.cities[src].soldiers - world.cities[dest].defense;
        world.cities[dest].defense = Math.max(world.cities[dest].defense - world.cities[src].soldiers, 0);
        world.cities[src].soldiers = Math.max(lastSoldiersSecond, 0);
      }
    } else {
      console.log('Invalid move: can\'t move enemies soldiers.');
    }
  } else {
    console.log('This city has already played this turn');
  }
}

// end the current turn and start next
function nextTurn() {
  // change current player
  if ( rules_data.current_player == 'green' ) {
    rules_data.current_player = 'red';
  } else {
    rules_data.current_player = 'green';
    rules_data.current_turn += 1;
  }

  // make available cities
  for ( var i = 0 ; i < world.cities.length ; i++ ) {
    world.cities[i].available = true;
    remove_outline(i);
  }
}
