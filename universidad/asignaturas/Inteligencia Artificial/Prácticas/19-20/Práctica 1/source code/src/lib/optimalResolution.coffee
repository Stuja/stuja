###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Calculates the width and height that gives approximately the total area at the ratio of the screen size
###

module.exports = (width, height, ideal) ->
  ###
  if(width > height)
    s1 = Math.round((width/height)*100)/100
    s2 = Math.floor(ideal/s1)
    s3 = Math.floor(Math.sqrt(s2))
    dx = Math.floor(s1*s3)
    dy = s3
  else
    s1 = Math.round((height/width)*100)/100
    s2 = Math.floor(ideal/s1)
    s3 = Math.floor(Math.sqrt(s2))
    dy = Math.floor(s1*s3)
    dx = s3
  [dx, dy]
  ###

  [l, s] = if width > height then [width, height] else [height, width]

  [
    Math.floor((l/s) * Math.sqrt(ideal/(width / height)))
    Math.sqrt(ideal/(width / height))
  ]