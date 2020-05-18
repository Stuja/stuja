###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The ProducerEntity is an entity which consumes RawMaterial, shares health with other friendly
  Producers, and when dies turn into a ComplexMaterial
###

LivingEntity = require './LivingEntity'
EmptyEntity = require './EmptyEntity'
ComplexMaterialEntity = require './ComplexMaterialEntity'
shuffle = require '../lib/shuffleArray'
variableHolder = require('../lib/variableHolder').ProducerEntity

fixmod = (m, n) -> ((m%n)+n)%n

class ProducerEntity extends LivingEntity
  name: 'Producer'

  constructor: (@wants = Math.floor(Math.random()*3))->
    super
    @makes = fixmod(@wants + 1, 3)
    @is_moveable = false
    @color = [0, 255, 0, 255]
    @health = variableHolder.starting_life
    @max_health = variableHolder.max_life
    @last_ate = 0
    @age = 0

  getSides: ->
    (@map.getEntityAtDirection(@map_index, side) for side in shuffle ['up', 'down', 'left', 'right'])

  eat: (entities) ->
    (
      @last_ate = 0
      @age = 0
      @health += variableHolder.life_gain_per_food
      @map.assignEntityToIndex(entity.map_index, new EmptyEntity(), true)
    ) for entity in entities when @health < @max_health

  transferHealth: (entities) ->
    for entity in entities
      needs = (
        if (@health < variableHolder.min_life_to_transfer and entity.health > variableHolder.min_life_to_transfer)
          Math.floor(@health * .9)
        else if ((@health < variableHolder.min_life_to_transfer and entity.health < variableHolder.min_life_to_transfer) or (@health > variableHolder.min_life_to_transfer and entity.health > variableHolder.min_life_to_transfer)) and @health > entity.health
          Math.min(Math.ceil((@health - entity.health) / 2), variableHolder.max_life_transfer)
        else
          0
      )

      if needs > 0
        @health -= needs
        entity.health += needs

    true

  attackEnemies: (entities) ->
    for entity in entities
      entity.health -= 10

  reproduce: (entities) ->
    (
      @health -= variableHolder.life_loss_to_reproduce
      @map.assignEntityToIndex(entity.map_index, new ProducerEntity(@wants), true)
      @age = 0
    ) for entity in entities when @health >= variableHolder.life_to_reproduce

  died: ->
    @map.assignEntityToIndex(@map_index, new ComplexMaterialEntity(@makes), true)

  tick: ->
    if super()
      @last_ate++
      @age++

      sides = (entity for entity in @getSides() when entity)

      friendly_entities = (entity for entity in sides when entity.name is "Producer" and entity.wants is @wants and entity.makes is @makes)
      enemy_entities = (entity for entity in sides when entity.name is "Producer" and entity.wants isnt @wants and entity.makes isnt @makes)

      if friendly_entities.length
        @transferHealth(friendly_entities)

      if enemy_entities.length
        @attackEnemies(enemy_entities)

      if @age > variableHolder.age_to_reproduce and Math.pow(friendly_entities.length+1, 2)/16 > Math.random()
        placeable_entities = (entity for entity in sides when entity.name is "Empty")
        @reproduce(placeable_entities)

      if @last_ate > variableHolder.eating_cooldown
        consumable_entities = (entity for entity in sides when entity.name is "RawMaterial" and entity.type is @wants)
        @eat(consumable_entities)

      if friendly_entities.length is 4
        @age = 0
        @color[1] = 255
        @health -= 1
      else
        @health -= 5
        @color[1] = 200

      if @age / variableHolder.old_age_death_multiplier > Math.random()
        @died()


      true
    else
      false


module.exports = ProducerEntity