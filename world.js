
var world = {
  cities: [
    {
      position: {x: 30, z: 0},
      rotation: 0,
      ok: false,
      player: 'red',
      soldiers: 4,
      mines: 2,
      gold: 10,
      defense: 2
    },
    {
      position: {x: -100, z: -40},
      rotation: 0,
      ok: false,
      player: 'green',
      soldiers: 3,
      mines: 2,
      gold: 5,
      defense: 5
    },
    {
      position: {x: -50, z: 10},
      rotation: 0,
      ok: false,
      player: 'green',
      soldiers: 4,
      mines: 2,
      gold: 5,
      defense: 5
    }
  ],

  links: [
    [0, 1],
    [0, 2],
    [2, 1]
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

  neighboors: [
  ]
};
