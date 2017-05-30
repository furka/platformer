let Player = require('./../entities/player');
let Edger = require('./../entities/edger');
let config = require('./../config');


module.exports = function spawnEntities() {}

function spawnEntity(data) {
  let game = this.game;
  let entity;

  //round to nearest tile
  let x = Math.round(data.x / game.map.tileWidth) * game.map.tileWidth;
  let y = Math.round(data.y / game.map.tileHeight) * game.map.tileHeight;

  switch (data.type) {
    case 'Player':
      entity = new Player(game, x, y, config.player);
      game.layers.entities.add(entity);
      game.player = entity;
      break;
    // case 'TestEnemy':
    //   entity = new Edger(game, x, y, config.testEnemy);
    //   game.layers.entities.add(entity);
    //   break;
  }
}

//we need to spawn entities in the update function rather than the create function, otherwise the world will not have the correct size
module.exports.prototype.update = function () {
  let game = this.game;

  game.map.objects.entities.forEach(entity => spawnEntity.call(this, entity));

  game.state.start('main', false);
}
