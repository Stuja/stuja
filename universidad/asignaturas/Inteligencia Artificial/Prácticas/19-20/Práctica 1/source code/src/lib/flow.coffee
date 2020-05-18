###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Contains a set of different flow calculators.
###

Number.prototype.mod = (n) -> ((this%n)+n)%n

module.exports.dual_spirals = (width, height, map) ->
  center_x = Math.floor width/2
  center_y = Math.floor height/2

  z = 1

  (index) ->

    x = index % width
    y = Math.floor index / width

    dx = x - center_x
    dy = y - center_y

    mx = Math.abs(dx)

    q = (
      if dy > 0
        if mx < center_x / 2 then 0 else 1
      else
        if mx > center_x / 2 then 2 else 3
    )

    rand = Math.random() >= .5

    if dx > 0
      switch q
        when 0
          if rand then 'up' else 'left'
        when 1
          if rand then 'left' else 'down'
        when 2
          if rand then 'down' else 'right'
        when 3
          if rand then 'right' else 'up'
    else
      switch q
        when 0
          if rand then 'up' else 'right'
        when 1
          if rand then 'right' else 'down'
        when 2
          if rand then 'down' else 'left'
        when 3
          if rand then 'left' else 'up'


module.exports.opposite_spirals = (width, height, map) ->
  center_x = Math.floor width/2
  center_y = Math.floor height/2

  z = 1

  (index) ->

    x = index % width
    y = Math.floor index / width

    dx = x - center_x
    dy = y - center_y

    mx = Math.abs(dx)

    q = (
      if dy > 0
        if mx < center_x / 2.5 then 0 else 1
      else
        if mx > center_x / 2.5 then 2 else 3
    )

    rand = Math.random() >= .49

    if dx > 0
      switch q
        when 0
          if rand then 'left' else 'up'
        when 1
          if rand then 'down' else 'left'
        when 2
          if rand then 'right' else 'down'
        when 3
          if rand then 'up' else 'right'
    else
      switch q
        when 0
          if rand then 'down' else 'left'
        when 1
          if rand then 'left' else 'up'
        when 2
          if rand then 'up' else 'right'
        when 3
          if rand then 'right' else 'down'



module.exports.tight_spiral = (width, height, map) ->
  center_x = Math.floor width/2
  center_y = Math.floor height/2

  (index) ->

    x = index % width
    y = Math.floor index / width

    dx = x - center_x
    dy = y - center_y

    if dx > 0 and dy >= 0
      if Math.random() < Math.abs(dx) / center_x
        'up'
      else
        'right'
    else if dx >= 0 and dy < 0
      if Math.random() < Math.abs(dy) / center_y
        'left'
      else
        'up'
    else if dx < 0 and dy <= 0
      if Math.random() < Math.abs(dx) / center_x
        'down'
      else
        'left'
    else if dx <= 0 and dy > 0
      if Math.random() < Math.abs(dy) / center_y
        'right'
      else
        'down'
    else ['right', 'down', 'left', 'up'][Math.floor(Math.random() * 4)]

module.exports.spiral = (width, height) ->
  center_x = Math.floor width/2
  center_y = Math.floor height/2

  division_angle = Math.floor 360/4
  maxDistance = Math.sqrt(Math.pow(width-center_x, 2) + Math.pow(height-center_y, 2))
  mx = 1
  my = 1

  if width > height
    mx = height/width
  else
    my = width/height

  directions = ['right', 'down', 'left', 'up']

  pointCache = []

  for index in [0 .. width * height - 1]
    x = index % width
    y = Math.floor index / width

    dx = ((x - center_x) * mx)
    dy = ((y - center_y + 1) * my)

    distance = Math.sin((Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) / maxDistance) * 10)
    angle = Math.floor(((((Math.atan2(dy, dx)*180)/Math.PI)+distance).mod(360)/division_angle)*100)/100

    pointCache[index] = angle

  (index) ->
    angle = pointCache[index]

    intp = Math.floor(angle)
    dec = Math.floor((angle-intp)*100)

    direction =  if Math.random()*100 > dec then (intp+1).mod(4) else (intp+2).mod(4)

    directions[direction]