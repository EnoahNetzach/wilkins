/*
 * common.js: Internal helper and utility functions for wilkins
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

import util from 'util'
import cycle from 'cycle'
import config from '../config'
import clone from './clone'
import serialize from './serialize'

//
// ### function log (options)
// #### @options {Object} All information about the log serialization.
// Generic logging function for returning timestamped strings
// with the following options:
//
//    {
//      level:     'level to add to serialized message',
//      message:   'message to serialize',
//      meta:      'additional logging metadata to serialize',
//      colorize:  false, // Colorizes output (only if `.json` is false)
//      align:     false  // Align message level.
//      timestamp: true   // Adds a timestamp to the serialized message
//      label:     'label to prepend the message'
//    }
//
module.exports = function (opts) {
  let options = opts
  const timestampFn = typeof options.timestamp === 'function' ? options.timestamp : require('./timestamp')
  const timestamp = options.timestamp ? timestampFn() : null
  const showLevel = options.showLevel === undefined ? true : options.showLevel
  let meta = options.meta !== null && options.meta !== undefined && !(options.meta instanceof Error)
    ? clone(cycle.decycle(options.meta))
    : options.meta || null
  let output

  //
  // raw mode is intended for outputing wilkins as streaming JSON to STDOUT
  //
  if (options.raw) {
    if (typeof meta !== 'object' && meta != null) {
      meta = { meta }
    }
    output = clone(meta) || {}
    output.level = options.level
    //
    // Remark (jcrugzz): This used to be output.message = options.message.stripColors.
    // I do not know why this is, it does not make sense but im handling that
    // case here as well as handling the case that does make sense which is to
    // make the `output.message = options.message`
    //
    output.message = options.message.stripColors ? options.message.stripColors : options.message

    return JSON.stringify(output)
  }

  //
  // json mode is intended for pretty printing multi-line json to the terminal
  //
  if (options.json || options.logstash === true) {
    if (typeof meta !== 'object' && meta != null) {
      meta = { meta }
    }

    output = clone(meta) || {}
    output.level = options.level
    output.message = output.message || ''

    if (options.label) {
      output.label = options.label
    }
    if (options.message) {
      output.message = options.message
    }
    if (timestamp) {
      output.timestamp = timestamp
    }

    if (options.logstash === true) {
      // use logstash format
      const logstashOutput = {}
      if (output.message !== undefined) {
        logstashOutput['@message'] = output.message
        delete output.message
      }

      if (output.timestamp !== undefined) {
        logstashOutput['@timestamp'] = output.timestamp
        delete output.timestamp
      }

      logstashOutput['@fields'] = clone(output)
      output = logstashOutput
    }

    if (typeof options.stringify === 'function') {
      return options.stringify(output)
    }

    return JSON.stringify(output, (key, value) => value instanceof Buffer ? value.toString('base64') : value)
  }

  //
  // Remark: this should really be a call to `util.format`.
  //
  if (typeof options.formatter === 'function') {
    options.meta = meta
    return String(options.formatter(clone(options)))
  }

  output = timestamp ? `${timestamp} - ` : ''
  if (showLevel) {
    output += options.colorize === 'all' || options.colorize === 'level' || options.colorize === true
      ? config.colorize(options.level)
      : options.level
  }

  output += options.align ? '\t' : ''
  output += timestamp || showLevel ? ': ' : ''
  output += options.label ? `[${options.label}] ` : ''
  output += options.colorize === 'all' || options.colorize === 'message'
    ? config.colorize(options.level, options.message)
    : options.message

  if (meta !== null && meta !== undefined) {
    if (meta && meta instanceof Error && meta.stack) {
      meta = meta.stack
    }

    if (typeof meta !== 'object') {
      output += ` ${meta}`
    } else if (Object.keys(meta).length > 0) {
      if (typeof options.prettyPrint === 'function') {
        output += ` ${options.prettyPrint(meta)}`
      } else if (options.prettyPrint) {
        output += ` \n${util.inspect(meta, false, options.depth || null, options.colorize)}`
      } else if (
        options.humanReadableUnhandledException &&
        Object.keys(meta).length === 5 &&
        meta.date &&
        meta.process &&
        meta.os &&
        meta.trace &&
        meta.stack
      ) {
        //
        // If meta carries unhandled exception data serialize the stack nicely
        //
        const stack = meta.stack
        delete meta.stack
        delete meta.trace
        output += ` ${serialize(meta)}`

        if (stack) {
          output += `\n${stack.join('\n')}`
        }
      } else {
        output += ` ${serialize(meta)}`
      }
    }
  }

  return output
}
