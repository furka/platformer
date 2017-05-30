let config = require('config');
let keybindings = require('keybindings');
let Entity = require('./entity');

module.exports = function Player (game, x, y, options) {
  Entity.call(this, game, x, y, options);
};

module.exports.prototype = Object.create(Entity.prototype);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.update = function() {
  Entity.prototype.update.call(this);

  if (!this.alive && this.body.velocity.isZero()) {
    this.game.time.slowMotion = 1;
  }
};

module.exports.prototype.kill = function () {
  Phaser.Sprite.prototype.kill.call(this);

  this.visible = true;
  this.exists = true;

  this.game.time.slowMotion = config.deathSlowdown;

  if (this.scale.x < 0) {
    this.body.velocity.setTo(this.config.horizontalSpeed , -this.config.jumpSpeed)
  } else {
    this.body.velocity.setTo(-this.config.horizontalSpeed , -this.config.jumpSpeed)
  }
}

//returns true when a directional key is pressed but not the other
module.exports.prototype.inputRight = function() {
  let keyboard = this.game.input.keyboard;
  return keyboard.isDown(keybindings.RIGHT) && !keyboard.isDown(keybindings.LEFT);
};
module.exports.prototype.inputLeft = function() {
  let keyboard = this.game.input.keyboard;
  return keyboard.isDown(keybindings.LEFT) && !keyboard.isDown(keybindings.RIGHT);
};

module.exports.prototype.inputJump = function(duration) {
  if (!duration) {
    duration = Infinity;
  }

  return this.game.input.keyboard.downDuration(keybindings.JUMP, duration);
};