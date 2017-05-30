let config = require('config');
let keybindings = require('keybindings');

module.exports = function Init() {}

module.exports.prototype.preload = function() {
  let game = this.game;

  this.load.image('pixel', require('assets/temp/pixel.png'));

  this.load.image('tileset', require('assets/temp/dungeon.png'));
  this.load.image('ai-tileset', require('assets/temp/ai.png'));

  this.load.spritesheet('player', require('assets/temp/player.png'), 32, 32);
  this.load.spritesheet('enemy', require('assets/temp/enemy.png'), 32, 32);

  this.load.tilemap('test', null, require('assets/temp/test.json'), Phaser.Tilemap.TILED_JSON);
};

module.exports.prototype.init = function() {
  let game = this.game;

  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(config.scale, config.scale);

  game.renderer.renderSession.roundPixels = true;
  Phaser.Canvas.setImageRenderingCrisp(game.canvas);

  keybindings.initialize(game);
};

module.exports.prototype.create = function () {
  let game = this.game;

  this.stage.smoothed = false;
  this.camera.roundPx = false;
  //this.forceSingleUpdate = true; //needed ?
  game.stage.disableVisibilityChange = true;
  game.time.advancedTiming = true; //allows FPS to be debugged

  game.state.start('create-level', true);
}