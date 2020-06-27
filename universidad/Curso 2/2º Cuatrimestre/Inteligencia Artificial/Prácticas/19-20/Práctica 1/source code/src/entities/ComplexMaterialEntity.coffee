###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The ComplexMaterialEntity represents a dead Producer
###

FlowingEntity = require './FlowingEntity'

class ComplexMaterialEntity extends FlowingEntity
  name: 'ComplexMaterial'

  constructor: (@type = Math.floor(Math.random()*3))->
    super
    @is_moveable = false
    switch @type
      when 0
        @color = [255, 0, 0, 255]
      when 1
        @color = [255, 50, 50, 255]
      when 2
        @color = [255, 100, 100, 255]


module.exports = ComplexMaterialEntity