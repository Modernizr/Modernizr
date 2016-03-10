// handles parsing positional arguments,
// and populating argv with said positional
// arguments.
module.exports = function (yargs, usage, validation) {
  var self = {}

  var handlers = {}
  self.addHandler = function (cmd, description, builder, handler) {
    // allow a module to be provided for a command.
    if (typeof builder === 'object' && builder.builder && typeof builder.handler === 'function') {
      self.addHandler(cmd, description, builder.builder, builder.handler)
      return
    }

    if (description !== false) {
      usage.command(cmd, description)
    }

    // we should not register a handler if no
    // builder is provided, e.g., user will
    // handle command themselves with '_'.
    var parsedCommand = parseCommand(cmd)
    handlers[parsedCommand.cmd] = {
      original: cmd,
      handler: handler,
      builder: builder,
      demanded: parsedCommand.demanded,
      optional: parsedCommand.optional
    }
  }

  function parseCommand (cmd) {
    var splitCommand = cmd.split(/\s/)
    var bregex = /[\][<>]/g
    var parsedCommand = {
      cmd: (splitCommand.shift()).replace(bregex, ''),
      demanded: [],
      optional: []
    }
    splitCommand.forEach(function (cmd) {
      if (/^\[/.test(cmd)) parsedCommand.optional.push(cmd.replace(bregex, ''))
      else parsedCommand.demanded.push(cmd.replace(bregex, ''))
    })
    return parsedCommand
  }

  self.getCommands = function () {
    return Object.keys(handlers)
  }

  self.getCommandHandlers = function () {
    return handlers
  }

  self.runCommand = function (command, yargs, parsed) {
    var argv = parsed.argv
    var commandHandler = handlers[command]
    var innerArgv = argv
    if (commandHandler.builder && typeof commandHandler.builder === 'function') {
      // a function can be provided, which interacts which builds
      // up a yargs chain and returns it.
      innerArgv = commandHandler.builder(yargs.reset(parsed.aliases))
      // if the builder function did not yet parse argv with reset yargs
      // and did not explicitly set a usage() string, then apply the
      // original command string as usage() for consistent behavior with
      // options object below
      if (yargs.parsed === false && typeof yargs.getUsageInstance().getUsage() === 'undefined') {
        yargs.usage('$0 ' + commandHandler.original)
      }
      innerArgv = innerArgv ? innerArgv.argv : argv
    } else if (commandHandler.builder && typeof commandHandler.builder === 'object') {
      // as a short hand, an object can instead be provided, specifying
      // the options that a command takes.
      innerArgv = yargs.reset(parsed.aliases)
      innerArgv.usage('$0 ' + commandHandler.original)
      Object.keys(commandHandler.builder).forEach(function (key) {
        innerArgv.option(key, commandHandler.builder[key])
      })
      innerArgv = innerArgv.argv
    }

    populatePositional(commandHandler, innerArgv)

    if (commandHandler.handler) {
      commandHandler.handler(innerArgv)
    }
    return innerArgv
  }

  function populatePositional (commandHandler, argv) {
    var cmd = argv._.shift() // nuke the first argument (the current command)
    var demanded = commandHandler.demanded.slice(0)
    var optional = commandHandler.optional.slice(0)

    validation.positionalCount(demanded.length, argv._.length)

    while (demanded.length) {
      if (!argv._.length) break
      var demand = demanded.shift()
      argv[demand] = argv._.shift()
    }

    while (optional.length) {
      if (!argv._.length) break
      var maybe = optional.shift()
      argv[maybe] = argv._.shift()
    }

    argv._.unshift(cmd)
  }

  self.reset = function () {
    handlers = {}
    return self
  }

  return self
}
