var assign = require('lodash/assign');
var flattenDeep = require('lodash/flattenDeep');
var forIn = require('lodash/forIn');
var isArray = require('lodash/isArray');
var isString = require('lodash/isString');
var keys = require('lodash/keys');
var uniq = require('lodash/uniq');
var simpleStatistics = require('simple-statistics');
var partition = require('../util/partition');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../constants'),
    STATISTICS_METHODS = _require2.STATISTICS_METHODS;

var _require3 = require('../util/option-parser'),
    getFields = _require3.getFields;

var DEFAULT_OPTIONS = {
  as: [],
  fields: [],
  groupBy: [],
  operations: []
};
var DEFAULT_OPERATION = 'count';

var aggregates = {
  count: function count(data) {
    return data.length;
  },
  distinct: function distinct(data, field) {
    var values = uniq(data.map(function (row) {
      return row[field];
    }));
    return values.length;
  }
};
STATISTICS_METHODS.forEach(function (method) {
  aggregates[method] = function (data, field) {
    var values = data.map(function (row) {
      return row[field];
    });
    if (isArray(values) && isArray(values[0])) {
      values = flattenDeep(values);
    }
    return simpleStatistics[method](values);
  };
});
aggregates.average = aggregates.mean;

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var rows = dataView.rows;
  var dims = options.groupBy;
  var fields = getFields(options);
  if (!isArray(fields)) {
    throw new TypeError('Invalid fields: it must be an array with one or more strings!');
  }
  var outputNames = options.as || [];
  if (isString(outputNames)) {
    outputNames = [outputNames];
  }
  var operations = options.operations;
  if (isString(operations)) {
    operations = [operations];
  }
  var DEFAULT_OPERATIONS = [DEFAULT_OPERATION];
  if (!isArray(operations) || !operations.length) {
    console.warn('operations is not defined, will use [ "count" ] directly.');
    operations = DEFAULT_OPERATIONS;
    outputNames = operations;
  }
  if (!(operations.length === 1 && operations[0] === DEFAULT_OPERATION)) {
    if (operations.length !== fields.length) {
      throw new TypeError('Invalid operations: it\'s length must be the same as fields!');
    }
    if (outputNames.length !== fields.length) {
      throw new TypeError('Invalid as: it\'s length must be the same as fields!');
    }
  }
  var groups = partition(rows, dims);
  var results = [];
  forIn(groups, function (group) {
    // const result = pick(group[0], dims);
    var result = group[0];
    operations.forEach(function (operation, i) {
      var outputName = outputNames[i];
      var field = fields[i];
      result[outputName] = aggregates[operation](group, field);
    });
    results.push(result);
  });
  dataView.rows = results;
}

registerTransform('aggregate', transform);
registerTransform('summary', transform);

module.exports = {
  VALID_AGGREGATES: keys(aggregates)
};