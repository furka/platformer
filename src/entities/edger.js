let config = require('config');
let Entity = require('./entity');

module.exports = function Player (game, x, y, options) {
  Entity.call(this, game, x, y, options);
};

module.exports.prototype = Object.create(Entity.prototype);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.heading = 'left';


module.exports.prototype.update = function() {
  Entity.prototype.update.call(this);
  game.physics.arcade.overlap(this, game.layers.ai, this._collisionAI, (a, b) => b.index !== -1);

  if (this.body.blocked.left || this.body.touching.left) {
    this.heading = 'right';
  }
  if (this.body.blocked.right || this.body.touching.right) {
    this.heading = 'left';
  }
};

module.exports.prototype._collisionAI = function (entity, tile) {
  switch (tile.index) {
  case 45: entity.heading = 'right'; break;
  case 46: entity.heading = 'left'; break;
  }
}

//returns true when a directional key is pressed but not the other
module.exports.prototype.inputRight = function() {
  return this.heading === 'right';
};
module.exports.prototype.inputLeft = function() {
  return this.heading === 'left';
};
