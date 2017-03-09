/*
 * common.js: Internal helper and utility functions for wilkins
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

//
// ### function timestamp ()
// Returns a timestamp string for the current time.
//
module.exports = function () {
  return new Date().toISOString()
}
