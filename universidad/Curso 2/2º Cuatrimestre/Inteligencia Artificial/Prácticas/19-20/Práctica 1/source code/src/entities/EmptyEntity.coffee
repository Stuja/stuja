###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  The EmptyEntity is the placeholder for empty spots
###

BaseEntity = require './BaseEntity'

minBrightness = 0
maxBrightness = 20

class EmptyEntity extends BaseEntity
  name: 'Empty'

  constructor: ->
    super()
    @color = [0, 0, 0, 255]

  tick: ->
    super() and (
      false
#      colors = @color.concat()
#      ind = Math.floor(Math.random() * 3);
#      current_color = colors[ind];
#      increment = (Math.floor(Math.random() * 3) - 1) * 3
#      colors[ind] = Math.min(maxBrightness, Math.max(minBrightness, current_color + increment))
#      @setColor(colors[0], colors[1], colors[2], colors[3])
    )


module.exports = EmptyEntity