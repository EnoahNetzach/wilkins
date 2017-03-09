/*
 * common.js: Internal helper and utility functions for wilkins
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

//
// ### function longestElement
// #### @xs {Array} Array to calculate against
// Returns the longest element in the `xs` array.
//
module.exports = function (xs) {
  return Math.max.apply(
    null,
    xs.map(function (x) { return x.length; })
  );
};
