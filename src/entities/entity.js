let config = require('config');
let _ = require('underscore');

let DEFAULTS = {
  horizontalSpeed: 120,
  fallSpeed: 320,
  climbSpeed: 120,
  wallSlideSpeed: 320,
  groundAcceleration: 5000,
  airAcceleration: 5000,
  drag: 1000,
  airDrag: 0,
  jumpSpeed: 160,
  width: 8,
  height: 30
};


module.exports = function Player (game, x, y, options) {
  this.config = _.extend({}, DEFAULTS, options);

  x += this.config.width / 2;
  y += this.config.height - 1;

  Phaser.Sprite.call(this, game, x, y, this.config.spriteKey);
  this.anchor.setTo(0.5, 1);

  this.smoothed = false;

  game.physics.arcade.enable(this);
  this.body.setSize(
    this.config.width,
    this.config.height,
    this.width / 2 - this.config.width / 2,
    this.height  - this.config.height
  );

  this.body.maxVelocity.setTo(this.config.horizontalSpeed, this.config.fallSpeed);
  this.body.drag.setTo(this.config.drag, 0);
  this.body.collideWorldBounds = true;

  this.jumping = false;

  this.animations.add('idle', [0], 8, true);
  this.animations.add('wall-sliding', [1], 8, true);
  this.animations.add('jumping', [2], 8, true);
  this.animations.add('falling', [3], 8, true);
  this.animations.add('walking', [4], 8, true);
  this.animations.add('braking', [5], 8, true);
  this.animations.add('wall-climb', [6], 8, true);
};

module.exports.prototype = Object.create(Phaser.Sprite.prototype);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.update = function() {
  let game = this.game;

  game.physics.arcade.collide(this, game.layers.collision);

  let drag = this.body.onFloor() ? this.config.drag : this.config.airDrag;
  let acceleration = this.body.onFloor() ? this.config.groundAcceleration : this.config.airAcceleration;


  //track last wall touched
  if (this.body.onWall() && !this.body.onFloor()) {
    this.lastWallTouch = game.time.now;
    this.lastWallDirection = this.body.blocked.right ? 'right' : 'left';
  }

  this.body.drag.setTo(drag, 0);

  if (this.alive) {
    //move left/right
    if (this.inputLeft()) {
      this.body.acceleration.x = -acceleration;
    } else if (this.inputRight()) {
      this.body.acceleration.x = acceleration;
    } else {
      this.body.acceleration.x = 0;
    }

    //allow climbing over corners
    let tileWidth = game.map.tileWidth;
    let tileHeight = game.map.tileHeight;
    //detect whether we have a tile on the top-left or top-right of our entity
    let leftTile = game.map.getTileWorldXY(this.body.left - 1, this.body.top, tileWidth, tileHeight, 'collision');
    let rightTile = game.map.getTileWorldXY(this.body.right + 1, this.body.top, tileWidth, tileHeight, 'collision');

    if (this.body.blocked.right && this.inputRight() && !rightTile) {
      this.body.velocity.y = -this.config.climbSpeed;
    }
    if (this.body.blocked.left && this.inputLeft() && !leftTile) {
      this.body.velocity.y = -this.config.climbSpeed;
    }

    //jump
    let canInitiateJump = this.inputJump(200) && !this.jumping && (this.isOrWasOnWall() || this.body.onFloor());
    if (this.inputJump()) {

      //initiate jumping
      if (canInitiateJump) {
        //ground jump
        if (this.body.onFloor()) {
          this.jumping = true;

        //wall jump
        } else if (this.isOrWasOnWall()) {
          if (this.lastWallDirection === 'left' && this.inputRight()) {
            this.body.velocity.x = this.config.horizontalSpeed;
            this.jumping = true;
          } else if (this.lastWallDirection === 'right' && this.inputLeft()) {
            this.body.velocity.x = -this.config.horizontalSpeed;
            this.jumping = true;
          }
        }

        if (this.jumping) {
          this.jumpStarted = game.time.now;

        }
      }

      //keep jumping for as long as the user holds down the key (up to a maximum)
      //this allows the user to control jump height
      if (this.jumping) {
        this.body.velocity.y = -this.config.jumpSpeed;
      }
    }

    //end jump
    if (this.jumping) {
      if (
        !this.inputJump()
        || game.time.now > this.jumpStarted + 200
        || this.body.onCeiling()
      ) {
        this.jumping = false;
      }
    }

    //wall-slide
    if (this.body.onWall() && this.body.velocity.y > 0) {
      this.body.maxVelocity.setTo(this.config.horizontalSpeed, this.config.wallSlideSpeed);
    } else {
      this.body.maxVelocity.setTo(this.config.horizontalSpeed, this.config.fallSpeed);
    }
  }

  this.determineAnimation();
};


//check if the player is or was recently touching a wall
//this allows jumps to register for a fraction of time after the player was touching the surface
module.exports.prototype.isOrWasOnWall = function () {
  return this.lastWallTouch + config.wallTimeDelay >= game.time.now;
}


//determine which animation we should be playing
module.exports.prototype.determineAnimation = function() {
  if (this.body.onWall() && !this.body.onFloor()) {
    if (this.body.blocked.left && this.inputLeft()) {
      this.faceLeft();
      if (this.body.velocity.y < 0) {
        return this.animations.play('wall-climb');
      } else {
        return this.animations.play('wall-sliding');
      }
    }
    if (this.body.blocked.right && this.inputRight()) {
      this.faceRight();
      if (this.body.velocity.y < 0) {
        return this.animations.play('wall-climb');
      } else {
        return this.animations.play('wall-sliding');
      }
    }
  }

  if (this.body.onFloor() || this.jumping) {
    if (this.body.velocity.x < 0 && this.inputLeft()) {
      this.faceLeft();
    }

    if (this.body.velocity.x > 0 && this.inputRight()) {
      this.faceRight();
    }
  }

  if (!this.body.onFloor() && this.body.velocity.y > 0) {
    return this.animations.play('falling');
  }

  if (!this.body.onFloor()) {
    return this.animations.play('jumping');
  }

  if (this.body.onFloor() && this.body.velocity.x !== 0) {
    if (
      (this.body.velocity.x > 0 && this.inputRight())
      || (this.body.velocity.x < 0 && this.inputLeft())
    ) {
      return this.animations.play('walking');
    } else {
      return this.animations.play('braking');
    }
  }

  this.animations.play('idle');
};

module.exports.prototype.faceLeft = function () {
  this.scale.setTo(-1, 1);
}
module.exports.prototype.faceRight = function () {
  this.scale.setTo(1, 1);
}

//placeholder functions to replace or extend based on AI or player input
module.exports.prototype.inputRight = function() {
};
module.exports.prototype.inputLeft = function() {
};
module.exports.prototype.inputJump = function() {
};