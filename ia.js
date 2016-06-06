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

var attack_target = undefined;

function get_army_result(i) {

  // we want the worst defense in our neighbors
  mini = -1;
  var current_city = world.cities[i];
  var neighbors = get_neighbors(i);
  var att_i = current_city.soldiers;
  for ( var j = 0 ; j < neighbors.length ; j++ ) {
    if ( world.cities[neighbors[j]].player != current_city.player) {
      var def_j = world.cities[neighbors[j]].soldiers + world.cities[neighbors[j]].defense;
      if ( mini < 0 || def_j < world.cities[mini].soldiers + world.cities[mini].defense ) {
        mini = neighbors[j];
      }
    }
  }
  if ( mini < 0 ) return undefined;
  attack_target = mini;
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
  return sum_hostile_soldiers - current_city.soldiers - current_city.defense;
}

function get_mine_result(i) {
  return Math.floor(world.cities[i].gold / world.rules.mines);
}

function get_soutien_result(i) {
  return undefined;
}


function call_ia(i) {
  current_city = world.cities[i];
  var current_city_id = i;

  managers_result = {
    'army': get_army_result(i),
    'defense': get_defense_result(i),
    'mine': get_mine_result(i),
    'soutien': get_soutien_result(i)
  }

  list_agents = ['army', 'defense', 'mine', 'soutien'];

  console.log(managers_result);

  // if army is less needing soldiers
  var agents_satisfied = {
    'army': false,
    'defense': false,
    'mine': false,
    'soutien': false
  }

  // agents that have asked for nothing are satisfied
  for ( var i = 0 ; i < list_agents.length ; i++ ) {
    if ( managers_result[list_agents[i]] == undefined ) {
      agents_satisfied[list_agents[i]] = true;
    }
  }

  var current_agent = undefined;
  var result = {
    'army': 0,
    'defense': 0,
    'mine': 0,
    'soutien': 0
  };

  function can_be_satisfied(agent, required) {
    switch (agent) {
      case 'army':
        return Math.floor(current_city.gold / world.rules.soldiers) >= required;
      break;
      case 'defense':
        return Math.floor(current_city.gold / world.rules.defense) >= required;
      break;
      case 'mine':
        return current_city.gold >= required * world.rules.mines;
      break;
      case 'soutien':
        return false;
      break;
    };
  };

  var get_best_agent = function() {
    var maxi = -1;
    for ( var i = 0 ; i < list_agents.length ; i++ ) {
      var tmp = world.agent_benefit[list_agents[i]]/managers_result[list_agents[i]];
      if ( maxi < 0 || tmp > world.agent_benefit[list_agents[maxi]]/managers_result[list_agents[maxi]] ) {
        if ( !agents_satisfied[list_agents[i]] && can_be_satisfied(list_agents[i], managers_result[list_agents[i]]) ) {
          maxi = i;
        }
      }
    }

    if ( maxi >= 0 ) {
      current_agent = list_agents[maxi];
      return current_agent;
    } else {
      return undefined;
    }
  };

  while ( get_best_agent() != undefined ) {
    agents_satisfied[current_agent] = true;
    // make affectations in result
    if ( managers_result[current_agent] > 0 ) {
      result[current_agent] = managers_result[current_agent];
      switch(current_agent) {
        case 'army':
          if ( managers_result[current_agent] > 0 ) {
            current_city.gold -= managers_result[current_agent]*world.rules.soldiers;
            current_city.soldiers += managers_result[current_agent];
          }
          SendSoldiers(current_city_id, attack_target);
        break;
        case 'defense':
          if ( managers_result[current_agent] > 0 ) {
            current_city.gold -= (managers_result[current_agent]*world.rules.defense);
            current_city.defense += managers_result[current_agent];
          }
        break;
        case 'mine':
          if ( managers_result[current_agent] > 0 ) {
            current_city.gold -= (managers_result[current_agent]*world.rules.mines);
            current_city.mines += managers_result[current_agent];
          }
        break;
        case 'soutien':
        break;
      }
    }
  }

}
