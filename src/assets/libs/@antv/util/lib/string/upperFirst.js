var toString = require('../toString');

var upperFirst = function upperFirst(value) {
  var str = toString(value);
  return str.charAt(0).toUpperCase() + str.substring(1);
};

module.exports = upperFirst;