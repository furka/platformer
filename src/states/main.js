let config = require('./../config');

let pathDebug;
let stamp;

module.exports = function Main() {}

module.exports.prototype.create = function() {
  let game = this.game;

  game.camera.focusOn(game.player);
  game.camera.follow(game.player, Phaser.Camera.FOLLOW_LOCKON, config.lerpX, config.lerpY);

  if (config.debug.playerPath) {
    pathDebug = game.add.renderTexture(game.world.width, game.world.height, 'pixel');
    stamp = game.make.sprite(0,0, 'pixel');
    stamp.anchor.set(0.5);
    game.add.sprite(0, 0, pathDebug);
  }
}


module.exports.prototype.update = function() {
  if (config.debug.playerPath) {
    pathDebug.renderXY(stamp, game.player.x, game.player.y);
  }
}

module.exports.prototype.render = function() {
  let game = this.game;

  if (config.debug.bodies) {
    game.debug.body(game.player);
  }
  if (config.debug.FPS) {
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
  }
}