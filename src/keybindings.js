let Phaser = require('phaser');

module.exports = {};

module.exports.initialize = function (game) {
  module.exports.bindKey(game, 'UP', Phaser.Keyboard.W);
  module.exports.bindKey(game, 'DOWN', Phaser.Keyboard.S);
  module.exports.bindKey(game, 'LEFT', Phaser.Keyboard.A);
  module.exports.bindKey(game, 'RIGHT', Phaser.Keyboard.D);
  module.exports.bindKey(game, 'JUMP', Phaser.Keyboard.O);
  module.exports.bindKey(game, 'ATTACK', Phaser.Keyboard.P);
}

module.exports.bindKey = function (game, action, keyCode) {
  if (module.exports[action]) {
    game.input.keyboard.removeKeyCapture(module.exports[action]);
  }

  game.input.keyboard.addKeyCapture(keyCode);
  module.exports[action] = keyCode;
}