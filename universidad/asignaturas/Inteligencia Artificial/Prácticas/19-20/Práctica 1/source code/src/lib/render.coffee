###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Simple renderer. More to come here in time
###

holder = document.getElementById 'main_holder'
canvas = document.getElementById 'main'
canvas.style.backgroundColor = 'rgba(0, 0, 0, 255)'

context = canvas.getContext '2d'
context.imageSmoothingEnabled = false;

image_data = null

module.exports.setSize = (width, height, x, y) ->
  holder.style.width = "#{width}px"
  holder.style.height = "#{height}px"
  context.canvas.width = x
  context.canvas.height = y
  image_data = context.createImageData x, y

module.exports.writeImage = (data) ->
  image_data.data[i]=v for v, i in data
  context.putImageData(image_data, 0, 0)
