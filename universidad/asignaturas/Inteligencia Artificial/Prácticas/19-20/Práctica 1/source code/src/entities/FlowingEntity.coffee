###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The FlowingEntity is a base entity to give an entity the ability to flow with the map's current
###

BaseEntity = require './BaseEntity'
EmptyEntity = require './EmptyEntity'

directions = ['right', 'down', 'left', 'up']

class FlowingEntity extends BaseEntity
  name: 'Flowing'
  constructor: -> super


  tick: ->
    if super()
      direction = if Math.random() > .5 then directions[Math.floor(Math.random() * 4)] else @map.flow(@map_index)

      entity = @map.getEntityAtDirection(@map_index, direction)


      if entity and entity.is_moveable
        @map.swapEntities(@map_index, entity.map_index)
#      else if entity and entity.name is "Edge"
#        @map.assignEntityToIndex(@map_index, new EmptyEntity(), true)

      true
    else
      false

module.exports = FlowingEntity