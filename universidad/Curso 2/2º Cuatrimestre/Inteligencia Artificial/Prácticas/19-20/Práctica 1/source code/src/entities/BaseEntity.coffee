###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  BaseEntity is the root class that all Entities will eventually extent from.
  It implements all the required public functions for an entity to exist
###

class BaseEntity
  name: 'Base'

  constructor: ->
    @is_moveable = true
    @is_deleted = false
    @color = [0, 0, 0, 255]

  init: (map, index) ->
    @map = map
    @moved(index)
    @setColor @color[0], @color[1], @color[2], @color[3]
    true

  # When an entity is moved on the map, we update the reference to the index, calculate
  # the xy point, and set the color.
  moved: (new_index) ->
    @map_index = new_index
    [@map_x, @map_y] = @map._indexToPoint(new_index)
    @setColor @color[0], @color[1], @color[2], @color[3]
    true

  setColor: (r, g, b, a) ->
    unless @is_deleted
      @color = [r, g, b, a]
      image_index = @map_index * 4;

      # Currently writes color directly to map. May change this at some point.
      # This dramatically reduces the number of alterations to the map image object.
      # May add a public method to the map to do this.
      @map._image[image_index] = r
      @map._image[image_index + 1] = g
      @map._image[image_index + 2] = b
      @map._image[image_index + 3] = a
      true
    else
      false

  tick: -> true

module.exports = BaseEntity