require('index.less');

require('pixi');
require('p2');
require('phaser');

let config = require('config');

let game = new Phaser.Game(
  config.width/config.scale,
  config.height/config.scale,
  Phaser.AUTO,
  document.getElementById('game')
);

game.state.add('init', require('states/init'));
game.state.add('create-level', require('states/create-level'));
game.state.add('spawn-entities', require('states/spawn-entities'));
game.state.add('main', require('states/main'));

game.state.start('init');

window.game = game;
