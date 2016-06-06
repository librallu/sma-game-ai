function get_neighbors(i) {
  var result = [];
  for ( var j = 0 ; j < world.links.length ; j++ ) {
    if ( world.links[j][0] == i ) {
      result.push(world.links[j][1]);
    } else if ( world.links[j][1] == i ) {
      result.push(world.links[j][0]);
    }
  }
  return result;
}


function get_army_result(i) {

  // we want the worst defense in our neighbors
  mini = -1;
  var current_city = world.cities[i];
  var neighbors = get_neighbors(i);
  var att_i = current_city.soldiers;
  for ( var j = 0 ; j < neighbors.length ; j++ ) {
    if ( world.cities[j].player != current_city.player) {
      var def_j = world.cities[j].soldiers + world.cities[j].defense;
      if ( mini < 0 || def_j < world.cities[mini].soldiers + world.cities[mini].defense ) {
        mini = j;
      }
    }
  }
  if ( mini < 0 ) return undefined;
  return world.cities[mini].soldiers + world.cities[mini].defense - current_city.soldiers;
}


function get_defense_result(i) {
  var nb_hostile_neigh = 0;
  var sum_hostile_soldiers = 0;
  var current_city = world.cities[i];
  var neighbors = get_neighbors(i);
  for ( var j = 0 ; j < neighbors.length ; j++ ) {
    var neigh = neighbors[j];
    if ( world.cities[neigh].player != current_city.player ) {
      nb_hostile_neigh++;
      sum_hostile_soldiers += world.cities[neigh].soldiers;
    }
  }
  if ( nb_hostile_neigh == 0 ) return undefined;
  return sum_hostile_soldiers - current_city.soldiers+current_city.defense;
}

function get_mine_result(i) {
  return Math.floor(world.cities[i].gold / world.rules.mines);
}

function get_soutien_result(i) {
  return undefined;
}


function call_ia(i) {
  current_city = world.cities[i];

  managers_result = {
    'army': get_army_result(i),
    'defense': get_defense_result(i),
    'mine': get_mine_result(i),
    'soutien': get_soutien_result(i)
  }

  console.log(managers_result);

  // if army is less needing soldiers


  return {
    'prod_soldiers': 1,
    'prod_mines': 1,
    'prod_def': 1,
    'send_to': 0
  }
}
