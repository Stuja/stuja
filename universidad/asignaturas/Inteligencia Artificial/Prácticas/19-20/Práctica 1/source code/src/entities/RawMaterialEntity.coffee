###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The RawMaterialEntity is just a blue flowing entity
###

FlowingEntity = require './FlowingEntity'

class RawMaterialEntity extends FlowingEntity
  name: 'RawMaterial'

  constructor: (@type = Math.floor(Math.random()*3)) ->
    super
    switch @type
      when 0
        @color = [0, 0, 255, 255]
      when 1
        @color = [50, 50, 255, 255]
      when 2
        @color = [100, 100, 255, 255]

module.exports = RawMaterialEntity