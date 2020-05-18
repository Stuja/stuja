###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The RoamingEntity is an entity which will hunt out ComplexMaterial and turn it back into RawMaterial
###

LivingEntity = require './LivingEntity'
EmptyEntity = require './EmptyEntity'
shuffle = require '../lib/shuffleArray'
RawMaterialEntity = require './RawMaterialEntity'
variables = require('../lib/variableHolder.coffee').RoamingEntity

search_radius = 10

directions = ['right', 'down', 'left', 'up']

class RoamingEntity extends LivingEntity
  name: 'Roaming'

  constructor: () ->
    super()
    @max_health = variables.max_life
    @is_moveable = false
    @health = variables.starting_health_fresh
    @color = [255, 255, 0, 255]
    @stuck_count = 0
    @stuck_cooldown = 0

  # Choose a random direction
  chooseDirection: ->
    @wanted_direction = directions[Math.floor(Math.random() * 4)]

  doMovement: ->
    self = @

    # If stuck, choose a direction and set the cooldown
    if @stuck_count > variables.stuck_ticks
      @chooseDirection()
      @stuck_cooldown = variables.stuck_cooldown

    # if stuck, return the wanted direction
    if @stuck_cooldown > 0
      @stuck_cooldown--
      @wanted_direction

    # Figure out a direction by searching for ComplexMaterial
    direction = (
      if @stuck_cooldown > 0
        @stuck_cooldown--
        false
      else
        # Find the min and max x and y from search radius
        x_neg = Math.max(@map_x - search_radius, 0)
        y_neg = Math.max(@map_y - search_radius, 0)
        x_pos = Math.min(@map_x + search_radius, @map.width)
        y_pos = Math.min(@map_y + search_radius, @map.height)

        all_entities = []

        # Get all entities from map in radius
        for y in [y_neg .. y_pos]
          all_entities = all_entities.concat(self.map.getEntitiesInRange(self.map._pointToIndex(x_neg, y), self.map._pointToIndex(x_pos, y)))

        # Filter out to only ComplexMaterial
        filtered_entities = all_entities.filter (entity) ->
          entity.name is 'ComplexMaterial'

        # Sort them by distance from self
        filtered_entities.sort (ent_a, ent_b) ->
          a_distance = Math.sqrt(Math.pow(ent_a.map_x - self.map_x, 2) + Math.pow(ent_a.map_y - self.map_y, 2))
          b_distance = Math.sqrt(Math.pow(ent_b.map_x - self.map_x, 2) + Math.pow(ent_b.map_y - self.map_y, 2))

          if a_distance < b_distance then -1
          else if a_distance > b_distance then 1
          else 0

        # If there are any entities, get the closest one and figure out which direction
        # is needed to get closer to the entity
        if filtered_entities.length
          target_entity = filtered_entities[0]
          dx = target_entity.map_x - self.map_x
          dy = target_entity.map_y - self.map_y

          if Math.abs(dx) > Math.abs(dy)
            if dx > 0 then 'right' else 'left'
          else
            if dy > 0 then 'down' else 'up'
        else
          false
    )

    # if no direction found choose a random one
    unless direction
      if Math.random() > .9 then @chooseDirection()
      direction = @wanted_direction

    entity = @map.getEntityAtDirection(@map_index, direction);

    if entity and entity.name isnt 'Edge'
      @map.swapEntities @map_index, entity.map_index
      @stuck_count = 0
    else
      @stuck_count++

  consumeMaterial: ->
    (
      entity = @map.getEntityAtDirection(@map_index, side)

      if entity
        if entity.name is 'ComplexMaterial'
          @map.assignEntityToIndex(entity.map_index, new RawMaterialEntity(entity.type), true)
          @health += variables.life_gain_per_food
    ) for side in shuffle ['up', 'down', 'left', 'right']

  reproduce: ->
    if @health > variables.life_to_reproduce
      (
        entity = @map.getEntityAtDirection(@map_index, side)

        if entity and entity.name is 'Empty'
            child = new RoamingEntity()
            child.health = variables.starting_health_clone
            @map.assignEntityToIndex(entity.map_index, child , true)
            @health -= variables.life_loss_to_reproduce
            break
      ) for side in shuffle ['up', 'down', 'left', 'right']

    true

  tick: ->
    if super()
      @consumeMaterial()
      @doMovement()
      @reproduce()
      @health--
    else
      false

module.exports = RoamingEntity
