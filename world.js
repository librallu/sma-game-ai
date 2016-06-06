
var world = {
  cities: [
    {
      position: {x: -120, z:-40},
      rotation: 0,
      ok: false,
      player: 'green',
      soldiers: 0,
      mines: 3,
      gold: 4,
      defense: 3
    },
    {
      position: {x: -135, z:20},
      rotation: 0,
      ok: false,
      player: 'green',
      soldiers: 0,
      mines: 3,
      gold: 4,
      defense: 3
    },
    {
      position: {x: -60, z:-10},
      rotation: 0,
      ok: false,
      player: 'green',
      soldiers: 0,
      mines: 2,
      gold: 8,
      defense: 7
    },
    {
      position: {x: 0, z:-40},
      rotation: 0,
      ok: false,
      player: 'green',
      soldiers: 0,
      mines: 2,
      gold: 6,
      defense: 4
    },
    {
      position: {x: -15, z:20},
      rotation: 0,
      ok: false,
      player: 'red',
      soldiers: 0,
      mines: 2,
      gold: 6,
      defense: 4
    },
    {
      position: {x: 60, z:-10},
      rotation: 0,
      ok: false,
      player: 'red',
      soldiers: 0,
      mines: 2,
      gold: 8,
      defense: 7
    },
    {
      position: {x: 120, z:-40},
      rotation: 0,
      ok: false,
      player: 'red',
      soldiers: 0,
      mines: 3,
      gold: 4,
      defense: 3
    },
    {
      position: {x: 105, z:20},
      rotation: 0,
      ok: false,
      player: 'red',
      soldiers: 0,
      mines: 3,
      gold: 4,
      defense: 3
    },
  ],

  links: [
    [0, 2],
    [0, 3],
    [1, 2],
    [2, 5],
    [2, 3],
    [4, 7],
    [5, 6],
    [5, 4],
    [5, 7],
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
  ],

  neighbors: [
  ],

  rules: {
    soldiers: 3,
    defense: 2,
    mines: 5
  },

  agent_benefit: {
    'army': 3,
    'defense': 5,
    'mine': 1,
    'soutien': 4
  }
};
