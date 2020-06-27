(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],2:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  BaseEntity is the root class that all Entities will eventually extent from.
  It implements all the required public functions for an entity to exist
 */
var BaseEntity;

BaseEntity = (function() {
  BaseEntity.prototype.name = 'Base';

  function BaseEntity() {
    this.is_moveable = true;
    this.is_deleted = false;
    this.color = [0, 0, 0, 255];
  }

  BaseEntity.prototype.init = function(map, index) {
    this.map = map;
    this.moved(index);
    this.setColor(this.color[0], this.color[1], this.color[2], this.color[3]);
    return true;
  };

  BaseEntity.prototype.moved = function(new_index) {
    var ref;
    this.map_index = new_index;
    ref = this.map._indexToPoint(new_index), this.map_x = ref[0], this.map_y = ref[1];
    this.setColor(this.color[0], this.color[1], this.color[2], this.color[3]);
    return true;
  };

  BaseEntity.prototype.setColor = function(r, g, b, a) {
    var image_index;
    if (!this.is_deleted) {
      this.color = [r, g, b, a];
      image_index = this.map_index * 4;
      this.map._image[image_index] = r;
      this.map._image[image_index + 1] = g;
      this.map._image[image_index + 2] = b;
      this.map._image[image_index + 3] = a;
      return true;
    } else {
      return false;
    }
  };

  BaseEntity.prototype.tick = function() {
    return true;
  };

  return BaseEntity;

})();

module.exports = BaseEntity;


},{}],3:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The ComplexMaterialEntity represents a dead Producer
 */
var ComplexMaterialEntity, FlowingEntity,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

FlowingEntity = require('./FlowingEntity');

ComplexMaterialEntity = (function(superClass) {
  extend(ComplexMaterialEntity, superClass);

  ComplexMaterialEntity.prototype.name = 'ComplexMaterial';

  function ComplexMaterialEntity(type) {
    this.type = type != null ? type : Math.floor(Math.random() * 3);
    ComplexMaterialEntity.__super__.constructor.apply(this, arguments);
    this.is_moveable = false;
    switch (this.type) {
      case 0:
        this.color = [255, 0, 0, 255];
        break;
      case 1:
        this.color = [255, 50, 50, 255];
        break;
      case 2:
        this.color = [255, 100, 100, 255];
    }
  }

  return ComplexMaterialEntity;

})(FlowingEntity);

module.exports = ComplexMaterialEntity;


},{"./FlowingEntity":6}],4:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The EdgeEntity is for the edges of the map
 */
var BaseEntity, EdgeEntity,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseEntity = require('./BaseEntity');

EdgeEntity = (function(superClass) {
  extend(EdgeEntity, superClass);

  EdgeEntity.prototype.name = 'Edge';

  EdgeEntity.prototype.type = 0;

  function EdgeEntity(type) {
    this.type = type;
    EdgeEntity.__super__.constructor.apply(this, arguments);
    this.is_moveable = false;
    this.color = this.type ? [102, 51, 0, 255] : [100, 146, 1, 255];
  }

  return EdgeEntity;

})(BaseEntity);

module.exports = EdgeEntity;


},{"./BaseEntity":2}],5:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The EmptyEntity is the placeholder for empty spots
 */
var BaseEntity, EmptyEntity, maxBrightness, minBrightness,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseEntity = require('./BaseEntity');

minBrightness = 0;

maxBrightness = 20;

EmptyEntity = (function(superClass) {
  extend(EmptyEntity, superClass);

  EmptyEntity.prototype.name = 'Empty';

  function EmptyEntity() {
    EmptyEntity.__super__.constructor.call(this);
    this.color = [0, 0, 0, 255];
  }

  EmptyEntity.prototype.tick = function() {
    return EmptyEntity.__super__.tick.call(this) && false;
  };

  return EmptyEntity;

})(BaseEntity);

module.exports = EmptyEntity;


},{"./BaseEntity":2}],6:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The FlowingEntity is a base entity to give an entity the ability to flow with the map's current
 */
var BaseEntity, EmptyEntity, FlowingEntity, directions,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseEntity = require('./BaseEntity');

EmptyEntity = require('./EmptyEntity');

directions = ['right', 'down', 'left', 'up'];

FlowingEntity = (function(superClass) {
  extend(FlowingEntity, superClass);

  FlowingEntity.prototype.name = 'Flowing';

  function FlowingEntity() {
    FlowingEntity.__super__.constructor.apply(this, arguments);
  }

  FlowingEntity.prototype.tick = function() {
    var direction, entity;
    if (FlowingEntity.__super__.tick.call(this)) {
      direction = Math.random() > .5 ? directions[Math.floor(Math.random() * 4)] : this.map.flow(this.map_index);
      entity = this.map.getEntityAtDirection(this.map_index, direction);
      if (entity && entity.is_moveable) {
        this.map.swapEntities(this.map_index, entity.map_index);
      }
      return true;
    } else {
      return false;
    }
  };

  return FlowingEntity;

})(BaseEntity);

module.exports = FlowingEntity;


},{"./BaseEntity":2,"./EmptyEntity":5}],7:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The LivingEntity is a base entity which kills an entity and adjusts the transparency based on health
 */
var BaseEntity, EmptyEntity, LivingEntity,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseEntity = require('./BaseEntity');

EmptyEntity = require('./EmptyEntity');

LivingEntity = (function(superClass) {
  extend(LivingEntity, superClass);

  function LivingEntity() {
    LivingEntity.__super__.constructor.apply(this, arguments);
    this.max_health = 400;
  }

  LivingEntity.prototype.died = function() {};

  LivingEntity.prototype.tick = function() {
    if (LivingEntity.__super__.tick.call(this)) {
      if (this.health <= 0) {
        this.map.assignEntityToIndex(this.map_index, new EmptyEntity(), true);
        this.died();
        return false;
      } else {
        this.setColor(this.color[0], this.color[1], this.color[2], Math.min(255, 20 + Math.round((this.health / this.max_health) * 235)));
        return true;
      }
    } else {
      return false;
    }
  };

  return LivingEntity;

})(BaseEntity);

module.exports = LivingEntity;


},{"./BaseEntity":2,"./EmptyEntity":5}],8:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The ProducerEntity is an entity which consumes RawMaterial, shares health with other friendly
  Producers, and when dies turn into a ComplexMaterial
 */
var ComplexMaterialEntity, EmptyEntity, LivingEntity, ProducerEntity, fixmod, shuffle, variableHolder,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

LivingEntity = require('./LivingEntity');

EmptyEntity = require('./EmptyEntity');

ComplexMaterialEntity = require('./ComplexMaterialEntity');

shuffle = require('../lib/shuffleArray');

variableHolder = require('../lib/variableHolder').ProducerEntity;

fixmod = function(m, n) {
  return ((m % n) + n) % n;
};

ProducerEntity = (function(superClass) {
  extend(ProducerEntity, superClass);

  ProducerEntity.prototype.name = 'Producer';

  function ProducerEntity(wants) {
    this.wants = wants != null ? wants : Math.floor(Math.random() * 3);
    ProducerEntity.__super__.constructor.apply(this, arguments);
    this.makes = fixmod(this.wants + 1, 3);
    this.is_moveable = false;
    this.color = [0, 255, 0, 255];
    this.health = variableHolder.starting_life;
    this.max_health = variableHolder.max_life;
    this.last_ate = 0;
    this.age = 0;
  }

  ProducerEntity.prototype.getSides = function() {
    var i, len, ref, results, side;
    ref = shuffle(['up', 'down', 'left', 'right']);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      side = ref[i];
      results.push(this.map.getEntityAtDirection(this.map_index, side));
    }
    return results;
  };

  ProducerEntity.prototype.eat = function(entities) {
    var entity, i, len, results;
    results = [];
    for (i = 0, len = entities.length; i < len; i++) {
      entity = entities[i];
      if (this.health < this.max_health) {
        results.push((this.last_ate = 0, this.age = 0, this.health += variableHolder.life_gain_per_food, this.map.assignEntityToIndex(entity.map_index, new EmptyEntity(), true)));
      }
    }
    return results;
  };

  ProducerEntity.prototype.transferHealth = function(entities) {
    var entity, i, len, needs;
    for (i = 0, len = entities.length; i < len; i++) {
      entity = entities[i];
      needs = (this.health < variableHolder.min_life_to_transfer && entity.health > variableHolder.min_life_to_transfer ? Math.floor(this.health * .9) : ((this.health < variableHolder.min_life_to_transfer && entity.health < variableHolder.min_life_to_transfer) || (this.health > variableHolder.min_life_to_transfer && entity.health > variableHolder.min_life_to_transfer)) && this.health > entity.health ? Math.min(Math.ceil((this.health - entity.health) / 2), variableHolder.max_life_transfer) : 0);
      if (needs > 0) {
        this.health -= needs;
        entity.health += needs;
      }
    }
    return true;
  };

  ProducerEntity.prototype.attackEnemies = function(entities) {
    var entity, i, len, results;
    results = [];
    for (i = 0, len = entities.length; i < len; i++) {
      entity = entities[i];
      results.push(entity.health -= 10);
    }
    return results;
  };

  ProducerEntity.prototype.reproduce = function(entities) {
    var entity, i, len, results;
    results = [];
    for (i = 0, len = entities.length; i < len; i++) {
      entity = entities[i];
      if (this.health >= variableHolder.life_to_reproduce) {
        results.push((this.health -= variableHolder.life_loss_to_reproduce, this.map.assignEntityToIndex(entity.map_index, new ProducerEntity(this.wants), true), this.age = 0));
      }
    }
    return results;
  };

  ProducerEntity.prototype.died = function() {
    return this.map.assignEntityToIndex(this.map_index, new ComplexMaterialEntity(this.makes), true);
  };

  ProducerEntity.prototype.tick = function() {
    var consumable_entities, enemy_entities, entity, friendly_entities, placeable_entities, sides;
    if (ProducerEntity.__super__.tick.call(this)) {
      this.last_ate++;
      this.age++;
      sides = (function() {
        var i, len, ref, results;
        ref = this.getSides();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          entity = ref[i];
          if (entity) {
            results.push(entity);
          }
        }
        return results;
      }).call(this);
      friendly_entities = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = sides.length; i < len; i++) {
          entity = sides[i];
          if (entity.name === "Producer" && entity.wants === this.wants && entity.makes === this.makes) {
            results.push(entity);
          }
        }
        return results;
      }).call(this);
      enemy_entities = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = sides.length; i < len; i++) {
          entity = sides[i];
          if (entity.name === "Producer" && entity.wants !== this.wants && entity.makes !== this.makes) {
            results.push(entity);
          }
        }
        return results;
      }).call(this);
      if (friendly_entities.length) {
        this.transferHealth(friendly_entities);
      }
      if (enemy_entities.length) {
        this.attackEnemies(enemy_entities);
      }
      if (this.age > variableHolder.age_to_reproduce && Math.pow(friendly_entities.length + 1, 2) / 16 > Math.random()) {
        placeable_entities = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = sides.length; i < len; i++) {
            entity = sides[i];
            if (entity.name === "Empty") {
              results.push(entity);
            }
          }
          return results;
        })();
        this.reproduce(placeable_entities);
      }
      if (this.last_ate > variableHolder.eating_cooldown) {
        consumable_entities = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = sides.length; i < len; i++) {
            entity = sides[i];
            if (entity.name === "RawMaterial" && entity.type === this.wants) {
              results.push(entity);
            }
          }
          return results;
        }).call(this);
        this.eat(consumable_entities);
      }
      if (friendly_entities.length === 4) {
        this.age = 0;
        this.color[1] = 255;
        this.health -= 1;
      } else {
        this.health -= 5;
        this.color[1] = 200;
      }
      if (this.age / variableHolder.old_age_death_multiplier > Math.random()) {
        this.died();
      }
      return true;
    } else {
      return false;
    }
  };

  return ProducerEntity;

})(LivingEntity);

module.exports = ProducerEntity;


},{"../lib/shuffleArray":16,"../lib/variableHolder":17,"./ComplexMaterialEntity":3,"./EmptyEntity":5,"./LivingEntity":7}],9:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The RawMaterialEntity is just a blue flowing entity
 */
var FlowingEntity, RawMaterialEntity,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

FlowingEntity = require('./FlowingEntity');

RawMaterialEntity = (function(superClass) {
  extend(RawMaterialEntity, superClass);

  RawMaterialEntity.prototype.name = 'RawMaterial';

  function RawMaterialEntity(type) {
    this.type = type != null ? type : Math.floor(Math.random() * 3);
    RawMaterialEntity.__super__.constructor.apply(this, arguments);
    switch (this.type) {
      case 0:
        this.color = [0, 0, 255, 255];
        break;
      case 1:
        this.color = [50, 50, 255, 255];
        break;
      case 2:
        this.color = [100, 100, 255, 255];
    }
  }

  return RawMaterialEntity;

})(FlowingEntity);

module.exports = RawMaterialEntity;


},{"./FlowingEntity":6}],10:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The RoamingEntity is an entity which will hunt out ComplexMaterial and turn it back into RawMaterial
 */
var EmptyEntity, LivingEntity, RawMaterialEntity, RoamingEntity, directions, search_radius, shuffle, variables,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

LivingEntity = require('./LivingEntity');

EmptyEntity = require('./EmptyEntity');

shuffle = require('../lib/shuffleArray');

RawMaterialEntity = require('./RawMaterialEntity');

variables = require('../lib/variableHolder.coffee').RoamingEntity;

search_radius = 10;

directions = ['right', 'down', 'left', 'up'];

RoamingEntity = (function(superClass) {
  extend(RoamingEntity, superClass);

  RoamingEntity.prototype.name = 'Roaming';

  function RoamingEntity() {
    RoamingEntity.__super__.constructor.call(this);
    this.max_health = variables.max_life;
    this.is_moveable = false;
    this.health = variables.starting_health_fresh;
    this.color = [255, 255, 0, 255];
    this.stuck_count = 0;
    this.stuck_cooldown = 0;
  }

  RoamingEntity.prototype.chooseDirection = function() {
    return this.wanted_direction = directions[Math.floor(Math.random() * 4)];
  };

  RoamingEntity.prototype.doMovement = function() {
    var all_entities, direction, dx, dy, entity, filtered_entities, self, target_entity, x_neg, x_pos, y, y_neg, y_pos;
    self = this;
    if (this.stuck_count > variables.stuck_ticks) {
      this.chooseDirection();
      this.stuck_cooldown = variables.stuck_cooldown;
    }
    if (this.stuck_cooldown > 0) {
      this.stuck_cooldown--;
      this.wanted_direction;
    }
    direction = ((function() {
      var i, ref, ref1;
      if (this.stuck_cooldown > 0) {
        this.stuck_cooldown--;
        return false;
      } else {
        x_neg = Math.max(this.map_x - search_radius, 0);
        y_neg = Math.max(this.map_y - search_radius, 0);
        x_pos = Math.min(this.map_x + search_radius, this.map.width);
        y_pos = Math.min(this.map_y + search_radius, this.map.height);
        all_entities = [];
        for (y = i = ref = y_neg, ref1 = y_pos; ref <= ref1 ? i <= ref1 : i >= ref1; y = ref <= ref1 ? ++i : --i) {
          all_entities = all_entities.concat(self.map.getEntitiesInRange(self.map._pointToIndex(x_neg, y), self.map._pointToIndex(x_pos, y)));
        }
        filtered_entities = all_entities.filter(function(entity) {
          return entity.name === 'ComplexMaterial';
        });
        filtered_entities.sort(function(ent_a, ent_b) {
          var a_distance, b_distance;
          a_distance = Math.sqrt(Math.pow(ent_a.map_x - self.map_x, 2) + Math.pow(ent_a.map_y - self.map_y, 2));
          b_distance = Math.sqrt(Math.pow(ent_b.map_x - self.map_x, 2) + Math.pow(ent_b.map_y - self.map_y, 2));
          if (a_distance < b_distance) {
            return -1;
          } else if (a_distance > b_distance) {
            return 1;
          } else {
            return 0;
          }
        });
        if (filtered_entities.length) {
          target_entity = filtered_entities[0];
          dx = target_entity.map_x - self.map_x;
          dy = target_entity.map_y - self.map_y;
          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
              return 'right';
            } else {
              return 'left';
            }
          } else {
            if (dy > 0) {
              return 'down';
            } else {
              return 'up';
            }
          }
        } else {
          return false;
        }
      }
    }).call(this));
    if (!direction) {
      if (Math.random() > .9) {
        this.chooseDirection();
      }
      direction = this.wanted_direction;
    }
    entity = this.map.getEntityAtDirection(this.map_index, direction);
    if (entity && entity.name !== 'Edge') {
      this.map.swapEntities(this.map_index, entity.map_index);
      return this.stuck_count = 0;
    } else {
      return this.stuck_count++;
    }
  };

  RoamingEntity.prototype.consumeMaterial = function() {
    var entity, i, len, ref, results, side;
    ref = shuffle(['up', 'down', 'left', 'right']);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      side = ref[i];
      results.push((entity = this.map.getEntityAtDirection(this.map_index, side), entity ? entity.name === 'ComplexMaterial' ? (this.map.assignEntityToIndex(entity.map_index, new RawMaterialEntity(entity.type), true), this.health += variables.life_gain_per_food) : void 0 : void 0));
    }
    return results;
  };

  RoamingEntity.prototype.reproduce = function() {
    var child, entity, i, len, ref, side;
    if (this.health > variables.life_to_reproduce) {
      ref = shuffle(['up', 'down', 'left', 'right']);
      for (i = 0, len = ref.length; i < len; i++) {
        side = ref[i];
        entity = this.map.getEntityAtDirection(this.map_index, side);
        if (entity && entity.name === 'Empty') {
          child = new RoamingEntity();
          child.health = variables.starting_health_clone;
          this.map.assignEntityToIndex(entity.map_index, child, true);
          this.health -= variables.life_loss_to_reproduce;
          break;
        }
      }
    }
    return true;
  };

  RoamingEntity.prototype.tick = function() {
    if (RoamingEntity.__super__.tick.call(this)) {
      this.consumeMaterial();
      this.doMovement();
      this.reproduce();
      return this.health--;
    } else {
      return false;
    }
  };

  return RoamingEntity;

})(LivingEntity);

module.exports = RoamingEntity;


},{"../lib/shuffleArray":16,"../lib/variableHolder.coffee":17,"./EmptyEntity":5,"./LivingEntity":7,"./RawMaterialEntity":9}],11:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Predictable 1d noise maker

  Retrieved from http://www.michaelbromley.co.uk/api/90/simple-1d-noise-in-javascript
  Modified to be a re-usable class
 */
var Simple1DNoise, lerp,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

lerp = function(a, b, t) {
  return a * (1 - t) + b * t;
};

Simple1DNoise = (function() {
  Simple1DNoise.prototype.MAX_VERTICES = 256;

  Simple1DNoise.prototype.MAX_VERTICES_MASK = 255;

  Simple1DNoise.prototype.amplitude = 1;

  Simple1DNoise.prototype.scale = .015;

  Simple1DNoise.prototype.r = [];

  function Simple1DNoise(amplitude1, scale1) {
    var i, j, ref;
    this.amplitude = amplitude1;
    this.scale = scale1;
    this.getVal = bind(this.getVal, this);
    for (i = j = 0, ref = this.MAX_VERTICES; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      this.r.push(Math.random());
    }
  }

  Simple1DNoise.prototype.getVal = function(x) {
    var scaledX, t, tRemapSmoothstep, xFloor, xMax, xMin, y;
    scaledX = x * this.scale;
    xFloor = Math.floor(scaledX);
    t = scaledX - xFloor;
    tRemapSmoothstep = t * t * (3 - (2 * t));
    xMin = xFloor & this.MAX_VERTICES_MASK;
    xMax = xMin + 1 & this.MAX_VERTICES_MASK;
    y = lerp(this.r[xMin], this.r[xMax], tRemapSmoothstep);
    return y * this.amplitude;
  };

  return Simple1DNoise;

})();

module.exports = function(amplitude, scale) {
  return new Simple1DNoise(amplitude, scale);
};


},{}],12:[function(require,module,exports){
var EdgeEntity, Simple1DNoise, makeBorder, workIn;

EdgeEntity = require('../entities/EdgeEntity');

Simple1DNoise = require('./Simple1DNoise');

workIn = function(map, sx, sy, axis, direction) {
  var entity, index, results;
  results = [];
  while (true) {
    index = map._pointToIndex(sx, sy);
    entity = map.getEntityAtIndex(index);
    if (entity.name !== 'Edge') {
      map.assignEntityToIndex(index, new EdgeEntity(0), true);
    }
    if (!entity || (entity.name === 'Edge' && entity.type === 1)) {
      break;
    }
    switch (axis) {
      case 'x':
        results.push(sx = direction ? sx + 1 : sx - 1);
        break;
      case 'y':
        results.push(sy = direction ? sy + 1 : sy - 1);
        break;
      default:
        results.push(void 0);
    }
  }
  return results;
};

makeBorder = function(map) {
  var d, dirt_depth, dirt_noise, i, index, j, k, l, min_radius, multi, noised_radius, p, rad, radius_noise, radius_offset, ref, ref1, ref2, results, x, x_center, y, y_center;
  x_center = Math.round(map.width / 2);
  y_center = Math.round(map.height / 2);
  min_radius = Math.floor(Math.min(map.width, map.height) / 2) * .8;
  radius_noise = Simple1DNoise(10, .05);
  dirt_noise = Simple1DNoise(10, .02);
  multi = 4;
  for (p = j = 0, ref = 360 * multi; 0 <= ref ? j < ref : j > ref; p = 0 <= ref ? ++j : --j) {
    rad = (p / multi) * Math.PI / 180;
    radius_offset = radius_noise.getVal(p);
    noised_radius = min_radius + radius_offset;
    dirt_depth = Math.round(Math.max(1, dirt_noise.getVal(p)));
    console.log(dirt_depth);
    for (d = k = 0, ref1 = dirt_depth; 0 <= ref1 ? k < ref1 : k > ref1; d = 0 <= ref1 ? ++k : --k) {
      x = Math.round(x_center + (noised_radius + d) * Math.cos(rad));
      y = Math.round(y_center + (noised_radius + d) * Math.sin(rad));
      index = map._pointToIndex(x, y);
      map.assignEntityToIndex(index, new EdgeEntity(1), true);
    }
  }
  results = [];
  for (i = l = 0, ref2 = Math.max(x_center + 1, y_center + 1); 0 <= ref2 ? l < ref2 : l > ref2; i = 0 <= ref2 ? ++l : --l) {
    if (x_center - i >= 0) {
      workIn(map, x_center - i, 0, 'y', true);
      workIn(map, x_center - i, map.height - 1, 'y', false);
    }
    if (x_center + i < map.height) {
      workIn(map, x_center + i, 0, 'y', true);
      workIn(map, x_center + i, map.height - 1, 'y', false);
    }
    if (y_center - i >= 0) {
      workIn(map, 0, y_center - i, 'x', true);
      workIn(map, map.width - 1, y_center - i, 'x', false);
    }
    if (y_center + i < map.height) {
      workIn(map, 0, y_center + i, 'x', true);
      results.push(workIn(map, map.width - 1, y_center + i, 'x', false));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

module.exports = makeBorder;


},{"../entities/EdgeEntity":4,"./Simple1DNoise":11}],13:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Contains a set of different flow calculators.
 */
Number.prototype.mod = function(n) {
  return ((this % n) + n) % n;
};

module.exports.dual_spirals = function(width, height, map) {
  var center_x, center_y, z;
  center_x = Math.floor(width / 2);
  center_y = Math.floor(height / 2);
  z = 1;
  return function(index) {
    var dx, dy, mx, q, rand, x, y;
    x = index % width;
    y = Math.floor(index / width);
    dx = x - center_x;
    dy = y - center_y;
    mx = Math.abs(dx);
    q = (dy > 0 ? mx < center_x / 2 ? 0 : 1 : mx > center_x / 2 ? 2 : 3);
    rand = Math.random() >= .5;
    if (dx > 0) {
      switch (q) {
        case 0:
          if (rand) {
            return 'up';
          } else {
            return 'left';
          }
          break;
        case 1:
          if (rand) {
            return 'left';
          } else {
            return 'down';
          }
          break;
        case 2:
          if (rand) {
            return 'down';
          } else {
            return 'right';
          }
          break;
        case 3:
          if (rand) {
            return 'right';
          } else {
            return 'up';
          }
      }
    } else {
      switch (q) {
        case 0:
          if (rand) {
            return 'up';
          } else {
            return 'right';
          }
          break;
        case 1:
          if (rand) {
            return 'right';
          } else {
            return 'down';
          }
          break;
        case 2:
          if (rand) {
            return 'down';
          } else {
            return 'left';
          }
          break;
        case 3:
          if (rand) {
            return 'left';
          } else {
            return 'up';
          }
      }
    }
  };
};

module.exports.opposite_spirals = function(width, height, map) {
  var center_x, center_y, z;
  center_x = Math.floor(width / 2);
  center_y = Math.floor(height / 2);
  z = 1;
  return function(index) {
    var dx, dy, mx, q, rand, x, y;
    x = index % width;
    y = Math.floor(index / width);
    dx = x - center_x;
    dy = y - center_y;
    mx = Math.abs(dx);
    q = (dy > 0 ? mx < center_x / 2.5 ? 0 : 1 : mx > center_x / 2.5 ? 2 : 3);
    rand = Math.random() >= .49;
    if (dx > 0) {
      switch (q) {
        case 0:
          if (rand) {
            return 'left';
          } else {
            return 'up';
          }
          break;
        case 1:
          if (rand) {
            return 'down';
          } else {
            return 'left';
          }
          break;
        case 2:
          if (rand) {
            return 'right';
          } else {
            return 'down';
          }
          break;
        case 3:
          if (rand) {
            return 'up';
          } else {
            return 'right';
          }
      }
    } else {
      switch (q) {
        case 0:
          if (rand) {
            return 'down';
          } else {
            return 'left';
          }
          break;
        case 1:
          if (rand) {
            return 'left';
          } else {
            return 'up';
          }
          break;
        case 2:
          if (rand) {
            return 'up';
          } else {
            return 'right';
          }
          break;
        case 3:
          if (rand) {
            return 'right';
          } else {
            return 'down';
          }
      }
    }
  };
};

module.exports.tight_spiral = function(width, height, map) {
  var center_x, center_y;
  center_x = Math.floor(width / 2);
  center_y = Math.floor(height / 2);
  return function(index) {
    var dx, dy, x, y;
    x = index % width;
    y = Math.floor(index / width);
    dx = x - center_x;
    dy = y - center_y;
    if (dx > 0 && dy >= 0) {
      if (Math.random() < Math.abs(dx) / center_x) {
        return 'up';
      } else {
        return 'right';
      }
    } else if (dx >= 0 && dy < 0) {
      if (Math.random() < Math.abs(dy) / center_y) {
        return 'left';
      } else {
        return 'up';
      }
    } else if (dx < 0 && dy <= 0) {
      if (Math.random() < Math.abs(dx) / center_x) {
        return 'down';
      } else {
        return 'left';
      }
    } else if (dx <= 0 && dy > 0) {
      if (Math.random() < Math.abs(dy) / center_y) {
        return 'right';
      } else {
        return 'down';
      }
    } else {
      return ['right', 'down', 'left', 'up'][Math.floor(Math.random() * 4)];
    }
  };
};

module.exports.spiral = function(width, height) {
  var angle, center_x, center_y, directions, distance, division_angle, dx, dy, i, index, maxDistance, mx, my, pointCache, ref, x, y;
  center_x = Math.floor(width / 2);
  center_y = Math.floor(height / 2);
  division_angle = Math.floor(360 / 4);
  maxDistance = Math.sqrt(Math.pow(width - center_x, 2) + Math.pow(height - center_y, 2));
  mx = 1;
  my = 1;
  if (width > height) {
    mx = height / width;
  } else {
    my = width / height;
  }
  directions = ['right', 'down', 'left', 'up'];
  pointCache = [];
  for (index = i = 0, ref = width * height - 1; 0 <= ref ? i <= ref : i >= ref; index = 0 <= ref ? ++i : --i) {
    x = index % width;
    y = Math.floor(index / width);
    dx = (x - center_x) * mx;
    dy = (y - center_y + 1) * my;
    distance = Math.sin((Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) / maxDistance) * 10);
    angle = Math.floor(((((Math.atan2(dy, dx) * 180) / Math.PI) + distance).mod(360) / division_angle) * 100) / 100;
    pointCache[index] = angle;
  }
  return function(index) {
    var dec, direction, intp;
    angle = pointCache[index];
    intp = Math.floor(angle);
    dec = Math.floor((angle - intp) * 100);
    direction = Math.random() * 100 > dec ? (intp + 1).mod(4) : (intp + 2).mod(4);
    return directions[direction];
  };
};


},{}],14:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Simple object to keep track of FPS
 */
module.exports = function() {
  var filter_strength, frame_time, last_loop;
  filter_strength = 20;
  frame_time = 0;
  last_loop = new Date();
  return {
    tick: function() {
      var this_loop, this_time;
      this_loop = new Date;
      this_time = this_loop - last_loop;
      frame_time += (this_time - frame_time) / filter_strength;
      return last_loop = this_loop;
    },
    getFps: function() {
      return 1000 / frame_time;
    }
  };
};


},{}],15:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The Map is the heart of the application, and hold all the entities in the map and handles issuing the ticks
  to each entity. It also hold the image data for the map and keeps the goal ratios up to date.
 */
var ComplexMaterialEntity, EmptyEntity, Map, ProducerEntity, RawMaterialEntity, RoamingEntity, flow, shuffle, variables;

EmptyEntity = require('../entities/EmptyEntity');

RoamingEntity = require('../entities/RoamingEntity');

RawMaterialEntity = require('../entities/RawMaterialEntity');

ComplexMaterialEntity = require('../entities/ComplexMaterialEntity');

ProducerEntity = require('../entities/ProducerEntity');

flow = require('./flow');

shuffle = require('./shuffleArray');

variables = require('./variableHolder').Map;

Map = (function() {
  Map.prototype._map = [];

  Map.prototype._tick = 0;

  Map.prototype._image = null;

  Map.prototype._counts = {
    Base: 0,
    Empty: 0,
    RawMaterial: 0,
    Roaming: 0,
    ComplexMaterial: 0,
    Producer: 0,
    Edge: 0
  };

  function Map(width, height, flow_type) {
    var i, j, k, ref;
    this.width = width;
    this.height = height;
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    this.flow = flow[flow_type](this.width, this.height, this);
    this._image = new Uint8Array((this.width * this.height) * 4);
    for (i = j = 0, ref = (this.width * this.height) - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      this.assignEntityToIndex(i, new EmptyEntity(), true);
    }
    this.makeBorder();
    for (k = 0; k <= 8; k++) {
      this._addProducer();
    }
  }

  Map.prototype.makeBorder = function() {
    return require('./border')(this);
  };

  Map.prototype.setFlowType = function(type) {
    return this.flow = flow[type](this.width, this.height);
  };

  Map.prototype.tick = function() {
    var entity, j, k, len, needed_material, ref, ref1;
    needed_material = this._getNeededMaterialCount();
    if (needed_material > 0) {
      for (j = 0, ref = needed_material; 0 <= ref ? j <= ref : j >= ref; 0 <= ref ? j++ : j--) {
        this._addMaterial();
      }
    }
    if (Math.random() * 10000 < variables.chance_roamer_spawn) {
      this._addRoamer();
    }
    if (Math.random() * 10000 < variables.chance_producer_spawn) {
      this._addProducer();
    }
    ref1 = shuffle(this._map.slice());
    for (k = 0, len = ref1.length; k < len; k++) {
      entity = ref1[k];
      entity.tick();
    }
    return this._tick++;
  };

  Map.prototype.getRender = function() {
    return this._image;
  };

  Map.prototype.getEntityAtXY = function(x, y) {
    return this.getEntityAtIndex(this._pointToIndex(x, y));
  };

  Map.prototype.getEntityAtIndex = function(index) {
    if (this._map[index] != null) {
      return this._map[index];
    } else {
      return false;
    }
  };

  Map.prototype.getEntitiesInRange = function(index_min, index_max) {
    return this._map.slice(index_min, index_max + 1);
  };

  Map.prototype.swapEntities = function(index1, index2) {
    var ent1, ent2;
    ent1 = this.getEntityAtIndex(index1);
    ent2 = this.getEntityAtIndex(index2);
    this.assignEntityToIndex(index1, ent2);
    this.assignEntityToIndex(index2, ent1);
    ent1.is_deleted = false;
    ent2.is_deleted = false;
    return true;
  };

  Map.prototype.getEntityAtDirection = function(index, direction) {
    switch (direction) {
      case 'up':
        if (index > this.width - 1) {
          return this.getEntityAtIndex(index - this.width);
        } else {
          return false;
        }
        break;
      case 'down':
        if (index < this._map.length - 1) {
          return this.getEntityAtIndex(index + this.width);
        } else {
          return false;
        }
        break;
      case 'left':
        if (index % this.width > 0) {
          return this.getEntityAtIndex(index - 1);
        } else {
          return false;
        }
        break;
      case 'right':
        if (index % this.width < this.width - 1) {
          return this.getEntityAtIndex(index + 1);
        } else {
          return false;
        }
    }
  };

  Map.prototype.assignEntityToIndex = function(index, entity, is_new) {
    var current_entity;
    if (is_new == null) {
      is_new = false;
    }
    if (index > this._map.length || index < 0) {
      return false;
    } else {
      current_entity = this.getEntityAtIndex(index);
      if (current_entity) {
        current_entity.is_deleted = true;
        this._counts[current_entity.name]--;
      }
      this._counts[entity.name]++;
      this._map[index] = entity;
      entity.is_deleted = false;
      if (is_new) {
        entity.init(this, index);
      } else {
        entity.moved(index);
      }
      return true;
    }
  };

  Map.prototype._pointToIndex = function(x, y) {
    return x + this.width * y;
  };

  Map.prototype._indexToPoint = function(index) {
    return [index % this.width, Math.floor(index / this.width)];
  };

  Map.prototype._addEntityToEmpty = function(type) {
    var i, ref;
    while (true) {
      i = Math.floor(Math.random() * (this._map.length - 1));
      if (((ref = this.getEntityAtIndex(i)) != null ? ref.name : void 0) === 'Empty') {
        break;
      }
    }
    return this.assignEntityToIndex(i, new type(), true);
  };

  Map.prototype._getNeededMaterialCount = function() {
    return Math.floor((this._map.length - this._counts.Edge) * variables.empty_ratio) - this._counts.ComplexMaterial - this._counts.RawMaterial - this._counts.Producer;
  };

  Map.prototype._addMaterial = function() {
    return this._addEntityToEmpty(RawMaterialEntity);
  };

  Map.prototype._addComplexMaterial = function() {
    return this._addEntityToEmpty(ComplexMaterialEntity);
  };

  Map.prototype._addRoamer = function() {
    return this._addEntityToEmpty(RoamingEntity);
  };

  Map.prototype._addProducer = function() {
    return this._addEntityToEmpty(ProducerEntity);
  };

  Map.prototype.$$dumpMap = function() {
    return console.debug(this._map);
  };

  return Map;

})();

module.exports = Map;


},{"../entities/ComplexMaterialEntity":3,"../entities/EmptyEntity":5,"../entities/ProducerEntity":8,"../entities/RawMaterialEntity":9,"../entities/RoamingEntity":10,"./border":12,"./flow":13,"./shuffleArray":16,"./variableHolder":17}],16:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Simple way to shuffle array
 */
module.exports = function(array) {
  var counter, index, temp;
  counter = array.length;
  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
};


},{}],17:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Holder for variables.
 */
var variables;

variables = {
  Map: {
    empty_ratio: .15,
    chance_producer_spawn: 100,
    chance_roamer_spawn: 200
  },
  ProducerEntity: {
    starting_life: 200,
    life_gain_per_food: 1200,
    life_to_reproduce: 600,
    life_loss_to_reproduce: 400,
    max_life: 600,
    min_life_to_transfer: 50,
    max_life_transfer: 50,
    eating_cooldown: 10,
    age_to_reproduce: 80,
    old_age_death_multiplier: 10000000
  },
  RoamingEntity: {
    stuck_ticks: 20,
    stuck_cooldown: 20,
    starting_health_fresh: 100,
    starting_health_clone: 20,
    max_life: 200,
    life_gain_per_food: 25,
    life_to_reproduce: 200,
    life_loss_to_reproduce: 50
  }
};

module.exports = variables;


},{}],18:[function(require,module,exports){

/*
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Handles communication between the map and the main thread. Also instructs the
  map when to tick.
 */
var FPS, Map, fps, getVariables, init, map, map_tick_int, running, sendImageData, sendTPS, setFlowType, start, stop, target_tps, tick, updateVariable, variables;

Map = require('./lib/map');

FPS = require('./lib/fps');

variables = require('./lib/variableHolder');

target_tps = 40;

map = null;

running = false;

map_tick_int = -1;

fps = FPS();

tick = function() {
  map.tick();
  fps.tick();
  return null;
};

init = function(width, height, seed, flow) {
  Math.random = require('seedrandom/lib/alea')(seed);
  map = new Map(width, height, flow);
  return self.postMessage(['initialized']);
};

start = function() {
  running = true;
  fps = FPS();
  self.postMessage(['started']);
  clearInterval(map_tick_int);
  return map_tick_int = setInterval(tick, 1000 / target_tps);
};

stop = function() {
  running = false;
  clearInterval(map_tick_int);
  return self.postMessage(['stopped']);
};

sendImageData = function() {
  return self.postMessage(['imageData', map.getRender()]);
};

sendTPS = function() {
  return self.postMessage(['tpm', fps.getFps()]);
};

updateVariable = function(type, variable, value) {
  console.debug("Updating " + type + "." + variable + " to " + value);
  return variables[type][variable] = value;
};

getVariables = function() {
  return self.postMessage(['variables', variables]);
};

setFlowType = function(type) {
  return map.setFlowType(type);
};

self.onmessage = function(e) {
  switch (e.data[0]) {
    case 'init':
      return init(e.data[1], e.data[2], e.data[3], e.data[4]);
    case 'start':
      return start();
    case 'stop':
      return stop();
    case 'sendImageData':
      return sendImageData();
    case 'sendTPS':
      return sendTPS();
    case 'updateVariable':
      return updateVariable(e.data[1], e.data[2], e.data[3]);
    case 'getVariables':
      return getVariables();
    case 'setFlowType':
      return setFlowType(e.data[1]);
    default:
      return console.error("Unknown Command " + e.data[0]);
  }
};


},{"./lib/fps":14,"./lib/map":15,"./lib/variableHolder":17,"seedrandom/lib/alea":1}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvc2VlZHJhbmRvbS9saWIvYWxlYS5qcyIsInNyYy9lbnRpdGllcy9CYXNlRW50aXR5LmNvZmZlZSIsInNyYy9lbnRpdGllcy9Db21wbGV4TWF0ZXJpYWxFbnRpdHkuY29mZmVlIiwic3JjL2VudGl0aWVzL0VkZ2VFbnRpdHkuY29mZmVlIiwic3JjL2VudGl0aWVzL0VtcHR5RW50aXR5LmNvZmZlZSIsInNyYy9lbnRpdGllcy9GbG93aW5nRW50aXR5LmNvZmZlZSIsInNyYy9lbnRpdGllcy9MaXZpbmdFbnRpdHkuY29mZmVlIiwic3JjL2VudGl0aWVzL1Byb2R1Y2VyRW50aXR5LmNvZmZlZSIsInNyYy9lbnRpdGllcy9SYXdNYXRlcmlhbEVudGl0eS5jb2ZmZWUiLCJzcmMvZW50aXRpZXMvUm9hbWluZ0VudGl0eS5jb2ZmZWUiLCJzcmMvbGliL1NpbXBsZTFETm9pc2UuY29mZmVlIiwic3JjL2xpYi9ib3JkZXIuY29mZmVlIiwic3JjL2xpYi9mbG93LmNvZmZlZSIsInNyYy9saWIvZnBzLmNvZmZlZSIsInNyYy9saWIvbWFwLmNvZmZlZSIsInNyYy9saWIvc2h1ZmZsZUFycmF5LmNvZmZlZSIsInNyYy9saWIvdmFyaWFibGVIb2xkZXIuY29mZmVlIiwic3JjL3Byb2Nlc3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QVRQO0FBRGUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQSBwb3J0IG9mIGFuIGFsZ29yaXRobSBieSBKb2hhbm5lcyBCYWFnw7hlIDxiYWFnb2VAYmFhZ29lLmNvbT4sIDIwMTBcbi8vIGh0dHA6Ly9iYWFnb2UuY29tL2VuL1JhbmRvbU11c2luZ3MvamF2YXNjcmlwdC9cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ucXVpbmxhbi9iZXR0ZXItcmFuZG9tLW51bWJlcnMtZm9yLWphdmFzY3JpcHQtbWlycm9yXG4vLyBPcmlnaW5hbCB3b3JrIGlzIHVuZGVyIE1JVCBsaWNlbnNlIC1cblxuLy8gQ29weXJpZ2h0IChDKSAyMDEwIGJ5IEpvaGFubmVzIEJhYWfDuGUgPGJhYWdvZUBiYWFnb2Uub3JnPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vIFxuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy8gXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuXG5cbihmdW5jdGlvbihnbG9iYWwsIG1vZHVsZSwgZGVmaW5lKSB7XG5cbmZ1bmN0aW9uIEFsZWEoc2VlZCkge1xuICB2YXIgbWUgPSB0aGlzLCBtYXNoID0gTWFzaCgpO1xuXG4gIG1lLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdCA9IDIwOTE2MzkgKiBtZS5zMCArIG1lLmMgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuICAgIG1lLnMwID0gbWUuczE7XG4gICAgbWUuczEgPSBtZS5zMjtcbiAgICByZXR1cm4gbWUuczIgPSB0IC0gKG1lLmMgPSB0IHwgMCk7XG4gIH07XG5cbiAgLy8gQXBwbHkgdGhlIHNlZWRpbmcgYWxnb3JpdGhtIGZyb20gQmFhZ29lLlxuICBtZS5jID0gMTtcbiAgbWUuczAgPSBtYXNoKCcgJyk7XG4gIG1lLnMxID0gbWFzaCgnICcpO1xuICBtZS5zMiA9IG1hc2goJyAnKTtcbiAgbWUuczAgLT0gbWFzaChzZWVkKTtcbiAgaWYgKG1lLnMwIDwgMCkgeyBtZS5zMCArPSAxOyB9XG4gIG1lLnMxIC09IG1hc2goc2VlZCk7XG4gIGlmIChtZS5zMSA8IDApIHsgbWUuczEgKz0gMTsgfVxuICBtZS5zMiAtPSBtYXNoKHNlZWQpO1xuICBpZiAobWUuczIgPCAwKSB7IG1lLnMyICs9IDE7IH1cbiAgbWFzaCA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIGNvcHkoZiwgdCkge1xuICB0LmMgPSBmLmM7XG4gIHQuczAgPSBmLnMwO1xuICB0LnMxID0gZi5zMTtcbiAgdC5zMiA9IGYuczI7XG4gIHJldHVybiB0O1xufVxuXG5mdW5jdGlvbiBpbXBsKHNlZWQsIG9wdHMpIHtcbiAgdmFyIHhnID0gbmV3IEFsZWEoc2VlZCksXG4gICAgICBzdGF0ZSA9IG9wdHMgJiYgb3B0cy5zdGF0ZSxcbiAgICAgIHBybmcgPSB4Zy5uZXh0O1xuICBwcm5nLmludDMyID0gZnVuY3Rpb24oKSB7IHJldHVybiAoeGcubmV4dCgpICogMHgxMDAwMDAwMDApIHwgMDsgfVxuICBwcm5nLmRvdWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBwcm5nKCkgKyAocHJuZygpICogMHgyMDAwMDAgfCAwKSAqIDEuMTEwMjIzMDI0NjI1MTU2NWUtMTY7IC8vIDJeLTUzXG4gIH07XG4gIHBybmcucXVpY2sgPSBwcm5nO1xuICBpZiAoc3RhdGUpIHtcbiAgICBpZiAodHlwZW9mKHN0YXRlKSA9PSAnb2JqZWN0JykgY29weShzdGF0ZSwgeGcpO1xuICAgIHBybmcuc3RhdGUgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvcHkoeGcsIHt9KTsgfVxuICB9XG4gIHJldHVybiBwcm5nO1xufVxuXG5mdW5jdGlvbiBNYXNoKCkge1xuICB2YXIgbiA9IDB4ZWZjODI0OWQ7XG5cbiAgdmFyIG1hc2ggPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIG4gKz0gZGF0YS5jaGFyQ29kZUF0KGkpO1xuICAgICAgdmFyIGggPSAwLjAyNTE5NjAzMjgyNDE2OTM4ICogbjtcbiAgICAgIG4gPSBoID4+PiAwO1xuICAgICAgaCAtPSBuO1xuICAgICAgaCAqPSBuO1xuICAgICAgbiA9IGggPj4+IDA7XG4gICAgICBoIC09IG47XG4gICAgICBuICs9IGggKiAweDEwMDAwMDAwMDsgLy8gMl4zMlxuICAgIH1cbiAgICByZXR1cm4gKG4gPj4+IDApICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcbiAgfTtcblxuICByZXR1cm4gbWFzaDtcbn1cblxuXG5pZiAobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gaW1wbDtcbn0gZWxzZSBpZiAoZGVmaW5lICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gaW1wbDsgfSk7XG59IGVsc2Uge1xuICB0aGlzLmFsZWEgPSBpbXBsO1xufVxuXG59KShcbiAgdGhpcyxcbiAgKHR5cGVvZiBtb2R1bGUpID09ICdvYmplY3QnICYmIG1vZHVsZSwgICAgLy8gcHJlc2VudCBpbiBub2RlLmpzXG4gICh0eXBlb2YgZGVmaW5lKSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZSAgIC8vIHByZXNlbnQgd2l0aCBhbiBBTUQgbG9hZGVyXG4pO1xuXG5cbiIsIiMjI1xuICBjb2xvci1wb25kXG4gIEtldmluIEdyYXZpZXIgMjAxNlxuICBHUEwtMy4wIExpY2Vuc2VcblxuICBCYXNlRW50aXR5IGlzIHRoZSByb290IGNsYXNzIHRoYXQgYWxsIEVudGl0aWVzIHdpbGwgZXZlbnR1YWxseSBleHRlbnQgZnJvbS5cbiAgSXQgaW1wbGVtZW50cyBhbGwgdGhlIHJlcXVpcmVkIHB1YmxpYyBmdW5jdGlvbnMgZm9yIGFuIGVudGl0eSB0byBleGlzdFxuIyMjXG5cbmNsYXNzIEJhc2VFbnRpdHlcbiAgbmFtZTogJ0Jhc2UnXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGlzX21vdmVhYmxlID0gdHJ1ZVxuICAgIEBpc19kZWxldGVkID0gZmFsc2VcbiAgICBAY29sb3IgPSBbMCwgMCwgMCwgMjU1XVxuXG4gIGluaXQ6IChtYXAsIGluZGV4KSAtPlxuICAgIEBtYXAgPSBtYXBcbiAgICBAbW92ZWQoaW5kZXgpXG4gICAgQHNldENvbG9yIEBjb2xvclswXSwgQGNvbG9yWzFdLCBAY29sb3JbMl0sIEBjb2xvclszXVxuICAgIHRydWVcblxuICAjIFdoZW4gYW4gZW50aXR5IGlzIG1vdmVkIG9uIHRoZSBtYXAsIHdlIHVwZGF0ZSB0aGUgcmVmZXJlbmNlIHRvIHRoZSBpbmRleCwgY2FsY3VsYXRlXG4gICMgdGhlIHh5IHBvaW50LCBhbmQgc2V0IHRoZSBjb2xvci5cbiAgbW92ZWQ6IChuZXdfaW5kZXgpIC0+XG4gICAgQG1hcF9pbmRleCA9IG5ld19pbmRleFxuICAgIFtAbWFwX3gsIEBtYXBfeV0gPSBAbWFwLl9pbmRleFRvUG9pbnQobmV3X2luZGV4KVxuICAgIEBzZXRDb2xvciBAY29sb3JbMF0sIEBjb2xvclsxXSwgQGNvbG9yWzJdLCBAY29sb3JbM11cbiAgICB0cnVlXG5cbiAgc2V0Q29sb3I6IChyLCBnLCBiLCBhKSAtPlxuICAgIHVubGVzcyBAaXNfZGVsZXRlZFxuICAgICAgQGNvbG9yID0gW3IsIGcsIGIsIGFdXG4gICAgICBpbWFnZV9pbmRleCA9IEBtYXBfaW5kZXggKiA0O1xuXG4gICAgICAjIEN1cnJlbnRseSB3cml0ZXMgY29sb3IgZGlyZWN0bHkgdG8gbWFwLiBNYXkgY2hhbmdlIHRoaXMgYXQgc29tZSBwb2ludC5cbiAgICAgICMgVGhpcyBkcmFtYXRpY2FsbHkgcmVkdWNlcyB0aGUgbnVtYmVyIG9mIGFsdGVyYXRpb25zIHRvIHRoZSBtYXAgaW1hZ2Ugb2JqZWN0LlxuICAgICAgIyBNYXkgYWRkIGEgcHVibGljIG1ldGhvZCB0byB0aGUgbWFwIHRvIGRvIHRoaXMuXG4gICAgICBAbWFwLl9pbWFnZVtpbWFnZV9pbmRleF0gPSByXG4gICAgICBAbWFwLl9pbWFnZVtpbWFnZV9pbmRleCArIDFdID0gZ1xuICAgICAgQG1hcC5faW1hZ2VbaW1hZ2VfaW5kZXggKyAyXSA9IGJcbiAgICAgIEBtYXAuX2ltYWdlW2ltYWdlX2luZGV4ICsgM10gPSBhXG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuICB0aWNrOiAtPiB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUVudGl0eSIsIiMjI1xuICBjb2xvci1wb25kXG4gIEtldmluIEdyYXZpZXIgMjAxNlxuICBHUEwtMy4wIExpY2Vuc2VcblxuICBUaGUgQ29tcGxleE1hdGVyaWFsRW50aXR5IHJlcHJlc2VudHMgYSBkZWFkIFByb2R1Y2VyXG4jIyNcblxuRmxvd2luZ0VudGl0eSA9IHJlcXVpcmUgJy4vRmxvd2luZ0VudGl0eSdcblxuY2xhc3MgQ29tcGxleE1hdGVyaWFsRW50aXR5IGV4dGVuZHMgRmxvd2luZ0VudGl0eVxuICBuYW1lOiAnQ29tcGxleE1hdGVyaWFsJ1xuXG4gIGNvbnN0cnVjdG9yOiAoQHR5cGUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMykpLT5cbiAgICBzdXBlclxuICAgIEBpc19tb3ZlYWJsZSA9IGZhbHNlXG4gICAgc3dpdGNoIEB0eXBlXG4gICAgICB3aGVuIDBcbiAgICAgICAgQGNvbG9yID0gWzI1NSwgMCwgMCwgMjU1XVxuICAgICAgd2hlbiAxXG4gICAgICAgIEBjb2xvciA9IFsyNTUsIDUwLCA1MCwgMjU1XVxuICAgICAgd2hlbiAyXG4gICAgICAgIEBjb2xvciA9IFsyNTUsIDEwMCwgMTAwLCAyNTVdXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wbGV4TWF0ZXJpYWxFbnRpdHkiLCIjIyNcbiAgY29sb3ItcG9uZFxuICBLZXZpbiBHcmF2aWVyIDIwMTZcbiAgR1BMLTMuMCBMaWNlbnNlXG5cbiAgVGhlIEVkZ2VFbnRpdHkgaXMgZm9yIHRoZSBlZGdlcyBvZiB0aGUgbWFwXG4jIyNcblxuQmFzZUVudGl0eSA9IHJlcXVpcmUgJy4vQmFzZUVudGl0eSdcblxuY2xhc3MgRWRnZUVudGl0eSBleHRlbmRzIEJhc2VFbnRpdHlcbiAgbmFtZTogJ0VkZ2UnXG4gIHR5cGU6IDBcbiAgY29uc3RydWN0b3I6IChAdHlwZSkgLT5cbiAgICBzdXBlclxuICAgIEBpc19tb3ZlYWJsZSA9IGZhbHNlXG4gICAgQGNvbG9yID0gaWYgQHR5cGUgdGhlbiBbMTAyLCA1MSwgMCwgMjU1XSBlbHNlIFsxMDAsIDE0NiwgMSwgMjU1XVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVkZ2VFbnRpdHkiLCIjIyNcbiAgY29sb3ItcG9uZFxuICBLZXZpbiBHcmF2aWVyIDIwMTZcbiAgR1BMLTMuMCBMaWNlbnNlXG5cbiAgVGhlIEVtcHR5RW50aXR5IGlzIHRoZSBwbGFjZWhvbGRlciBmb3IgZW1wdHkgc3BvdHNcbiMjI1xuXG5CYXNlRW50aXR5ID0gcmVxdWlyZSAnLi9CYXNlRW50aXR5J1xuXG5taW5CcmlnaHRuZXNzID0gMFxubWF4QnJpZ2h0bmVzcyA9IDIwXG5cbmNsYXNzIEVtcHR5RW50aXR5IGV4dGVuZHMgQmFzZUVudGl0eVxuICBuYW1lOiAnRW1wdHknXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXIoKVxuICAgIEBjb2xvciA9IFswLCAwLCAwLCAyNTVdXG5cbiAgdGljazogLT5cbiAgICBzdXBlcigpIGFuZCAoXG4gICAgICBmYWxzZVxuIyAgICAgIGNvbG9ycyA9IEBjb2xvci5jb25jYXQoKVxuIyAgICAgIGluZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpO1xuIyAgICAgIGN1cnJlbnRfY29sb3IgPSBjb2xvcnNbaW5kXTtcbiMgICAgICBpbmNyZW1lbnQgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMykgLSAxKSAqIDNcbiMgICAgICBjb2xvcnNbaW5kXSA9IE1hdGgubWluKG1heEJyaWdodG5lc3MsIE1hdGgubWF4KG1pbkJyaWdodG5lc3MsIGN1cnJlbnRfY29sb3IgKyBpbmNyZW1lbnQpKVxuIyAgICAgIEBzZXRDb2xvcihjb2xvcnNbMF0sIGNvbG9yc1sxXSwgY29sb3JzWzJdLCBjb2xvcnNbM10pXG4gICAgKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gRW1wdHlFbnRpdHkiLCIjIyNcbiAgY29sb3ItcG9uZFxuICBLZXZpbiBHcmF2aWVyIDIwMTZcbiAgR1BMLTMuMCBMaWNlbnNlXG5cbiAgVGhlIEZsb3dpbmdFbnRpdHkgaXMgYSBiYXNlIGVudGl0eSB0byBnaXZlIGFuIGVudGl0eSB0aGUgYWJpbGl0eSB0byBmbG93IHdpdGggdGhlIG1hcCdzIGN1cnJlbnRcbiMjI1xuXG5CYXNlRW50aXR5ID0gcmVxdWlyZSAnLi9CYXNlRW50aXR5J1xuRW1wdHlFbnRpdHkgPSByZXF1aXJlICcuL0VtcHR5RW50aXR5J1xuXG5kaXJlY3Rpb25zID0gWydyaWdodCcsICdkb3duJywgJ2xlZnQnLCAndXAnXVxuXG5jbGFzcyBGbG93aW5nRW50aXR5IGV4dGVuZHMgQmFzZUVudGl0eVxuICBuYW1lOiAnRmxvd2luZydcbiAgY29uc3RydWN0b3I6IC0+IHN1cGVyXG5cblxuICB0aWNrOiAtPlxuICAgIGlmIHN1cGVyKClcbiAgICAgIGRpcmVjdGlvbiA9IGlmIE1hdGgucmFuZG9tKCkgPiAuNSB0aGVuIGRpcmVjdGlvbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCldIGVsc2UgQG1hcC5mbG93KEBtYXBfaW5kZXgpXG5cbiAgICAgIGVudGl0eSA9IEBtYXAuZ2V0RW50aXR5QXREaXJlY3Rpb24oQG1hcF9pbmRleCwgZGlyZWN0aW9uKVxuXG5cbiAgICAgIGlmIGVudGl0eSBhbmQgZW50aXR5LmlzX21vdmVhYmxlXG4gICAgICAgIEBtYXAuc3dhcEVudGl0aWVzKEBtYXBfaW5kZXgsIGVudGl0eS5tYXBfaW5kZXgpXG4jICAgICAgZWxzZSBpZiBlbnRpdHkgYW5kIGVudGl0eS5uYW1lIGlzIFwiRWRnZVwiXG4jICAgICAgICBAbWFwLmFzc2lnbkVudGl0eVRvSW5kZXgoQG1hcF9pbmRleCwgbmV3IEVtcHR5RW50aXR5KCksIHRydWUpXG5cbiAgICAgIHRydWVcbiAgICBlbHNlXG4gICAgICBmYWxzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZsb3dpbmdFbnRpdHkiLCIjIyNcbiAgY29sb3ItcG9uZFxuICBLZXZpbiBHcmF2aWVyIDIwMTZcbiAgR1BMLTMuMCBMaWNlbnNlXG5cbiAgVGhlIExpdmluZ0VudGl0eSBpcyBhIGJhc2UgZW50aXR5IHdoaWNoIGtpbGxzIGFuIGVudGl0eSBhbmQgYWRqdXN0cyB0aGUgdHJhbnNwYXJlbmN5IGJhc2VkIG9uIGhlYWx0aFxuIyMjXG5cbkJhc2VFbnRpdHkgPSByZXF1aXJlICcuL0Jhc2VFbnRpdHknXG5FbXB0eUVudGl0eSA9IHJlcXVpcmUgJy4vRW1wdHlFbnRpdHknXG5cbmNsYXNzIExpdmluZ0VudGl0eSBleHRlbmRzIEJhc2VFbnRpdHlcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgc3VwZXJcbiAgICBAbWF4X2hlYWx0aCA9IDQwMFxuXG4gIGRpZWQ6IC0+XG5cbiAgdGljazogLT5cbiAgICBpZiBzdXBlcigpXG4gICAgICBpZiBAaGVhbHRoIDw9IDBcbiAgICAgICAgQG1hcC5hc3NpZ25FbnRpdHlUb0luZGV4KEBtYXBfaW5kZXgsIG5ldyBFbXB0eUVudGl0eSgpLCB0cnVlKVxuICAgICAgICBAZGllZCgpXG4gICAgICAgIGZhbHNlXG4gICAgICBlbHNlXG4gICAgICAgIEBzZXRDb2xvcihAY29sb3JbMF0sIEBjb2xvclsxXSwgQGNvbG9yWzJdLCBNYXRoLm1pbigyNTUsIDIwICsgTWF0aC5yb3VuZCgoQGhlYWx0aCAvIEBtYXhfaGVhbHRoKSoyMzUpKSlcbiAgICAgICAgdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cbm1vZHVsZS5leHBvcnRzID0gTGl2aW5nRW50aXR5IiwiIyMjXG4gIGNvbG9yLXBvbmRcbiAgS2V2aW4gR3JhdmllciAyMDE2XG4gIEdQTC0zLjAgTGljZW5zZVxuXG4gIFRoZSBQcm9kdWNlckVudGl0eSBpcyBhbiBlbnRpdHkgd2hpY2ggY29uc3VtZXMgUmF3TWF0ZXJpYWwsIHNoYXJlcyBoZWFsdGggd2l0aCBvdGhlciBmcmllbmRseVxuICBQcm9kdWNlcnMsIGFuZCB3aGVuIGRpZXMgdHVybiBpbnRvIGEgQ29tcGxleE1hdGVyaWFsXG4jIyNcblxuTGl2aW5nRW50aXR5ID0gcmVxdWlyZSAnLi9MaXZpbmdFbnRpdHknXG5FbXB0eUVudGl0eSA9IHJlcXVpcmUgJy4vRW1wdHlFbnRpdHknXG5Db21wbGV4TWF0ZXJpYWxFbnRpdHkgPSByZXF1aXJlICcuL0NvbXBsZXhNYXRlcmlhbEVudGl0eSdcbnNodWZmbGUgPSByZXF1aXJlICcuLi9saWIvc2h1ZmZsZUFycmF5J1xudmFyaWFibGVIb2xkZXIgPSByZXF1aXJlKCcuLi9saWIvdmFyaWFibGVIb2xkZXInKS5Qcm9kdWNlckVudGl0eVxuXG5maXhtb2QgPSAobSwgbikgLT4gKChtJW4pK24pJW5cblxuY2xhc3MgUHJvZHVjZXJFbnRpdHkgZXh0ZW5kcyBMaXZpbmdFbnRpdHlcbiAgbmFtZTogJ1Byb2R1Y2VyJ1xuXG4gIGNvbnN0cnVjdG9yOiAoQHdhbnRzID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjMpKS0+XG4gICAgc3VwZXJcbiAgICBAbWFrZXMgPSBmaXhtb2QoQHdhbnRzICsgMSwgMylcbiAgICBAaXNfbW92ZWFibGUgPSBmYWxzZVxuICAgIEBjb2xvciA9IFswLCAyNTUsIDAsIDI1NV1cbiAgICBAaGVhbHRoID0gdmFyaWFibGVIb2xkZXIuc3RhcnRpbmdfbGlmZVxuICAgIEBtYXhfaGVhbHRoID0gdmFyaWFibGVIb2xkZXIubWF4X2xpZmVcbiAgICBAbGFzdF9hdGUgPSAwXG4gICAgQGFnZSA9IDBcblxuICBnZXRTaWRlczogLT5cbiAgICAoQG1hcC5nZXRFbnRpdHlBdERpcmVjdGlvbihAbWFwX2luZGV4LCBzaWRlKSBmb3Igc2lkZSBpbiBzaHVmZmxlIFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J10pXG5cbiAgZWF0OiAoZW50aXRpZXMpIC0+XG4gICAgKFxuICAgICAgQGxhc3RfYXRlID0gMFxuICAgICAgQGFnZSA9IDBcbiAgICAgIEBoZWFsdGggKz0gdmFyaWFibGVIb2xkZXIubGlmZV9nYWluX3Blcl9mb29kXG4gICAgICBAbWFwLmFzc2lnbkVudGl0eVRvSW5kZXgoZW50aXR5Lm1hcF9pbmRleCwgbmV3IEVtcHR5RW50aXR5KCksIHRydWUpXG4gICAgKSBmb3IgZW50aXR5IGluIGVudGl0aWVzIHdoZW4gQGhlYWx0aCA8IEBtYXhfaGVhbHRoXG5cbiAgdHJhbnNmZXJIZWFsdGg6IChlbnRpdGllcykgLT5cbiAgICBmb3IgZW50aXR5IGluIGVudGl0aWVzXG4gICAgICBuZWVkcyA9IChcbiAgICAgICAgaWYgKEBoZWFsdGggPCB2YXJpYWJsZUhvbGRlci5taW5fbGlmZV90b190cmFuc2ZlciBhbmQgZW50aXR5LmhlYWx0aCA+IHZhcmlhYmxlSG9sZGVyLm1pbl9saWZlX3RvX3RyYW5zZmVyKVxuICAgICAgICAgIE1hdGguZmxvb3IoQGhlYWx0aCAqIC45KVxuICAgICAgICBlbHNlIGlmICgoQGhlYWx0aCA8IHZhcmlhYmxlSG9sZGVyLm1pbl9saWZlX3RvX3RyYW5zZmVyIGFuZCBlbnRpdHkuaGVhbHRoIDwgdmFyaWFibGVIb2xkZXIubWluX2xpZmVfdG9fdHJhbnNmZXIpIG9yIChAaGVhbHRoID4gdmFyaWFibGVIb2xkZXIubWluX2xpZmVfdG9fdHJhbnNmZXIgYW5kIGVudGl0eS5oZWFsdGggPiB2YXJpYWJsZUhvbGRlci5taW5fbGlmZV90b190cmFuc2ZlcikpIGFuZCBAaGVhbHRoID4gZW50aXR5LmhlYWx0aFxuICAgICAgICAgIE1hdGgubWluKE1hdGguY2VpbCgoQGhlYWx0aCAtIGVudGl0eS5oZWFsdGgpIC8gMiksIHZhcmlhYmxlSG9sZGVyLm1heF9saWZlX3RyYW5zZmVyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgMFxuICAgICAgKVxuXG4gICAgICBpZiBuZWVkcyA+IDBcbiAgICAgICAgQGhlYWx0aCAtPSBuZWVkc1xuICAgICAgICBlbnRpdHkuaGVhbHRoICs9IG5lZWRzXG5cbiAgICB0cnVlXG5cbiAgYXR0YWNrRW5lbWllczogKGVudGl0aWVzKSAtPlxuICAgIGZvciBlbnRpdHkgaW4gZW50aXRpZXNcbiAgICAgIGVudGl0eS5oZWFsdGggLT0gMTBcblxuICByZXByb2R1Y2U6IChlbnRpdGllcykgLT5cbiAgICAoXG4gICAgICBAaGVhbHRoIC09IHZhcmlhYmxlSG9sZGVyLmxpZmVfbG9zc190b19yZXByb2R1Y2VcbiAgICAgIEBtYXAuYXNzaWduRW50aXR5VG9JbmRleChlbnRpdHkubWFwX2luZGV4LCBuZXcgUHJvZHVjZXJFbnRpdHkoQHdhbnRzKSwgdHJ1ZSlcbiAgICAgIEBhZ2UgPSAwXG4gICAgKSBmb3IgZW50aXR5IGluIGVudGl0aWVzIHdoZW4gQGhlYWx0aCA+PSB2YXJpYWJsZUhvbGRlci5saWZlX3RvX3JlcHJvZHVjZVxuXG4gIGRpZWQ6IC0+XG4gICAgQG1hcC5hc3NpZ25FbnRpdHlUb0luZGV4KEBtYXBfaW5kZXgsIG5ldyBDb21wbGV4TWF0ZXJpYWxFbnRpdHkoQG1ha2VzKSwgdHJ1ZSlcblxuICB0aWNrOiAtPlxuICAgIGlmIHN1cGVyKClcbiAgICAgIEBsYXN0X2F0ZSsrXG4gICAgICBAYWdlKytcblxuICAgICAgc2lkZXMgPSAoZW50aXR5IGZvciBlbnRpdHkgaW4gQGdldFNpZGVzKCkgd2hlbiBlbnRpdHkpXG5cbiAgICAgIGZyaWVuZGx5X2VudGl0aWVzID0gKGVudGl0eSBmb3IgZW50aXR5IGluIHNpZGVzIHdoZW4gZW50aXR5Lm5hbWUgaXMgXCJQcm9kdWNlclwiIGFuZCBlbnRpdHkud2FudHMgaXMgQHdhbnRzIGFuZCBlbnRpdHkubWFrZXMgaXMgQG1ha2VzKVxuICAgICAgZW5lbXlfZW50aXRpZXMgPSAoZW50aXR5IGZvciBlbnRpdHkgaW4gc2lkZXMgd2hlbiBlbnRpdHkubmFtZSBpcyBcIlByb2R1Y2VyXCIgYW5kIGVudGl0eS53YW50cyBpc250IEB3YW50cyBhbmQgZW50aXR5Lm1ha2VzIGlzbnQgQG1ha2VzKVxuXG4gICAgICBpZiBmcmllbmRseV9lbnRpdGllcy5sZW5ndGhcbiAgICAgICAgQHRyYW5zZmVySGVhbHRoKGZyaWVuZGx5X2VudGl0aWVzKVxuXG4gICAgICBpZiBlbmVteV9lbnRpdGllcy5sZW5ndGhcbiAgICAgICAgQGF0dGFja0VuZW1pZXMoZW5lbXlfZW50aXRpZXMpXG5cbiAgICAgIGlmIEBhZ2UgPiB2YXJpYWJsZUhvbGRlci5hZ2VfdG9fcmVwcm9kdWNlIGFuZCBNYXRoLnBvdyhmcmllbmRseV9lbnRpdGllcy5sZW5ndGgrMSwgMikvMTYgPiBNYXRoLnJhbmRvbSgpXG4gICAgICAgIHBsYWNlYWJsZV9lbnRpdGllcyA9IChlbnRpdHkgZm9yIGVudGl0eSBpbiBzaWRlcyB3aGVuIGVudGl0eS5uYW1lIGlzIFwiRW1wdHlcIilcbiAgICAgICAgQHJlcHJvZHVjZShwbGFjZWFibGVfZW50aXRpZXMpXG5cbiAgICAgIGlmIEBsYXN0X2F0ZSA+IHZhcmlhYmxlSG9sZGVyLmVhdGluZ19jb29sZG93blxuICAgICAgICBjb25zdW1hYmxlX2VudGl0aWVzID0gKGVudGl0eSBmb3IgZW50aXR5IGluIHNpZGVzIHdoZW4gZW50aXR5Lm5hbWUgaXMgXCJSYXdNYXRlcmlhbFwiIGFuZCBlbnRpdHkudHlwZSBpcyBAd2FudHMpXG4gICAgICAgIEBlYXQoY29uc3VtYWJsZV9lbnRpdGllcylcblxuICAgICAgaWYgZnJpZW5kbHlfZW50aXRpZXMubGVuZ3RoIGlzIDRcbiAgICAgICAgQGFnZSA9IDBcbiAgICAgICAgQGNvbG9yWzFdID0gMjU1XG4gICAgICAgIEBoZWFsdGggLT0gMVxuICAgICAgZWxzZVxuICAgICAgICBAaGVhbHRoIC09IDVcbiAgICAgICAgQGNvbG9yWzFdID0gMjAwXG5cbiAgICAgIGlmIEBhZ2UgLyB2YXJpYWJsZUhvbGRlci5vbGRfYWdlX2RlYXRoX211bHRpcGxpZXIgPiBNYXRoLnJhbmRvbSgpXG4gICAgICAgIEBkaWVkKClcblxuXG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2R1Y2VyRW50aXR5IiwiIyMjXG4gIGNvbG9yLXBvbmRcbiAgS2V2aW4gR3JhdmllciAyMDE2XG4gIEdQTC0zLjAgTGljZW5zZVxuXG4gIFRoZSBSYXdNYXRlcmlhbEVudGl0eSBpcyBqdXN0IGEgYmx1ZSBmbG93aW5nIGVudGl0eVxuIyMjXG5cbkZsb3dpbmdFbnRpdHkgPSByZXF1aXJlICcuL0Zsb3dpbmdFbnRpdHknXG5cbmNsYXNzIFJhd01hdGVyaWFsRW50aXR5IGV4dGVuZHMgRmxvd2luZ0VudGl0eVxuICBuYW1lOiAnUmF3TWF0ZXJpYWwnXG5cbiAgY29uc3RydWN0b3I6IChAdHlwZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSozKSkgLT5cbiAgICBzdXBlclxuICAgIHN3aXRjaCBAdHlwZVxuICAgICAgd2hlbiAwXG4gICAgICAgIEBjb2xvciA9IFswLCAwLCAyNTUsIDI1NV1cbiAgICAgIHdoZW4gMVxuICAgICAgICBAY29sb3IgPSBbNTAsIDUwLCAyNTUsIDI1NV1cbiAgICAgIHdoZW4gMlxuICAgICAgICBAY29sb3IgPSBbMTAwLCAxMDAsIDI1NSwgMjU1XVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhd01hdGVyaWFsRW50aXR5IiwiIyMjXG4gIGNvbG9yLXBvbmRcbiAgS2V2aW4gR3JhdmllciAyMDE2XG4gIEdQTC0zLjAgTGljZW5zZVxuXG4gIFRoZSBSb2FtaW5nRW50aXR5IGlzIGFuIGVudGl0eSB3aGljaCB3aWxsIGh1bnQgb3V0IENvbXBsZXhNYXRlcmlhbCBhbmQgdHVybiBpdCBiYWNrIGludG8gUmF3TWF0ZXJpYWxcbiMjI1xuXG5MaXZpbmdFbnRpdHkgPSByZXF1aXJlICcuL0xpdmluZ0VudGl0eSdcbkVtcHR5RW50aXR5ID0gcmVxdWlyZSAnLi9FbXB0eUVudGl0eSdcbnNodWZmbGUgPSByZXF1aXJlICcuLi9saWIvc2h1ZmZsZUFycmF5J1xuUmF3TWF0ZXJpYWxFbnRpdHkgPSByZXF1aXJlICcuL1Jhd01hdGVyaWFsRW50aXR5J1xudmFyaWFibGVzID0gcmVxdWlyZSgnLi4vbGliL3ZhcmlhYmxlSG9sZGVyLmNvZmZlZScpLlJvYW1pbmdFbnRpdHlcblxuc2VhcmNoX3JhZGl1cyA9IDEwXG5cbmRpcmVjdGlvbnMgPSBbJ3JpZ2h0JywgJ2Rvd24nLCAnbGVmdCcsICd1cCddXG5cbmNsYXNzIFJvYW1pbmdFbnRpdHkgZXh0ZW5kcyBMaXZpbmdFbnRpdHlcbiAgbmFtZTogJ1JvYW1pbmcnXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgc3VwZXIoKVxuICAgIEBtYXhfaGVhbHRoID0gdmFyaWFibGVzLm1heF9saWZlXG4gICAgQGlzX21vdmVhYmxlID0gZmFsc2VcbiAgICBAaGVhbHRoID0gdmFyaWFibGVzLnN0YXJ0aW5nX2hlYWx0aF9mcmVzaFxuICAgIEBjb2xvciA9IFsyNTUsIDI1NSwgMCwgMjU1XVxuICAgIEBzdHVja19jb3VudCA9IDBcbiAgICBAc3R1Y2tfY29vbGRvd24gPSAwXG5cbiAgIyBDaG9vc2UgYSByYW5kb20gZGlyZWN0aW9uXG4gIGNob29zZURpcmVjdGlvbjogLT5cbiAgICBAd2FudGVkX2RpcmVjdGlvbiA9IGRpcmVjdGlvbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCldXG5cbiAgZG9Nb3ZlbWVudDogLT5cbiAgICBzZWxmID0gQFxuXG4gICAgIyBJZiBzdHVjaywgY2hvb3NlIGEgZGlyZWN0aW9uIGFuZCBzZXQgdGhlIGNvb2xkb3duXG4gICAgaWYgQHN0dWNrX2NvdW50ID4gdmFyaWFibGVzLnN0dWNrX3RpY2tzXG4gICAgICBAY2hvb3NlRGlyZWN0aW9uKClcbiAgICAgIEBzdHVja19jb29sZG93biA9IHZhcmlhYmxlcy5zdHVja19jb29sZG93blxuXG4gICAgIyBpZiBzdHVjaywgcmV0dXJuIHRoZSB3YW50ZWQgZGlyZWN0aW9uXG4gICAgaWYgQHN0dWNrX2Nvb2xkb3duID4gMFxuICAgICAgQHN0dWNrX2Nvb2xkb3duLS1cbiAgICAgIEB3YW50ZWRfZGlyZWN0aW9uXG5cbiAgICAjIEZpZ3VyZSBvdXQgYSBkaXJlY3Rpb24gYnkgc2VhcmNoaW5nIGZvciBDb21wbGV4TWF0ZXJpYWxcbiAgICBkaXJlY3Rpb24gPSAoXG4gICAgICBpZiBAc3R1Y2tfY29vbGRvd24gPiAwXG4gICAgICAgIEBzdHVja19jb29sZG93bi0tXG4gICAgICAgIGZhbHNlXG4gICAgICBlbHNlXG4gICAgICAgICMgRmluZCB0aGUgbWluIGFuZCBtYXggeCBhbmQgeSBmcm9tIHNlYXJjaCByYWRpdXNcbiAgICAgICAgeF9uZWcgPSBNYXRoLm1heChAbWFwX3ggLSBzZWFyY2hfcmFkaXVzLCAwKVxuICAgICAgICB5X25lZyA9IE1hdGgubWF4KEBtYXBfeSAtIHNlYXJjaF9yYWRpdXMsIDApXG4gICAgICAgIHhfcG9zID0gTWF0aC5taW4oQG1hcF94ICsgc2VhcmNoX3JhZGl1cywgQG1hcC53aWR0aClcbiAgICAgICAgeV9wb3MgPSBNYXRoLm1pbihAbWFwX3kgKyBzZWFyY2hfcmFkaXVzLCBAbWFwLmhlaWdodClcblxuICAgICAgICBhbGxfZW50aXRpZXMgPSBbXVxuXG4gICAgICAgICMgR2V0IGFsbCBlbnRpdGllcyBmcm9tIG1hcCBpbiByYWRpdXNcbiAgICAgICAgZm9yIHkgaW4gW3lfbmVnIC4uIHlfcG9zXVxuICAgICAgICAgIGFsbF9lbnRpdGllcyA9IGFsbF9lbnRpdGllcy5jb25jYXQoc2VsZi5tYXAuZ2V0RW50aXRpZXNJblJhbmdlKHNlbGYubWFwLl9wb2ludFRvSW5kZXgoeF9uZWcsIHkpLCBzZWxmLm1hcC5fcG9pbnRUb0luZGV4KHhfcG9zLCB5KSkpXG5cbiAgICAgICAgIyBGaWx0ZXIgb3V0IHRvIG9ubHkgQ29tcGxleE1hdGVyaWFsXG4gICAgICAgIGZpbHRlcmVkX2VudGl0aWVzID0gYWxsX2VudGl0aWVzLmZpbHRlciAoZW50aXR5KSAtPlxuICAgICAgICAgIGVudGl0eS5uYW1lIGlzICdDb21wbGV4TWF0ZXJpYWwnXG5cbiAgICAgICAgIyBTb3J0IHRoZW0gYnkgZGlzdGFuY2UgZnJvbSBzZWxmXG4gICAgICAgIGZpbHRlcmVkX2VudGl0aWVzLnNvcnQgKGVudF9hLCBlbnRfYikgLT5cbiAgICAgICAgICBhX2Rpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KGVudF9hLm1hcF94IC0gc2VsZi5tYXBfeCwgMikgKyBNYXRoLnBvdyhlbnRfYS5tYXBfeSAtIHNlbGYubWFwX3ksIDIpKVxuICAgICAgICAgIGJfZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coZW50X2IubWFwX3ggLSBzZWxmLm1hcF94LCAyKSArIE1hdGgucG93KGVudF9iLm1hcF95IC0gc2VsZi5tYXBfeSwgMikpXG5cbiAgICAgICAgICBpZiBhX2Rpc3RhbmNlIDwgYl9kaXN0YW5jZSB0aGVuIC0xXG4gICAgICAgICAgZWxzZSBpZiBhX2Rpc3RhbmNlID4gYl9kaXN0YW5jZSB0aGVuIDFcbiAgICAgICAgICBlbHNlIDBcblxuICAgICAgICAjIElmIHRoZXJlIGFyZSBhbnkgZW50aXRpZXMsIGdldCB0aGUgY2xvc2VzdCBvbmUgYW5kIGZpZ3VyZSBvdXQgd2hpY2ggZGlyZWN0aW9uXG4gICAgICAgICMgaXMgbmVlZGVkIHRvIGdldCBjbG9zZXIgdG8gdGhlIGVudGl0eVxuICAgICAgICBpZiBmaWx0ZXJlZF9lbnRpdGllcy5sZW5ndGhcbiAgICAgICAgICB0YXJnZXRfZW50aXR5ID0gZmlsdGVyZWRfZW50aXRpZXNbMF1cbiAgICAgICAgICBkeCA9IHRhcmdldF9lbnRpdHkubWFwX3ggLSBzZWxmLm1hcF94XG4gICAgICAgICAgZHkgPSB0YXJnZXRfZW50aXR5Lm1hcF95IC0gc2VsZi5tYXBfeVxuXG4gICAgICAgICAgaWYgTWF0aC5hYnMoZHgpID4gTWF0aC5hYnMoZHkpXG4gICAgICAgICAgICBpZiBkeCA+IDAgdGhlbiAncmlnaHQnIGVsc2UgJ2xlZnQnXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgZHkgPiAwIHRoZW4gJ2Rvd24nIGVsc2UgJ3VwJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZmFsc2VcbiAgICApXG5cbiAgICAjIGlmIG5vIGRpcmVjdGlvbiBmb3VuZCBjaG9vc2UgYSByYW5kb20gb25lXG4gICAgdW5sZXNzIGRpcmVjdGlvblxuICAgICAgaWYgTWF0aC5yYW5kb20oKSA+IC45IHRoZW4gQGNob29zZURpcmVjdGlvbigpXG4gICAgICBkaXJlY3Rpb24gPSBAd2FudGVkX2RpcmVjdGlvblxuXG4gICAgZW50aXR5ID0gQG1hcC5nZXRFbnRpdHlBdERpcmVjdGlvbihAbWFwX2luZGV4LCBkaXJlY3Rpb24pO1xuXG4gICAgaWYgZW50aXR5IGFuZCBlbnRpdHkubmFtZSBpc250ICdFZGdlJ1xuICAgICAgQG1hcC5zd2FwRW50aXRpZXMgQG1hcF9pbmRleCwgZW50aXR5Lm1hcF9pbmRleFxuICAgICAgQHN0dWNrX2NvdW50ID0gMFxuICAgIGVsc2VcbiAgICAgIEBzdHVja19jb3VudCsrXG5cbiAgY29uc3VtZU1hdGVyaWFsOiAtPlxuICAgIChcbiAgICAgIGVudGl0eSA9IEBtYXAuZ2V0RW50aXR5QXREaXJlY3Rpb24oQG1hcF9pbmRleCwgc2lkZSlcblxuICAgICAgaWYgZW50aXR5XG4gICAgICAgIGlmIGVudGl0eS5uYW1lIGlzICdDb21wbGV4TWF0ZXJpYWwnXG4gICAgICAgICAgQG1hcC5hc3NpZ25FbnRpdHlUb0luZGV4KGVudGl0eS5tYXBfaW5kZXgsIG5ldyBSYXdNYXRlcmlhbEVudGl0eShlbnRpdHkudHlwZSksIHRydWUpXG4gICAgICAgICAgQGhlYWx0aCArPSB2YXJpYWJsZXMubGlmZV9nYWluX3Blcl9mb29kXG4gICAgKSBmb3Igc2lkZSBpbiBzaHVmZmxlIFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J11cblxuICByZXByb2R1Y2U6IC0+XG4gICAgaWYgQGhlYWx0aCA+IHZhcmlhYmxlcy5saWZlX3RvX3JlcHJvZHVjZVxuICAgICAgKFxuICAgICAgICBlbnRpdHkgPSBAbWFwLmdldEVudGl0eUF0RGlyZWN0aW9uKEBtYXBfaW5kZXgsIHNpZGUpXG5cbiAgICAgICAgaWYgZW50aXR5IGFuZCBlbnRpdHkubmFtZSBpcyAnRW1wdHknXG4gICAgICAgICAgICBjaGlsZCA9IG5ldyBSb2FtaW5nRW50aXR5KClcbiAgICAgICAgICAgIGNoaWxkLmhlYWx0aCA9IHZhcmlhYmxlcy5zdGFydGluZ19oZWFsdGhfY2xvbmVcbiAgICAgICAgICAgIEBtYXAuYXNzaWduRW50aXR5VG9JbmRleChlbnRpdHkubWFwX2luZGV4LCBjaGlsZCAsIHRydWUpXG4gICAgICAgICAgICBAaGVhbHRoIC09IHZhcmlhYmxlcy5saWZlX2xvc3NfdG9fcmVwcm9kdWNlXG4gICAgICAgICAgICBicmVha1xuICAgICAgKSBmb3Igc2lkZSBpbiBzaHVmZmxlIFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J11cblxuICAgIHRydWVcblxuICB0aWNrOiAtPlxuICAgIGlmIHN1cGVyKClcbiAgICAgIEBjb25zdW1lTWF0ZXJpYWwoKVxuICAgICAgQGRvTW92ZW1lbnQoKVxuICAgICAgQHJlcHJvZHVjZSgpXG4gICAgICBAaGVhbHRoLS1cbiAgICBlbHNlXG4gICAgICBmYWxzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvYW1pbmdFbnRpdHlcbiIsIiMjI1xuICBjb2xvci1wb25kXG4gIEtldmluIEdyYXZpZXIgMjAxNlxuICBHUEwtMy4wIExpY2Vuc2VcblxuICBQcmVkaWN0YWJsZSAxZCBub2lzZSBtYWtlclxuXG4gIFJldHJpZXZlZCBmcm9tIGh0dHA6Ly93d3cubWljaGFlbGJyb21sZXkuY28udWsvYXBpLzkwL3NpbXBsZS0xZC1ub2lzZS1pbi1qYXZhc2NyaXB0XG4gIE1vZGlmaWVkIHRvIGJlIGEgcmUtdXNhYmxlIGNsYXNzXG4jIyNcblxubGVycCA9IChhLCBiLCB0KSAtPlxuICBhICogKDEgLSB0KSArIGIgKiB0XG5cblxuY2xhc3MgU2ltcGxlMUROb2lzZVxuICBNQVhfVkVSVElDRVM6IDI1NlxuICBNQVhfVkVSVElDRVNfTUFTSzogMjU1XG4gIGFtcGxpdHVkZTogMVxuICBzY2FsZTogLjAxNVxuICByOiBbXVxuXG4gIGNvbnN0cnVjdG9yOiAoQGFtcGxpdHVkZSwgQHNjYWxlKSAtPlxuICAgIGZvciBpIGluIFswIC4uIEBNQVhfVkVSVElDRVNdXG4gICAgICBAci5wdXNoIE1hdGgucmFuZG9tKClcblxuICBnZXRWYWw6ICh4KSA9PlxuICAgIHNjYWxlZFggPSB4ICogQHNjYWxlXG4gICAgeEZsb29yID0gTWF0aC5mbG9vcihzY2FsZWRYKVxuICAgIHQgPSBzY2FsZWRYIC0geEZsb29yXG4gICAgdFJlbWFwU21vb3Roc3RlcCA9IHQgKiB0ICogKDMgLSAoMiAqIHQpKVxuICAgICMvIE1vZHVsbyB1c2luZyAmXG4gICAgeE1pbiA9IHhGbG9vciAmIEBNQVhfVkVSVElDRVNfTUFTS1xuICAgIHhNYXggPSB4TWluICsgMSAmIEBNQVhfVkVSVElDRVNfTUFTS1xuICAgIHkgPSBsZXJwKEByW3hNaW5dLCBAclt4TWF4XSwgdFJlbWFwU21vb3Roc3RlcClcbiAgICB5ICogQGFtcGxpdHVkZVxuXG5tb2R1bGUuZXhwb3J0cyA9IChhbXBsaXR1ZGUsIHNjYWxlKSAtPiBuZXcgU2ltcGxlMUROb2lzZShhbXBsaXR1ZGUsIHNjYWxlKSIsIkVkZ2VFbnRpdHkgPSByZXF1aXJlICcuLi9lbnRpdGllcy9FZGdlRW50aXR5J1xuXG5TaW1wbGUxRE5vaXNlID0gcmVxdWlyZSAnLi9TaW1wbGUxRE5vaXNlJ1xuXG53b3JrSW4gPSAobWFwLCBzeCwgc3ksIGF4aXMsIGRpcmVjdGlvbikgLT5cbiAgbG9vcFxuICAgIGluZGV4ID0gbWFwLl9wb2ludFRvSW5kZXgoc3gsIHN5KVxuICAgIGVudGl0eSA9IG1hcC5nZXRFbnRpdHlBdEluZGV4KGluZGV4KVxuICAgIGlmIGVudGl0eS5uYW1lIGlzbnQgJ0VkZ2UnXG4gICAgICBtYXAuYXNzaWduRW50aXR5VG9JbmRleChpbmRleCwgbmV3IEVkZ2VFbnRpdHkoMCksIHRydWUpXG5cbiAgICBicmVhayBpZiBub3QgZW50aXR5IG9yICggZW50aXR5Lm5hbWUgaXMgJ0VkZ2UnIGFuZCBlbnRpdHkudHlwZSBpcyAxIClcblxuICAgIHN3aXRjaCBheGlzXG4gICAgICB3aGVuICd4J1xuICAgICAgICBzeCA9IGlmIGRpcmVjdGlvbiB0aGVuIHN4ICsgMSBlbHNlIHN4IC0gMVxuICAgICAgd2hlbiAneSdcbiAgICAgICAgc3kgPSBpZiBkaXJlY3Rpb24gdGhlbiBzeSArIDEgZWxzZSBzeSAtIDFcblxuXG5cbm1ha2VCb3JkZXIgPSAobWFwKSAtPlxuICB4X2NlbnRlciA9IE1hdGgucm91bmQobWFwLndpZHRoIC8gMik7XG4gIHlfY2VudGVyID0gTWF0aC5yb3VuZChtYXAuaGVpZ2h0IC8gMik7XG5cbiAgbWluX3JhZGl1cyA9IE1hdGguZmxvb3IoTWF0aC5taW4obWFwLndpZHRoLCBtYXAuaGVpZ2h0KSAvIDIpICogLjhcblxuICByYWRpdXNfbm9pc2UgPSBTaW1wbGUxRE5vaXNlKDEwLCAuMDUpXG4gIGRpcnRfbm9pc2UgPSBTaW1wbGUxRE5vaXNlKDEwLCAuMDIpXG5cbiAgbXVsdGkgPSA0XG5cbiAgZm9yIHAgaW4gWzAgLi4uIDM2MCptdWx0aV1cbiAgICByYWQgPSAocC9tdWx0aSkgKiBNYXRoLlBJIC8gMTgwXG5cbiAgICByYWRpdXNfb2Zmc2V0ID0gcmFkaXVzX25vaXNlLmdldFZhbChwKVxuICAgIG5vaXNlZF9yYWRpdXMgPSBtaW5fcmFkaXVzICsgcmFkaXVzX29mZnNldFxuXG4gICAgZGlydF9kZXB0aCA9IE1hdGgucm91bmQgTWF0aC5tYXggMSwgZGlydF9ub2lzZS5nZXRWYWwgcFxuXG4gICAgY29uc29sZS5sb2cgZGlydF9kZXB0aFxuXG4gICAgZm9yIGQgaW4gWzAgLi4uIGRpcnRfZGVwdGhdXG4gICAgICB4ID0gTWF0aC5yb3VuZCh4X2NlbnRlciArIChub2lzZWRfcmFkaXVzICsgZCkgKiBNYXRoLmNvcyhyYWQpKVxuICAgICAgeSA9IE1hdGgucm91bmQoeV9jZW50ZXIgKyAobm9pc2VkX3JhZGl1cyArIGQpICogTWF0aC5zaW4ocmFkKSlcblxuICAgICAgaW5kZXggPSBtYXAuX3BvaW50VG9JbmRleCh4LCB5KVxuICAgICAgbWFwLmFzc2lnbkVudGl0eVRvSW5kZXgoaW5kZXgsIG5ldyBFZGdlRW50aXR5KDEpLCB0cnVlKVxuXG5cbiAgZm9yIGkgaW4gWyAwIC4uLiBNYXRoLm1heCh4X2NlbnRlciArIDEsIHlfY2VudGVyICsgMSldXG4gICAgI3RvcC9ib3R0b21cbiAgICBpZiB4X2NlbnRlciAtIGkgPj0gMFxuICAgICAgd29ya0luIG1hcCwgeF9jZW50ZXIgLSBpICwgMCwgJ3knLCB0cnVlXG4gICAgICB3b3JrSW4gbWFwLCB4X2NlbnRlciAtIGkgLCBtYXAuaGVpZ2h0IC0gMSwgJ3knLCBmYWxzZVxuICAgIGlmIHhfY2VudGVyICsgaSA8IG1hcC5oZWlnaHRcbiAgICAgIHdvcmtJbiBtYXAsIHhfY2VudGVyICsgaSAsIDAsICd5JywgdHJ1ZVxuICAgICAgd29ya0luIG1hcCwgeF9jZW50ZXIgKyBpICwgbWFwLmhlaWdodCAtIDEsICd5JywgZmFsc2VcblxuICAgICNsZWZ0L3JpZ2h0XG4gICAgaWYgeV9jZW50ZXIgLSBpID49IDBcbiAgICAgIHdvcmtJbiBtYXAsIDAsIHlfY2VudGVyIC0gaSAsICd4JywgdHJ1ZVxuICAgICAgd29ya0luIG1hcCwgbWFwLndpZHRoIC0gMSwgeV9jZW50ZXIgLSBpICwgJ3gnLCBmYWxzZVxuICAgIGlmIHlfY2VudGVyICsgaSA8IG1hcC5oZWlnaHRcbiAgICAgIHdvcmtJbiBtYXAsIDAsIHlfY2VudGVyICsgaSAsICd4JywgdHJ1ZVxuICAgICAgd29ya0luIG1hcCwgbWFwLndpZHRoIC0gMSwgeV9jZW50ZXIgKyBpICwgJ3gnLCBmYWxzZVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBtYWtlQm9yZGVyIiwiIyMjXG4gIGNvbG9yLXBvbmRcbiAgS2V2aW4gR3JhdmllciAyMDE2XG4gIEdQTC0zLjAgTGljZW5zZVxuXG4gIENvbnRhaW5zIGEgc2V0IG9mIGRpZmZlcmVudCBmbG93IGNhbGN1bGF0b3JzLlxuIyMjXG5cbk51bWJlci5wcm90b3R5cGUubW9kID0gKG4pIC0+ICgodGhpcyVuKStuKSVuXG5cbm1vZHVsZS5leHBvcnRzLmR1YWxfc3BpcmFscyA9ICh3aWR0aCwgaGVpZ2h0LCBtYXApIC0+XG4gIGNlbnRlcl94ID0gTWF0aC5mbG9vciB3aWR0aC8yXG4gIGNlbnRlcl95ID0gTWF0aC5mbG9vciBoZWlnaHQvMlxuXG4gIHogPSAxXG5cbiAgKGluZGV4KSAtPlxuXG4gICAgeCA9IGluZGV4ICUgd2lkdGhcbiAgICB5ID0gTWF0aC5mbG9vciBpbmRleCAvIHdpZHRoXG5cbiAgICBkeCA9IHggLSBjZW50ZXJfeFxuICAgIGR5ID0geSAtIGNlbnRlcl95XG5cbiAgICBteCA9IE1hdGguYWJzKGR4KVxuXG4gICAgcSA9IChcbiAgICAgIGlmIGR5ID4gMFxuICAgICAgICBpZiBteCA8IGNlbnRlcl94IC8gMiB0aGVuIDAgZWxzZSAxXG4gICAgICBlbHNlXG4gICAgICAgIGlmIG14ID4gY2VudGVyX3ggLyAyIHRoZW4gMiBlbHNlIDNcbiAgICApXG5cbiAgICByYW5kID0gTWF0aC5yYW5kb20oKSA+PSAuNVxuXG4gICAgaWYgZHggPiAwXG4gICAgICBzd2l0Y2ggcVxuICAgICAgICB3aGVuIDBcbiAgICAgICAgICBpZiByYW5kIHRoZW4gJ3VwJyBlbHNlICdsZWZ0J1xuICAgICAgICB3aGVuIDFcbiAgICAgICAgICBpZiByYW5kIHRoZW4gJ2xlZnQnIGVsc2UgJ2Rvd24nXG4gICAgICAgIHdoZW4gMlxuICAgICAgICAgIGlmIHJhbmQgdGhlbiAnZG93bicgZWxzZSAncmlnaHQnXG4gICAgICAgIHdoZW4gM1xuICAgICAgICAgIGlmIHJhbmQgdGhlbiAncmlnaHQnIGVsc2UgJ3VwJ1xuICAgIGVsc2VcbiAgICAgIHN3aXRjaCBxXG4gICAgICAgIHdoZW4gMFxuICAgICAgICAgIGlmIHJhbmQgdGhlbiAndXAnIGVsc2UgJ3JpZ2h0J1xuICAgICAgICB3aGVuIDFcbiAgICAgICAgICBpZiByYW5kIHRoZW4gJ3JpZ2h0JyBlbHNlICdkb3duJ1xuICAgICAgICB3aGVuIDJcbiAgICAgICAgICBpZiByYW5kIHRoZW4gJ2Rvd24nIGVsc2UgJ2xlZnQnXG4gICAgICAgIHdoZW4gM1xuICAgICAgICAgIGlmIHJhbmQgdGhlbiAnbGVmdCcgZWxzZSAndXAnXG5cblxubW9kdWxlLmV4cG9ydHMub3Bwb3NpdGVfc3BpcmFscyA9ICh3aWR0aCwgaGVpZ2h0LCBtYXApIC0+XG4gIGNlbnRlcl94ID0gTWF0aC5mbG9vciB3aWR0aC8yXG4gIGNlbnRlcl95ID0gTWF0aC5mbG9vciBoZWlnaHQvMlxuXG4gIHogPSAxXG5cbiAgKGluZGV4KSAtPlxuXG4gICAgeCA9IGluZGV4ICUgd2lkdGhcbiAgICB5ID0gTWF0aC5mbG9vciBpbmRleCAvIHdpZHRoXG5cbiAgICBkeCA9IHggLSBjZW50ZXJfeFxuICAgIGR5ID0geSAtIGNlbnRlcl95XG5cbiAgICBteCA9IE1hdGguYWJzKGR4KVxuXG4gICAgcSA9IChcbiAgICAgIGlmIGR5ID4gMFxuICAgICAgICBpZiBteCA8IGNlbnRlcl94IC8gMi41IHRoZW4gMCBlbHNlIDFcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgbXggPiBjZW50ZXJfeCAvIDIuNSB0aGVuIDIgZWxzZSAzXG4gICAgKVxuXG4gICAgcmFuZCA9IE1hdGgucmFuZG9tKCkgPj0gLjQ5XG5cbiAgICBpZiBkeCA+IDBcbiAgICAgIHN3aXRjaCBxXG4gICAgICAgIHdoZW4gMFxuICAgICAgICAgIGlmIHJhbmQgdGhlbiAnbGVmdCcgZWxzZSAndXAnXG4gICAgICAgIHdoZW4gMVxuICAgICAgICAgIGlmIHJhbmQgdGhlbiAnZG93bicgZWxzZSAnbGVmdCdcbiAgICAgICAgd2hlbiAyXG4gICAgICAgICAgaWYgcmFuZCB0aGVuICdyaWdodCcgZWxzZSAnZG93bidcbiAgICAgICAgd2hlbiAzXG4gICAgICAgICAgaWYgcmFuZCB0aGVuICd1cCcgZWxzZSAncmlnaHQnXG4gICAgZWxzZVxuICAgICAgc3dpdGNoIHFcbiAgICAgICAgd2hlbiAwXG4gICAgICAgICAgaWYgcmFuZCB0aGVuICdkb3duJyBlbHNlICdsZWZ0J1xuICAgICAgICB3aGVuIDFcbiAgICAgICAgICBpZiByYW5kIHRoZW4gJ2xlZnQnIGVsc2UgJ3VwJ1xuICAgICAgICB3aGVuIDJcbiAgICAgICAgICBpZiByYW5kIHRoZW4gJ3VwJyBlbHNlICdyaWdodCdcbiAgICAgICAgd2hlbiAzXG4gICAgICAgICAgaWYgcmFuZCB0aGVuICdyaWdodCcgZWxzZSAnZG93bidcblxuXG5cbm1vZHVsZS5leHBvcnRzLnRpZ2h0X3NwaXJhbCA9ICh3aWR0aCwgaGVpZ2h0LCBtYXApIC0+XG4gIGNlbnRlcl94ID0gTWF0aC5mbG9vciB3aWR0aC8yXG4gIGNlbnRlcl95ID0gTWF0aC5mbG9vciBoZWlnaHQvMlxuXG4gIChpbmRleCkgLT5cblxuICAgIHggPSBpbmRleCAlIHdpZHRoXG4gICAgeSA9IE1hdGguZmxvb3IgaW5kZXggLyB3aWR0aFxuXG4gICAgZHggPSB4IC0gY2VudGVyX3hcbiAgICBkeSA9IHkgLSBjZW50ZXJfeVxuXG4gICAgaWYgZHggPiAwIGFuZCBkeSA+PSAwXG4gICAgICBpZiBNYXRoLnJhbmRvbSgpIDwgTWF0aC5hYnMoZHgpIC8gY2VudGVyX3hcbiAgICAgICAgJ3VwJ1xuICAgICAgZWxzZVxuICAgICAgICAncmlnaHQnXG4gICAgZWxzZSBpZiBkeCA+PSAwIGFuZCBkeSA8IDBcbiAgICAgIGlmIE1hdGgucmFuZG9tKCkgPCBNYXRoLmFicyhkeSkgLyBjZW50ZXJfeVxuICAgICAgICAnbGVmdCdcbiAgICAgIGVsc2VcbiAgICAgICAgJ3VwJ1xuICAgIGVsc2UgaWYgZHggPCAwIGFuZCBkeSA8PSAwXG4gICAgICBpZiBNYXRoLnJhbmRvbSgpIDwgTWF0aC5hYnMoZHgpIC8gY2VudGVyX3hcbiAgICAgICAgJ2Rvd24nXG4gICAgICBlbHNlXG4gICAgICAgICdsZWZ0J1xuICAgIGVsc2UgaWYgZHggPD0gMCBhbmQgZHkgPiAwXG4gICAgICBpZiBNYXRoLnJhbmRvbSgpIDwgTWF0aC5hYnMoZHkpIC8gY2VudGVyX3lcbiAgICAgICAgJ3JpZ2h0J1xuICAgICAgZWxzZVxuICAgICAgICAnZG93bidcbiAgICBlbHNlIFsncmlnaHQnLCAnZG93bicsICdsZWZ0JywgJ3VwJ11bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCldXG5cbm1vZHVsZS5leHBvcnRzLnNwaXJhbCA9ICh3aWR0aCwgaGVpZ2h0KSAtPlxuICBjZW50ZXJfeCA9IE1hdGguZmxvb3Igd2lkdGgvMlxuICBjZW50ZXJfeSA9IE1hdGguZmxvb3IgaGVpZ2h0LzJcblxuICBkaXZpc2lvbl9hbmdsZSA9IE1hdGguZmxvb3IgMzYwLzRcbiAgbWF4RGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cod2lkdGgtY2VudGVyX3gsIDIpICsgTWF0aC5wb3coaGVpZ2h0LWNlbnRlcl95LCAyKSlcbiAgbXggPSAxXG4gIG15ID0gMVxuXG4gIGlmIHdpZHRoID4gaGVpZ2h0XG4gICAgbXggPSBoZWlnaHQvd2lkdGhcbiAgZWxzZVxuICAgIG15ID0gd2lkdGgvaGVpZ2h0XG5cbiAgZGlyZWN0aW9ucyA9IFsncmlnaHQnLCAnZG93bicsICdsZWZ0JywgJ3VwJ11cblxuICBwb2ludENhY2hlID0gW11cblxuICBmb3IgaW5kZXggaW4gWzAgLi4gd2lkdGggKiBoZWlnaHQgLSAxXVxuICAgIHggPSBpbmRleCAlIHdpZHRoXG4gICAgeSA9IE1hdGguZmxvb3IgaW5kZXggLyB3aWR0aFxuXG4gICAgZHggPSAoKHggLSBjZW50ZXJfeCkgKiBteClcbiAgICBkeSA9ICgoeSAtIGNlbnRlcl95ICsgMSkgKiBteSlcblxuICAgIGRpc3RhbmNlID0gTWF0aC5zaW4oKE1hdGguc3FydChNYXRoLnBvdyhkeCwgMikgKyBNYXRoLnBvdyhkeSwgMikpIC8gbWF4RGlzdGFuY2UpICogMTApXG4gICAgYW5nbGUgPSBNYXRoLmZsb29yKCgoKChNYXRoLmF0YW4yKGR5LCBkeCkqMTgwKS9NYXRoLlBJKStkaXN0YW5jZSkubW9kKDM2MCkvZGl2aXNpb25fYW5nbGUpKjEwMCkvMTAwXG5cbiAgICBwb2ludENhY2hlW2luZGV4XSA9IGFuZ2xlXG5cbiAgKGluZGV4KSAtPlxuICAgIGFuZ2xlID0gcG9pbnRDYWNoZVtpbmRleF1cblxuICAgIGludHAgPSBNYXRoLmZsb29yKGFuZ2xlKVxuICAgIGRlYyA9IE1hdGguZmxvb3IoKGFuZ2xlLWludHApKjEwMClcblxuICAgIGRpcmVjdGlvbiA9ICBpZiBNYXRoLnJhbmRvbSgpKjEwMCA+IGRlYyB0aGVuIChpbnRwKzEpLm1vZCg0KSBlbHNlIChpbnRwKzIpLm1vZCg0KVxuXG4gICAgZGlyZWN0aW9uc1tkaXJlY3Rpb25dIiwiIyMjXG4gIGNvbG9yLXBvbmRcbiAgS2V2aW4gR3JhdmllciAyMDE2XG4gIEdQTC0zLjAgTGljZW5zZVxuXG4gIFNpbXBsZSBvYmplY3QgdG8ga2VlcCB0cmFjayBvZiBGUFNcbiMjI1xuXG5tb2R1bGUuZXhwb3J0cyA9IC0+XG4gIGZpbHRlcl9zdHJlbmd0aCA9IDIwXG4gIGZyYW1lX3RpbWUgPSAwXG4gIGxhc3RfbG9vcCA9IG5ldyBEYXRlKClcbiAge1xuICAgIHRpY2sgOiAtPlxuICAgICAgdGhpc19sb29wID0gbmV3IERhdGVcbiAgICAgIHRoaXNfdGltZSA9IHRoaXNfbG9vcCAtIGxhc3RfbG9vcFxuICAgICAgZnJhbWVfdGltZSArPSAodGhpc190aW1lIC0gZnJhbWVfdGltZSkgLyBmaWx0ZXJfc3RyZW5ndGhcbiAgICAgIGxhc3RfbG9vcCA9IHRoaXNfbG9vcFxuICAgIGdldEZwcyA6IC0+XG4gICAgICAxMDAwIC8gZnJhbWVfdGltZVxuICB9XG5cblxuIiwiIyMjXG4gIGNvbG9yLXBvbmRcbiAgS2V2aW4gR3JhdmllciAyMDE2XG4gIEdQTC0zLjAgTGljZW5zZVxuXG4gIFRoZSBNYXAgaXMgdGhlIGhlYXJ0IG9mIHRoZSBhcHBsaWNhdGlvbiwgYW5kIGhvbGQgYWxsIHRoZSBlbnRpdGllcyBpbiB0aGUgbWFwIGFuZCBoYW5kbGVzIGlzc3VpbmcgdGhlIHRpY2tzXG4gIHRvIGVhY2ggZW50aXR5LiBJdCBhbHNvIGhvbGQgdGhlIGltYWdlIGRhdGEgZm9yIHRoZSBtYXAgYW5kIGtlZXBzIHRoZSBnb2FsIHJhdGlvcyB1cCB0byBkYXRlLlxuIyMjXG5cbkVtcHR5RW50aXR5ID0gcmVxdWlyZSAnLi4vZW50aXRpZXMvRW1wdHlFbnRpdHknXG5Sb2FtaW5nRW50aXR5ID0gcmVxdWlyZSAnLi4vZW50aXRpZXMvUm9hbWluZ0VudGl0eSdcblJhd01hdGVyaWFsRW50aXR5ID0gcmVxdWlyZSAnLi4vZW50aXRpZXMvUmF3TWF0ZXJpYWxFbnRpdHknXG5Db21wbGV4TWF0ZXJpYWxFbnRpdHkgPSByZXF1aXJlICcuLi9lbnRpdGllcy9Db21wbGV4TWF0ZXJpYWxFbnRpdHknXG5Qcm9kdWNlckVudGl0eSA9IHJlcXVpcmUgJy4uL2VudGl0aWVzL1Byb2R1Y2VyRW50aXR5J1xuZmxvdyA9IHJlcXVpcmUgJy4vZmxvdydcbnNodWZmbGUgPSByZXF1aXJlICcuL3NodWZmbGVBcnJheSdcbnZhcmlhYmxlcyA9IHJlcXVpcmUoJy4vdmFyaWFibGVIb2xkZXInKS5NYXBcblxuY2xhc3MgTWFwXG4gICMgUHJpdmF0ZXNcbiAgX21hcDogW11cblxuICBfdGljazogMFxuXG4gIF9pbWFnZTogbnVsbFxuICBfY291bnRzOiB7XG4gICAgQmFzZTogMCxcbiAgICBFbXB0eTogMCxcbiAgICBSYXdNYXRlcmlhbDogMCxcbiAgICBSb2FtaW5nOiAwLFxuICAgIENvbXBsZXhNYXRlcmlhbDogMCxcbiAgICBQcm9kdWNlcjogMCxcbiAgICBFZGdlOiAwXG4gIH1cblxuI3B1YmxpY3NcbiAgY29uc3RydWN0b3I6IChAd2lkdGgsIEBoZWlnaHQsIGZsb3dfdHlwZSkgLT5cbiAgICBAd2lkdGggPSBNYXRoLmZsb29yKEB3aWR0aClcbiAgICBAaGVpZ2h0ID0gTWF0aC5mbG9vcihAaGVpZ2h0KVxuXG4gICAgQGZsb3cgPSBmbG93W2Zsb3dfdHlwZV0oQHdpZHRoLCBAaGVpZ2h0LCBAKVxuICAgIEBfaW1hZ2UgPSBuZXcgVWludDhBcnJheSgoQHdpZHRoICogQGhlaWdodCkgKiA0KVxuICAgIEBhc3NpZ25FbnRpdHlUb0luZGV4KGksIG5ldyBFbXB0eUVudGl0eSgpLCB0cnVlKSBmb3IgaSBpbiBbMCAuLiAoQHdpZHRoICogQGhlaWdodCkgLSAxXVxuICAgIEBtYWtlQm9yZGVyKClcblxuICAgIEBfYWRkUHJvZHVjZXIoKSBmb3IgWzAgLi4gOF1cblxuXG4gIG1ha2VCb3JkZXI6IC0+XG4gICAgcmVxdWlyZSgnLi9ib3JkZXInKShAKVxuXG4gIHNldEZsb3dUeXBlOiAodHlwZSkgLT5cbiAgICBAZmxvdyA9IGZsb3dbdHlwZV0oQHdpZHRoLCBAaGVpZ2h0KVxuXG4gIHRpY2s6IC0+XG4gICAgbmVlZGVkX21hdGVyaWFsID0gQF9nZXROZWVkZWRNYXRlcmlhbENvdW50KClcbiAgICBpZiBuZWVkZWRfbWF0ZXJpYWwgPiAwXG4gICAgICBAX2FkZE1hdGVyaWFsKCkgZm9yIFswIC4uIG5lZWRlZF9tYXRlcmlhbF1cbiAgICBpZiBNYXRoLnJhbmRvbSgpICogMTAwMDAgPCB2YXJpYWJsZXMuY2hhbmNlX3JvYW1lcl9zcGF3blxuICAgICAgQF9hZGRSb2FtZXIoKVxuICAgIGlmIE1hdGgucmFuZG9tKCkgKiAxMDAwMCA8IHZhcmlhYmxlcy5jaGFuY2VfcHJvZHVjZXJfc3Bhd25cbiAgICAgIEBfYWRkUHJvZHVjZXIoKVxuICAgIGVudGl0eS50aWNrKCkgZm9yIGVudGl0eSBpbiBzaHVmZmxlKEBfbWFwLnNsaWNlKCkpICNzbGljZSB0byBtYWtlIGEgY29weSBhbmQgbGVhdmUgdGhlIG9yaWdpbmFsIGludGFjdFxuICAgIEBfdGljaysrXG5cbiAgZ2V0UmVuZGVyOiAtPlxuICAgIEBfaW1hZ2VcblxuICBnZXRFbnRpdHlBdFhZOiAoeCwgeSkgLT5cbiAgICBAZ2V0RW50aXR5QXRJbmRleChAX3BvaW50VG9JbmRleCh4LCB5KSlcblxuICBnZXRFbnRpdHlBdEluZGV4OiAoaW5kZXgpIC0+XG4gICAgaWYgQF9tYXBbaW5kZXhdPyB0aGVuIEBfbWFwW2luZGV4XSBlbHNlIGZhbHNlXG5cbiAgZ2V0RW50aXRpZXNJblJhbmdlOiAoaW5kZXhfbWluLCBpbmRleF9tYXgpIC0+XG4gICAgQF9tYXAuc2xpY2UoaW5kZXhfbWluLCBpbmRleF9tYXggKyAxKVxuXG4gIHN3YXBFbnRpdGllczogKGluZGV4MSwgaW5kZXgyKSAtPlxuICAgIGVudDEgPSBAZ2V0RW50aXR5QXRJbmRleCBpbmRleDFcbiAgICBlbnQyID0gQGdldEVudGl0eUF0SW5kZXggaW5kZXgyXG4gICAgQGFzc2lnbkVudGl0eVRvSW5kZXggaW5kZXgxLCBlbnQyXG4gICAgQGFzc2lnbkVudGl0eVRvSW5kZXggaW5kZXgyLCBlbnQxXG4gICAgZW50MS5pc19kZWxldGVkID0gZmFsc2VcbiAgICBlbnQyLmlzX2RlbGV0ZWQgPSBmYWxzZVxuICAgIHRydWVcblxuICBnZXRFbnRpdHlBdERpcmVjdGlvbjogKGluZGV4LCBkaXJlY3Rpb24pIC0+XG4gICAgc3dpdGNoIGRpcmVjdGlvblxuICAgICAgd2hlbiAndXAnXG4gICAgICAgIGlmIGluZGV4ID4gQHdpZHRoIC0gMVxuICAgICAgICAgIEBnZXRFbnRpdHlBdEluZGV4KGluZGV4IC0gQHdpZHRoKVxuICAgICAgICBlbHNlIGZhbHNlXG4gICAgICB3aGVuICdkb3duJ1xuICAgICAgICBpZiBpbmRleCA8IEBfbWFwLmxlbmd0aCAtIDFcbiAgICAgICAgICBAZ2V0RW50aXR5QXRJbmRleChpbmRleCArIEB3aWR0aClcbiAgICAgICAgZWxzZSBmYWxzZVxuICAgICAgd2hlbiAnbGVmdCdcbiAgICAgICAgaWYgaW5kZXggJSBAd2lkdGggPiAwXG4gICAgICAgICAgQGdldEVudGl0eUF0SW5kZXgoaW5kZXggLSAxKVxuICAgICAgICBlbHNlIGZhbHNlXG4gICAgICB3aGVuICdyaWdodCdcbiAgICAgICAgaWYgaW5kZXggJSBAd2lkdGggPCBAd2lkdGggLSAxXG4gICAgICAgICAgQGdldEVudGl0eUF0SW5kZXgoaW5kZXggKyAxKVxuICAgICAgICBlbHNlIGZhbHNlXG5cbiAgYXNzaWduRW50aXR5VG9JbmRleDogKGluZGV4LCBlbnRpdHksIGlzX25ldyA9IGZhbHNlKSAtPlxuICAgIGlmIGluZGV4ID4gQF9tYXAubGVuZ3RoIG9yIGluZGV4IDwgMFxuICAgICAgZmFsc2VcbiAgICBlbHNlXG4gICAgICBjdXJyZW50X2VudGl0eSA9IEBnZXRFbnRpdHlBdEluZGV4KGluZGV4KVxuICAgICAgaWYgY3VycmVudF9lbnRpdHlcbiAgICAgICAgY3VycmVudF9lbnRpdHkuaXNfZGVsZXRlZCA9IHRydWVcbiAgICAgICAgQF9jb3VudHNbY3VycmVudF9lbnRpdHkubmFtZV0tLVxuXG4gICAgICBAX2NvdW50c1tlbnRpdHkubmFtZV0rK1xuXG4gICAgICBAX21hcFtpbmRleF0gPSBlbnRpdHlcbiAgICAgIGVudGl0eS5pc19kZWxldGVkID0gZmFsc2VcbiAgICAgIGlmIGlzX25ld1xuICAgICAgICBlbnRpdHkuaW5pdCBALCBpbmRleFxuICAgICAgZWxzZVxuICAgICAgICBlbnRpdHkubW92ZWQoaW5kZXgpXG4gICAgICB0cnVlXG5cbiNwcml2YXRlc1xuICBfcG9pbnRUb0luZGV4OiAoeCwgeSkgLT4geCArIEB3aWR0aCAqIHlcbiAgX2luZGV4VG9Qb2ludDogKGluZGV4KSAtPiBbaW5kZXggJSBAd2lkdGgsIE1hdGguZmxvb3IoaW5kZXggLyBAd2lkdGgpXVxuICBfYWRkRW50aXR5VG9FbXB0eTogKHR5cGUpIC0+XG4gICAgbG9vcFxuICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChAX21hcC5sZW5ndGggLSAxKSlcbiAgICAgIGJyZWFrIGlmIEBnZXRFbnRpdHlBdEluZGV4KGkpPy5uYW1lIGlzICdFbXB0eSdcbiAgICBAYXNzaWduRW50aXR5VG9JbmRleChpLCBuZXcgdHlwZSgpLCB0cnVlKVxuXG4gIF9nZXROZWVkZWRNYXRlcmlhbENvdW50OiAtPlxuICAgIE1hdGguZmxvb3IoKEBfbWFwLmxlbmd0aCAtIEBfY291bnRzLkVkZ2UpICogdmFyaWFibGVzLmVtcHR5X3JhdGlvKSAtIEBfY291bnRzLkNvbXBsZXhNYXRlcmlhbCAtIEBfY291bnRzLlJhd01hdGVyaWFsIC0gQF9jb3VudHMuUHJvZHVjZXJcblxuICBfYWRkTWF0ZXJpYWw6IC0+XG4gICAgQF9hZGRFbnRpdHlUb0VtcHR5KFJhd01hdGVyaWFsRW50aXR5KVxuXG4gIF9hZGRDb21wbGV4TWF0ZXJpYWw6IC0+XG4gICAgQF9hZGRFbnRpdHlUb0VtcHR5KENvbXBsZXhNYXRlcmlhbEVudGl0eSlcblxuICBfYWRkUm9hbWVyOiAtPlxuICAgIEBfYWRkRW50aXR5VG9FbXB0eShSb2FtaW5nRW50aXR5KVxuXG4gIF9hZGRQcm9kdWNlcjogLT5cbiAgICBAX2FkZEVudGl0eVRvRW1wdHkoUHJvZHVjZXJFbnRpdHkpXG5cbiNkZWJ1Z3NcbiAgJCRkdW1wTWFwOiAtPlxuICAgIGNvbnNvbGUuZGVidWcgQF9tYXBcblxubW9kdWxlLmV4cG9ydHMgPSBNYXBcblxuXG4iLCIjIyNcbiAgY29sb3ItcG9uZFxuICBLZXZpbiBHcmF2aWVyIDIwMTZcbiAgR1BMLTMuMCBMaWNlbnNlXG5cbiAgU2ltcGxlIHdheSB0byBzaHVmZmxlIGFycmF5XG4jIyNcblxubW9kdWxlLmV4cG9ydHMgPSAoYXJyYXkpIC0+XG4gIGNvdW50ZXIgPSBhcnJheS5sZW5ndGhcbiAgIyBXaGlsZSB0aGVyZSBhcmUgZWxlbWVudHMgaW4gdGhlIGFycmF5XG4gIHdoaWxlIGNvdW50ZXIgPiAwXG4gICAgIyBQaWNrIGEgcmFuZG9tIGluZGV4XG4gICAgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb3VudGVyKVxuICAgICMgRGVjcmVhc2UgY291bnRlciBieSAxXG4gICAgY291bnRlci0tXG4gICAgIyBBbmQgc3dhcCB0aGUgbGFzdCBlbGVtZW50IHdpdGggaXRcbiAgICB0ZW1wID0gYXJyYXlbY291bnRlcl1cbiAgICBhcnJheVtjb3VudGVyXSA9IGFycmF5W2luZGV4XVxuICAgIGFycmF5W2luZGV4XSA9IHRlbXBcbiAgYXJyYXkiLCIjIyNcbiAgY29sb3ItcG9uZFxuICBLZXZpbiBHcmF2aWVyIDIwMTZcbiAgR1BMLTMuMCBMaWNlbnNlXG5cbiAgSG9sZGVyIGZvciB2YXJpYWJsZXMuXG4jIyNcblxudmFyaWFibGVzID1cbiAgTWFwOlxuICAgIGVtcHR5X3JhdGlvOiAuMTVcbiAgICBjaGFuY2VfcHJvZHVjZXJfc3Bhd246IDEwMFxuICAgIGNoYW5jZV9yb2FtZXJfc3Bhd246IDIwMFxuICBQcm9kdWNlckVudGl0eTpcbiAgICBzdGFydGluZ19saWZlOiAyMDBcbiAgICBsaWZlX2dhaW5fcGVyX2Zvb2Q6IDEyMDBcbiAgICBsaWZlX3RvX3JlcHJvZHVjZTogNjAwXG4gICAgbGlmZV9sb3NzX3RvX3JlcHJvZHVjZTogNDAwXG4gICAgbWF4X2xpZmU6IDYwMFxuICAgIG1pbl9saWZlX3RvX3RyYW5zZmVyOiA1MFxuICAgIG1heF9saWZlX3RyYW5zZmVyOiA1MFxuICAgIGVhdGluZ19jb29sZG93bjogMTBcbiAgICBhZ2VfdG9fcmVwcm9kdWNlOiA4MFxuICAgIG9sZF9hZ2VfZGVhdGhfbXVsdGlwbGllcjogMTAwMDAwMDBcbiAgUm9hbWluZ0VudGl0eTpcbiAgICBzdHVja190aWNrczogMjBcbiAgICBzdHVja19jb29sZG93bjogMjBcbiAgICBzdGFydGluZ19oZWFsdGhfZnJlc2g6IDEwMFxuICAgIHN0YXJ0aW5nX2hlYWx0aF9jbG9uZTogMjBcbiAgICBtYXhfbGlmZTogMjAwXG4gICAgbGlmZV9nYWluX3Blcl9mb29kOiAyNVxuICAgIGxpZmVfdG9fcmVwcm9kdWNlOiAyMDBcbiAgICBsaWZlX2xvc3NfdG9fcmVwcm9kdWNlOiA1MFxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB2YXJpYWJsZXNcbiIsIiMjI1xuICBjb2xvci1wb25kXG4gIEtldmluIEdyYXZpZXIgMjAxNlxuICBHUEwtMy4wIExpY2Vuc2VcblxuICBIYW5kbGVzIGNvbW11bmljYXRpb24gYmV0d2VlbiB0aGUgbWFwIGFuZCB0aGUgbWFpbiB0aHJlYWQuIEFsc28gaW5zdHJ1Y3RzIHRoZVxuICBtYXAgd2hlbiB0byB0aWNrLlxuIyMjXG5cbk1hcCA9IHJlcXVpcmUgJy4vbGliL21hcCdcbkZQUyA9IHJlcXVpcmUoJy4vbGliL2ZwcycpXG52YXJpYWJsZXMgPSByZXF1aXJlICcuL2xpYi92YXJpYWJsZUhvbGRlcidcblxudGFyZ2V0X3RwcyA9IDQwXG5cbm1hcCA9IG51bGxcbnJ1bm5pbmcgPSBmYWxzZVxubWFwX3RpY2tfaW50ID0gLTE7XG5mcHMgPSBGUFMoKVxuXG50aWNrID0gLT5cbiAgbWFwLnRpY2soKVxuICBmcHMudGljaygpXG4gIG51bGxcblxuaW5pdCA9ICh3aWR0aCwgaGVpZ2h0LCBzZWVkLCBmbG93KSAtPlxuICBNYXRoLnJhbmRvbSA9IHJlcXVpcmUoJ3NlZWRyYW5kb20vbGliL2FsZWEnKShzZWVkKVxuICBtYXAgPSBuZXcgTWFwIHdpZHRoLCBoZWlnaHQsIGZsb3dcbiAgc2VsZi5wb3N0TWVzc2FnZSBbJ2luaXRpYWxpemVkJ11cblxuc3RhcnQgPSAoKSAtPlxuICBydW5uaW5nID0gdHJ1ZVxuICBmcHMgPSBGUFMoKVxuICBzZWxmLnBvc3RNZXNzYWdlIFsnc3RhcnRlZCddXG4gIGNsZWFySW50ZXJ2YWwgbWFwX3RpY2tfaW50XG4gIG1hcF90aWNrX2ludCA9IHNldEludGVydmFsIHRpY2ssIDEwMDAvdGFyZ2V0X3Rwc1xuXG5zdG9wID0gLT5cbiAgcnVubmluZyA9IGZhbHNlXG4gIGNsZWFySW50ZXJ2YWwgbWFwX3RpY2tfaW50XG4gIHNlbGYucG9zdE1lc3NhZ2UgWydzdG9wcGVkJ11cblxuc2VuZEltYWdlRGF0YSA9IC0+XG4gIHNlbGYucG9zdE1lc3NhZ2UgWydpbWFnZURhdGEnLCBtYXAuZ2V0UmVuZGVyKCldXG5cbnNlbmRUUFMgPSAtPlxuICBzZWxmLnBvc3RNZXNzYWdlIFsndHBtJywgZnBzLmdldEZwcygpXVxuXG51cGRhdGVWYXJpYWJsZSA9ICh0eXBlLCB2YXJpYWJsZSwgdmFsdWUpIC0+XG4gIGNvbnNvbGUuZGVidWcgXCJVcGRhdGluZyAje3R5cGV9LiN7dmFyaWFibGV9IHRvICN7dmFsdWV9XCJcbiAgdmFyaWFibGVzW3R5cGVdW3ZhcmlhYmxlXSA9IHZhbHVlXG5cbmdldFZhcmlhYmxlcyA9IC0+XG4gIHNlbGYucG9zdE1lc3NhZ2UgWyd2YXJpYWJsZXMnLCB2YXJpYWJsZXNdXG5cbnNldEZsb3dUeXBlID0gKHR5cGUpIC0+XG4gIG1hcC5zZXRGbG93VHlwZSh0eXBlKVxuXG5cbnNlbGYub25tZXNzYWdlID0gKGUpIC0+XG4gIHN3aXRjaCBlLmRhdGFbMF1cbiAgICB3aGVuICdpbml0JyAgICAgICAgICAgdGhlbiBpbml0KGUuZGF0YVsxXSwgZS5kYXRhWzJdLCBlLmRhdGFbM10sIGUuZGF0YVs0XSlcbiAgICB3aGVuICdzdGFydCcgICAgICAgICAgdGhlbiBzdGFydCgpXG4gICAgd2hlbiAnc3RvcCcgICAgICAgICAgIHRoZW4gc3RvcCgpXG4gICAgd2hlbiAnc2VuZEltYWdlRGF0YScgIHRoZW4gc2VuZEltYWdlRGF0YSgpXG4gICAgd2hlbiAnc2VuZFRQUycgICAgICAgIHRoZW4gc2VuZFRQUygpXG4gICAgd2hlbiAndXBkYXRlVmFyaWFibGUnIHRoZW4gdXBkYXRlVmFyaWFibGUoZS5kYXRhWzFdLCBlLmRhdGFbMl0sIGUuZGF0YVszXSlcbiAgICB3aGVuICdnZXRWYXJpYWJsZXMnICAgdGhlbiBnZXRWYXJpYWJsZXMoKVxuICAgIHdoZW4gJ3NldEZsb3dUeXBlJyAgICB0aGVuIHNldEZsb3dUeXBlKGUuZGF0YVsxXSlcbiAgICBlbHNlIGNvbnNvbGUuZXJyb3IgXCJVbmtub3duIENvbW1hbmQgI3tlLmRhdGFbMF19XCJcblxuIl19
