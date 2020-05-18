###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Does everything needed in the main browser thread, including starting the webworker. Need to move a lot
  of this logic to separate files
###

fps_target = 20

render = require './lib/render'
fps = require('./lib/fps')()
OptionManager = require('./lib/optionManager')

worker = new Worker('build/process.js');
right_panel = document.getElementById('right_panel')
canvas = document.getElementById('main')
stats = document.getElementById('stats')
flow_selector = document.getElementById('flow')
seed_holder = document.getElementById('seed_holder')
seed = document.getElementById('seed')
options = document.getElementById('options')

seed.value = Math.round(Math.random() * 10000000)

width = height = Math.min(window.innerHeight, window.innerWidth)

[x, y] = require('./lib/optimalResolution')(width, height, 80000)

stats.textContent = "TPS: ?? | FPS: ??"
render.setSize width, height, x, y

did_init = false

optionManager = new OptionManager((type, variable, value) -> worker.postMessage ['updateVariable', type, variable, value])

worker.postMessage ['getVariables']
worker.onmessage = (e) ->
  switch e.data[0]
    when 'imageData'
      fps.tick()
      render.writeImage e.data[1]
    when 'tpm'
      stats.textContent = "TPS: #{Math.round(e.data[1])} | FPS: #{Math.round(fps.getFps())}"
    when 'initialized'
      setInterval ( ->
        worker.postMessage ['sendTPS']
      ), 1000

      setInterval ( ->
        worker.postMessage ['sendImageData']
      ), 1000 / fps_target
      worker.postMessage ['start']
    when 'variables'
      optionManager.setVariables(e.data[1])

canvas.addEventListener 'click', ->
  if right_panel.classList.contains('show')
    right_panel.classList.remove('show')
  else
    right_panel.classList.add('show')
  true

document.getElementById('start').addEventListener 'click', ->
  if did_init
    worker.postMessage ['start']
  else
    worker.postMessage ['init', x, y, seed.value, flow.value]
    right_panel.classList.remove('show')
    seed.setAttribute('readonly', 'readonly')

document.getElementById('stop').addEventListener('click', -> worker.postMessage ['stop']);

document.getElementById('toggle_pixel').addEventListener 'click', ->
  if canvas.classList.contains('pixeled')
    canvas.classList.remove('pixeled')
  else
    canvas.classList.add('pixeled')

flow_selector.addEventListener 'change', ->
  worker.postMessage ['setFlowType', this.value]

