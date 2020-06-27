###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The Map is the heart of the application, and hold all the entities in the map and handles issuing the ticks
  to each entity. It also hold the image data for the map and keeps the goal ratios up to date.
###

EmptyEntity = require '../entities/EmptyEntity'
RoamingEntity = require '../entities/RoamingEntity'
RawMaterialEntity = require '../entities/RawMaterialEntity'
ComplexMaterialEntity = require '../entities/ComplexMaterialEntity'
ProducerEntity = require '../entities/ProducerEntity'
flow = require './flow'
shuffle = require './shuffleArray'
variables = require('./variableHolder').Map

class Map
  # Privates
  _map: []

  _tick: 0

  _image: null
  _counts: {
    Base: 0,
    Empty: 0,
    RawMaterial: 0,
    Roaming: 0,
    ComplexMaterial: 0,
    Producer: 0,
    Edge: 0
  }

#publics
  constructor: (@width, @height, flow_type) ->
    @width = Math.floor(@width)
    @height = Math.floor(@height)

    @flow = flow[flow_type](@width, @height, @)
    @_image = new Uint8Array((@width * @height) * 4)
    @assignEntityToIndex(i, new EmptyEntity(), true) for i in [0 .. (@width * @height) - 1]
    @makeBorder()

    @_addProducer() for [0 .. 8]


  makeBorder: ->
    require('./border')(@)

  setFlowType: (type) ->
    @flow = flow[type](@width, @height)

  tick: ->
    needed_material = @_getNeededMaterialCount()
    if needed_material > 0
      @_addMaterial() for [0 .. needed_material]
    if Math.random() * 10000 < variables.chance_roamer_spawn
      @_addRoamer()
    if Math.random() * 10000 < variables.chance_producer_spawn
      @_addProducer()
    entity.tick() for entity in shuffle(@_map.slice()) #slice to make a copy and leave the original intact
    @_tick++

  getRender: ->
    @_image

  getEntityAtXY: (x, y) ->
    @getEntityAtIndex(@_pointToIndex(x, y))

  getEntityAtIndex: (index) ->
    if @_map[index]? then @_map[index] else false

  getEntitiesInRange: (index_min, index_max) ->
    @_map.slice(index_min, index_max + 1)

  swapEntities: (index1, index2) ->
    ent1 = @getEntityAtIndex index1
    ent2 = @getEntityAtIndex index2
    @assignEntityToIndex index1, ent2
    @assignEntityToIndex index2, ent1
    ent1.is_deleted = false
    ent2.is_deleted = false
    true

  getEntityAtDirection: (index, direction) ->
    switch direction
      when 'up'
        if index > @width - 1
          @getEntityAtIndex(index - @width)
        else false
      when 'down'
        if index < @_map.length - 1
          @getEntityAtIndex(index + @width)
        else false
      when 'left'
        if index % @width > 0
          @getEntityAtIndex(index - 1)
        else false
      when 'right'
        if index % @width < @width - 1
          @getEntityAtIndex(index + 1)
        else false

  assignEntityToIndex: (index, entity, is_new = false) ->
    if index > @_map.length or index < 0
      false
    else
      current_entity = @getEntityAtIndex(index)
      if current_entity
        current_entity.is_deleted = true
        @_counts[current_entity.name]--

      @_counts[entity.name]++

      @_map[index] = entity
      entity.is_deleted = false
      if is_new
        entity.init @, index
      else
        entity.moved(index)
      true

#privates
  _pointToIndex: (x, y) -> x + @width * y
  _indexToPoint: (index) -> [index % @width, Math.floor(index / @width)]
  _addEntityToEmpty: (type) ->
    loop
      i = Math.floor(Math.random() * (@_map.length - 1))
      break if @getEntityAtIndex(i)?.name is 'Empty'
    @assignEntityToIndex(i, new type(), true)

  _getNeededMaterialCount: ->
    Math.floor((@_map.length - @_counts.Edge) * variables.empty_ratio) - @_counts.ComplexMaterial - @_counts.RawMaterial - @_counts.Producer

  _addMaterial: ->
    @_addEntityToEmpty(RawMaterialEntity)

  _addComplexMaterial: ->
    @_addEntityToEmpty(ComplexMaterialEntity)

  _addRoamer: ->
    @_addEntityToEmpty(RoamingEntity)

  _addProducer: ->
    @_addEntityToEmpty(ProducerEntity)

#debugs
  $$dumpMap: ->
    console.debug @_map

module.exports = Map


