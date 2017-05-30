module.exports = {
  scale: 4,                     //general scale of the game
  width: 800,
  height: 600,
  gravity: 1000,
  lerpX: 0.2,                   //camera lag as it tries to follow the player
  lerpY: 0.2,
  deathSlowdown: 10,            //game slowdown as the player dies
  wallTimeDelay: 200,           //counts the player as still touching the ground even when falling for this amount of time

  debug: {
    bodies: false,
    playerPath: false,
    FPS: false,
    AI: false
  },

  player: {
    horizontalSpeed: 120,
    fallSpeed: 320,
    wallSlideSpeed: 100,
    groundAcceleration: 750,
    drag: 750,
    airAcceleration: 500,
    airDrag: 0,
    jumpSpeed: 160,
    width: 8,
    height: 32,
    spriteKey: 'player'
  },

  testEnemy: {
    spriteKey: 'enemy',
    horizontalSpeed: 60,
    width: 18,
    height: 32,
  }
}