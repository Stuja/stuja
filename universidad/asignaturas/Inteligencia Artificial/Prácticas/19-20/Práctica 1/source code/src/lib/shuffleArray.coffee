###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Simple way to shuffle array
###

module.exports = (array) ->
  counter = array.length
  # While there are elements in the array
  while counter > 0
    # Pick a random index
    index = Math.floor(Math.random() * counter)
    # Decrease counter by 1
    counter--
    # And swap the last element with it
    temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  array