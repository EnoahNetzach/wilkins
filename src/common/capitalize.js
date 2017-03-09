/*
 * common.js: Internal helper and utility functions for wilkins
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

module.exports = function (str) {
  return str && str[0].toUpperCase() + str.slice(1)
}
