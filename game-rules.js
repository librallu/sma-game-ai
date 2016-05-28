
function SendSoldiers(src, dest) {
  console.log("sending troops from " + src + " to " + dest);
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
}
