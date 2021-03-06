var isFunction = require('./type/isFunction');
var isEqual = require('./isEqual');
/**
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [fn] The function to customize comparisons.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * function isGreeting(value) {
 *   return /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue, othValue) {
 *   if (isGreeting(objValue) && isGreeting(othValue)) {
 *     return true;
 *   }
 * }
 *
 * var array = ['hello', 'goodbye'];
 * var other = ['hi', 'goodbye'];
 *
 * _.isEqualWith(array, other, customizer);  // => true
 */

var isEqualWith = function isEqualWith(value, other, fn) {
  if (!isFunction(fn)) {
    return isEqual(value, other);
  }
  return !!fn(value, other);
};

module.exports = isEqualWith;