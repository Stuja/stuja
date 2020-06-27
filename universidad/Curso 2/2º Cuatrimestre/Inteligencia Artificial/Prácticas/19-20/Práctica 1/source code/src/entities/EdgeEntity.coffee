###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The EdgeEntity is for the edges of the map
###

BaseEntity = require './BaseEntity'

class EdgeEntity extends BaseEntity
  name: 'Edge'
  type: 0
  constructor: (@type) ->
    super
    @is_moveable = false
    @color = if @type then [102, 51, 0, 255] else [100, 146, 1, 255]

module.exports = EdgeEntity