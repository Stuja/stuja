###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Handles the adjustment of options
###

class OptionManager
  constructor: (@listener) ->
    @variables = {}
    @option_holder = document.getElementById('options')

  clearOptions: ->
    @option_holder.innerHTML = ""

  addOptions: ->
    @clearOptions()
    self = @
    for type, options of @variables
      holder = document.createElement('div')
      holder.classList.add('type')

      header = document.createElement('h2')
      header.textContent = type

      holder.appendChild(header)

      for option, value of options
        label = document.createElement('label')
        label.textContent = option.replace(/_/g, ' ')
        label.style.textTransform = 'capitalize'

        input = document.createElement('input')
        input.setAttribute('type', 'number')
        input.value = value
        input.dataset['type'] = type
        input.dataset['option'] = option
        input.addEventListener('input', ->
          element = @
          if element.dataset.updateTimeout then clearTimeout element.dataset.updateTimeout
          element.dataset.updateTimeout = setTimeout(( ->
            self.writeValue(element.dataset.type, element.dataset.option, element.value)
            element.dataset.updateTimeout = null
            element.style.backgroundColor = '#ddd'
            setTimeout(( -> element.style.backgroundColor = '#fff'), 100)
          ), 500)

        )

        holder.appendChild(label)
        holder.appendChild(document.createElement('br'))
        holder.appendChild(input)
        holder.appendChild(document.createElement('br'))

      @option_holder.appendChild(holder)
    null

  writeValue: (type, option, value) ->
    @listener(type, option, parseFloat(value))

  setVariables: (variables) ->
    @variables = variables
    @addOptions()

module.exports = OptionManager