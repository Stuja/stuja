EdgeEntity = require '../entities/EdgeEntity'

Simple1DNoise = require './Simple1DNoise'

workIn = (map, sx, sy, axis, direction) ->
  loop
    index = map._pointToIndex(sx, sy)
    entity = map.getEntityAtIndex(index)
    if entity.name isnt 'Edge'
      map.assignEntityToIndex(index, new EdgeEntity(0), true)

    break if not entity or ( entity.name is 'Edge' and entity.type is 1 )

    switch axis
      when 'x'
        sx = if direction then sx + 1 else sx - 1
      when 'y'
        sy = if direction then sy + 1 else sy - 1



makeBorder = (map) ->
  x_center = Math.round(map.width / 2);
  y_center = Math.round(map.height / 2);

  min_radius = Math.floor(Math.min(map.width, map.height) / 2) * .8

  radius_noise = Simple1DNoise(10, .05)
  dirt_noise = Simple1DNoise(10, .02)

  multi = 4

  for p in [0 ... 360*multi]
    rad = (p/multi) * Math.PI / 180

    radius_offset = radius_noise.getVal(p)
    noised_radius = min_radius + radius_offset

    dirt_depth = Math.round Math.max 1, dirt_noise.getVal p

    console.log dirt_depth

    for d in [0 ... dirt_depth]
      x = Math.round(x_center + (noised_radius + d) * Math.cos(rad))
      y = Math.round(y_center + (noised_radius + d) * Math.sin(rad))

      index = map._pointToIndex(x, y)
      map.assignEntityToIndex(index, new EdgeEntity(1), true)


  for i in [ 0 ... Math.max(x_center + 1, y_center + 1)]
    #top/bottom
    if x_center - i >= 0
      workIn map, x_center - i , 0, 'y', true
      workIn map, x_center - i , map.height - 1, 'y', false
    if x_center + i < map.height
      workIn map, x_center + i , 0, 'y', true
      workIn map, x_center + i , map.height - 1, 'y', false

    #left/right
    if y_center - i >= 0
      workIn map, 0, y_center - i , 'x', true
      workIn map, map.width - 1, y_center - i , 'x', false
    if y_center + i < map.height
      workIn map, 0, y_center + i , 'x', true
      workIn map, map.width - 1, y_center + i , 'x', false



module.exports = makeBorder