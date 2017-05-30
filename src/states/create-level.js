let config = require('./../config');

module.exports = function CreateLevel() {}

function createLevel(data) {
  let game = this.game;
  let map = game.add.tilemap('test');
  map.addTilesetImage('ai', 'ai-tileset');
  map.addTilesetImage('dungeon', 'tileset');

  game.layers = {};
  game.layers.background  = map.createLayer('background');
  game.layers.entities    = game.add.group();
  game.layers.ai          = map.createLayer('ai');
  game.layers.collision   = map.createLayer('collision');

  game.layers.collision.resizeWorld();
  map.setCollisionByExclusion([0], true, 'collision');

  if (config.debug.collision) {
    game.layers.collision.debug = true;
  }

  game.layers.ai.visible = false;

  game.map = map;
}

module.exports.prototype.create = function() {
  let game = this.game;
  let world = game.world;

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = config.gravity;

  game.stage.backgroundColor = 0x2B3F6B;

  createLevel.call(this);

  if (!config.debug.AI) {
    game.layers.ai.visible = false;
  }
};

module.exports.prototype.update = function () {
  game.state.start('spawn-entities', false);
}