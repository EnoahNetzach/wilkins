/*
 * common.js: Internal helper and utility functions for wilkins
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

//
// ### function pad (n)
// Returns a padded string if `n < 10`.
//
module.exports = function (n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
};
