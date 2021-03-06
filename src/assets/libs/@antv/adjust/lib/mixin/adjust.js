var DEFAULT_Y = 0; // 默认的y的值
var each = require('@antv/util/lib/each');
var ArrayUtil = {
  values: require('@antv/util/lib/array/values')
};
module.exports = {
  /**
   * 对应的维度是否可以调整
   * @protected
   * @param  {String}  dimName 可以调整的维度 x,y
   * @return {Boolean} 是否可以调整
   */
  isAdjust: function isAdjust(dimName) {
    return this.adjustNames.indexOf(dimName) >= 0;
  },

  /**
   * @protected
   * 获取可调整度量对应的值
   * @param  {Frame} mergeData 数据
   * @return {Object} 值的映射
   */
  _getDimValues: function _getDimValues(mergeData) {
    var self = this;
    var valuesMap = {};
    var dims = [];
    if (self.xField && self.isAdjust('x')) {
      dims.push(self.xField);
    }
    if (self.yField && self.isAdjust('y')) {
      dims.push(self.yField);
    }
    each(dims, function (dim) {
      var values = ArrayUtil.values(mergeData, dim);
      values.sort(function (v1, v2) {
        return v1 - v2;
      });
      valuesMap[dim] = values;
    });
    if (!self.yField && self.isAdjust('y')) {
      // 只有一维的情况下,同时调整y
      var dim = 'y';
      var values = [DEFAULT_Y, 1]; // 默认分布在y轴的 0.1 与 0.2 之间
      valuesMap[dim] = values;
    }
    return valuesMap;
  },
  adjustData: function adjustData(dataArray, mergeData) {
    var self = this;
    var valuesMap = self._getDimValues(mergeData);
    each(dataArray, function (data, index) {
      // 遍历所有数据集合
      each(valuesMap, function (values, dim) {
        // 根据不同的度量分别调整位置
        self.adjustDim(dim, values, data, dataArray.length, index);
      });
    });
  },
  getAdjustRange: function getAdjustRange(dim, key, values) {
    var self = this;
    var index = values.indexOf(key);
    var length = values.length;
    var pre = void 0;
    var next = void 0;
    if (!self.yField && self.isAdjust('y')) {
      pre = 0;
      next = 1;
    } else if (length > 1) {
      pre = index === 0 ? values[0] : values[index - 1];
      next = index === length - 1 ? values[length - 1] : values[index + 1];

      if (index !== 0) {
        pre += (key - pre) / 2;
      } else {
        pre -= (next - key) / 2;
      }
      if (index !== length - 1) {
        next -= (next - key) / 2;
      } else {
        next += (key - values[length - 2]) / 2;
      }
    } else {
      pre = key === 0 ? 0 : key - 0.5;
      next = key === 0 ? 1 : key + 0.5;
    }

    return {
      pre: pre,
      next: next
    };
  },

  /**
   * 对数据进行分组
   * @param  {Array} data 数据
   * @param  {String} dim 分组的字段
   * @return {Object}  分组的键值对映射
   */
  groupData: function groupData(data, dim) {
    var groups = {};

    each(data, function (record) {
      var value = record[dim];
      if (value === undefined) {
        value = record[dim] = DEFAULT_Y;
      }
      if (!groups[value]) {
        groups[value] = [];
      }
      groups[value].push(record);
    });

    return groups;
  }
};