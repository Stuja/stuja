###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Predictable 1d noise maker

  Retrieved from http://www.michaelbromley.co.uk/api/90/simple-1d-noise-in-javascript
  Modified to be a re-usable class
###

lerp = (a, b, t) ->
  a * (1 - t) + b * t


class Simple1DNoise
  MAX_VERTICES: 256
  MAX_VERTICES_MASK: 255
  amplitude: 1
  scale: .015
  r: []

  constructor: (@amplitude, @scale) ->
    for i in [0 .. @MAX_VERTICES]
      @r.push Math.random()

  getVal: (x) =>
    scaledX = x * @scale
    xFloor = Math.floor(scaledX)
    t = scaledX - xFloor
    tRemapSmoothstep = t * t * (3 - (2 * t))
    #/ Modulo using &
    xMin = xFloor & @MAX_VERTICES_MASK
    xMax = xMin + 1 & @MAX_VERTICES_MASK
    y = lerp(@r[xMin], @r[xMax], tRemapSmoothstep)
    y * @amplitude

module.exports = (amplitude, scale) -> new Simple1DNoise(amplitude, scale)