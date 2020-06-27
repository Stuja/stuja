###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The LivingEntity is a base entity which kills an entity and adjusts the transparency based on health
###

BaseEntity = require './BaseEntity'
EmptyEntity = require './EmptyEntity'

class LivingEntity extends BaseEntity
  constructor: ->
    super
    @max_health = 400

  died: ->

  tick: ->
    if super()
      if @health <= 0
        @map.assignEntityToIndex(@map_index, new EmptyEntity(), true)
        @died()
        false
      else
        @setColor(@color[0], @color[1], @color[2], Math.min(255, 20 + Math.round((@health / @max_health)*235)))
        true
    else
      false

module.exports = LivingEntity