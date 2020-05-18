###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Simple object to keep track of FPS
###

module.exports = ->
  filter_strength = 20
  frame_time = 0
  last_loop = new Date()
  {
    tick : ->
      this_loop = new Date
      this_time = this_loop - last_loop
      frame_time += (this_time - frame_time) / filter_strength
      last_loop = this_loop
    getFps : ->
      1000 / frame_time
  }


