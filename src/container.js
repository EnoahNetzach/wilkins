/*
 * container.js: Inversion of control container for wilkins logger instances
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

import capitalize from './common/capitalize'
import wilkins from './wilkins'
import { _extend as extend } from 'util'
import { Console } from './transports/console'

//
// ### function Container (options)
// #### @options {Object} Default pass-thru options for Loggers
// Constructor function for the Container object responsible for managing
// a set of `wilkins.Logger` instances based on string ids.
//
const Container = exports.Container = function (options) {
  this.loggers = {}
  this.options = options || {}
  this.default = {
    transports: [
      new Console({
        level: 'silly',
        colorize: false,
      }),
    ],
  }
}

//
// ### function get / add (id, options)
// #### @id {string} Id of the Logger to get
// #### @options {Object} **Optional** Options for the Logger instance
// Retreives a `wilkins.Logger` instance for the specified `id`. If
// an instance does not exist, one is created.
//
Container.prototype.get = Container.prototype.add = function (id, opts) {
  let existing
  let options = opts

  if (!this.loggers[id]) {
    //
    // Remark: Simple shallow clone for configuration options in case we pass in
    // instantiated protoypal objects
    //
    options = extend({}, options || this.options || this.default)
    existing = options.transports || this.options.transports
    //
    // Remark: Make sure if we have an array of transports we slice it to make copies
    // of those references.
    //
    options.transports = existing ? existing.slice() : []

    if (options.transports.length === 0 && (!options || !options.console)) {
      options.transports.push(this.default.transports[0])
    }

    Object.keys(options).forEach((key) => {
      if (key === 'transports') {
        return
      }

      const name = capitalize(key)

      if (!wilkins.transports[name]) {
        throw new Error(`Cannot add unknown transport: ${name}`)
      }

      const namedOptions = options[key]
      namedOptions.id = id
      options.transports.push(new wilkins.transports[name](namedOptions))
    })

    options.id = id
    this.loggers[id] = new wilkins.Logger(options)

    this.loggers[id].on('close', () => {
      this._delete(id)
    })
  }

  return this.loggers[id]
}

//
// ### function close (id)
// #### @id {string} **Optional** Id of the Logger instance to find
// Returns a boolean value indicating if this instance
// has a logger with the specified `id`.
//
Container.prototype.has = function (id) {
  return !!this.loggers[id]
}

//
// ### function close (id)
// #### @id {string} **Optional** Id of the Logger instance to close
// Closes a `Logger` instance with the specified `id` if it exists.
// If no `id` is supplied then all Loggers are closed.
//
Container.prototype.close = function (id) {
  const self = this

  function _close(id) {
    if (!self.loggers[id]) {
      return
    }

    self.loggers[id].close()
    self._delete(id)
  }

  return id ? _close(id) : Object.keys(this.loggers).forEach((id) => {
    _close(id)
  })
}

//
// ### @private function _delete (id)
// #### @id {string} Id of the Logger instance to delete from container
// Deletes a `Logger` instance with the specified `id`.
//
Container.prototype._delete = function (id) {
  delete this.loggers[id]
}
