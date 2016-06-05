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

function actionOn(i) {
  tooltipContent(i);
}

function checkActionUsed(i) {
  return world.cities[i].available;
}

function actionUsed(i) {
  world.cities[i].available = false;
}

// returns true if the game has ended, false elsewhere
function checkEnd() {
  var acc = world.cities[0].player;
  for ( var i = 1 ; i < world.cities.length ; i++ ) {
    if ( world.cities[i].player != acc ) return false;
  }
  return true;
}

// called when the game ends
function atEnd() {
  if ( world.cities[0].player == 'green' ) {
    console.log('You Win !');
    popWin();
  } else {
    console.log("You Loose !");
  }
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
      else { // attack ennemy
        // soldiers vs soldiers
        var lastSoldiersFirst = world.cities[src].soldiers - world.cities[dest].soldiers
        world.cities[dest].soldiers = Math.max(world.cities[dest].soldiers - world.cities[src].soldiers, 0)
        world.cities[src].soldiers = Math.max(lastSoldiersFirst, 0);

        // soldiers vs defense
        var lastSoldiersSecond = world.cities[src].soldiers - world.cities[dest].defense;
        world.cities[dest].defense = Math.max(world.cities[dest].defense - world.cities[src].soldiers, 0);
        world.cities[src].soldiers = Math.max(lastSoldiersSecond, 0);

        if ( world.cities[dest].defense == 0 && world.cities[dest].soldiers == 0) { // check if the city is taken
          world.cities[dest].player = rules_data.current_player;
          world.cities[dest].soldiers = world.cities[src].soldiers;
          world.cities[src].soldiers = 0;
          world.cities[dest].available = false;
          if ( checkEnd() ) { atEnd(); }
        }
      }
    } else {
      console.log('Invalid move: can\'t move enemies soldiers.');
    }
  } else {
    console.log('This city has already played this turn');
  }
  actionOn(src);
  actionOn(dest);
}

function ia_play() {
  for ( var i = 0 ; i < world.cities.length ; i++ ) {
    addMines(i);
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
    if (world.cities[i].player == rules_data.current_player) {
      world.cities[i].available = true;
      world.cities[i].gold += world.cities[i].mines;
    }
    tooltipContent(i);
    remove_outline(i);
  }

  if ( rules_data.current_player == 'red' ) {
    ia_play();
    nextTurn();
  }

}

function addSomething(i, action) {
  if ( rules_data.current_player == world.cities[i].player ) {
    action(i);
  }
  actionOn(i);
}

function addGold(i) {
  addSomething(i, function() {
    world.cities[i].gold += world.cities[i].mines;
  });
}

function addSoldiers(i) {
  addSomething(i, function() {
    world.cities[i].soldiers += 1;
    world.cities[i].gold -= world.rules.soldiers;
  });
}

function addDefense(i) {
  addSomething(i, function() {
    world.cities[i].defense += 1;
    world.cities[i].gold -= world.rules.defense;
  });
}

function addMines(i) {
  addSomething(i, function() {
    world.cities[i].mines += 1;
    world.cities[i].gold -= world.rules.mines;
  });
}
