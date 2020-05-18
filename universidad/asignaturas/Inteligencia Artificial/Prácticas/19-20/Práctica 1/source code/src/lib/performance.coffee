###
  color-pond
  Kevin Gravier 2016
  GPL-3.0 License

  Shim for browser missing the window.performance object
###

module.exports =
  window.performance or offset: Date.now(), now: -> Date.now() - @.offset