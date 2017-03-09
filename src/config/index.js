/*
 * config.js: Default settings for all levels that wilkins knows about
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

import chalk from 'chalk'
import cliConfig from '../config/cli-config'
import npmConfig from '../config/npm-config'
import syslogConfig from '../config/syslog-config'

// Fix colors not appearing in non-tty environments
chalk.enabled = true

const config = exports
const allColors = exports.allColors = {}

function mixin(target, ...args) {
  args.forEach((arg) => {
    const keys = Object.keys(arg)
    for (let i = 0; i < keys.length; i++) {
      target[keys[i]] = arg[keys[i]]
    }
  })
  return target
}

config.addColors = function (colors) {
  mixin(allColors, colors)
}

config.colorize = function (level, message) {
  if (typeof message === 'undefined') message = level

  let colorized = message
  if (allColors[level] instanceof Array) {
    for (let i = 0, l = allColors[level].length; i < l; ++i) {
      colorized = chalk[allColors[level][i]](colorized)
    }
  } else if (allColors[level].match(/\s/)) {
    const colorArr = allColors[level].split(/\s+/)
    for (let i = 0; i < colorArr.length; ++i) {
      colorized = chalk[colorArr[i]](colorized)
    }
    allColors[level] = colorArr
  } else {
    colorized = chalk[allColors[level]](colorized)
  }

  return colorized
}

//
// Export config sets
//
config.cli = cliConfig
config.npm = npmConfig
config.syslog = syslogConfig

//
// Add colors for pre-defined config sets
//
config.addColors(config.cli.colors)
config.addColors(config.npm.colors)
config.addColors(config.syslog.colors)
