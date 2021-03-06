function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the circle axis of polar coordinate
 * @author sima.zhang
 */
var Util = require('../../util');
var Base = require('./base');
var vec2 = Util.MatrixUtil.vec2;

var Circle = function (_Base) {
  _inherits(Circle, _Base);

  function Circle() {
    _classCallCheck(this, Circle);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Circle.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);

    return Util.mix({}, cfg, {
      /**
       * 坐标轴的类型
       * @type {String}
       */
      type: 'circle',
      /**
       * 指定刻度之间的间距
       * @type {Number}
       */
      tickInterval: null,
      /**
       * 开始弧度
       * @type {Number}
       */
      startAngle: -Math.PI / 2,
      /**
       * 结束弧度
       * @type {Number}
       */
      endAngle: Math.PI * 3 / 2,
      line: { // @type {Attrs} 坐标轴线的图形属性,如果设置成null，则不显示轴线
        lineWidth: 1,
        stroke: '#C0D0E0'
      },
      tickLine: { // @type {Attrs} 标注坐标线的图形属性
        lineWidth: 1,
        stroke: '#C0D0E0',
        length: 5
      },
      /**
       * 默认文本距离轴线的距离
       * @type {Number}
       */
      _labelOffset: 5
    });
  };

  Circle.prototype.parseTick = function parseTick(tick, index, length) {
    return {
      text: tick,
      value: index / length
    };
  };

  Circle.prototype._getCirclePoint = function _getCirclePoint(angle, radius) {
    var self = this;
    var center = self.get('center');
    radius = radius || self.get('radius');
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    };
  };

  Circle.prototype.getTickPoint = function getTickPoint(value) {
    var self = this;
    var startAngle = self.get('startAngle');
    var endAngle = self.get('endAngle');
    var angle = startAngle + (endAngle - startAngle) * value;
    return self._getCirclePoint(angle);
  };

  Circle.prototype.getSideVector = function getSideVector(offset, point) {
    var self = this;
    var center = self.get('center');
    var vector = [point.x - center.x, point.y - center.y];
    if (!Util.isNil(offset)) {
      var vecLen = vec2.length(vector);
      vec2.scale(vector, vector, offset / vecLen);
    }
    return vector;
  };

  Circle.prototype.getSidePoint = function getSidePoint(point, offset) {
    var self = this;
    var vector = self.getSideVector(offset, point);

    return {
      x: point.x + vector[0],
      y: point.y + vector[1]
    };
  };

  Circle.prototype.getTickEnd = function getTickEnd(start, length) {
    var self = this;
    var tickLine = self.get('tickLine');
    length = length ? length : tickLine.length;
    return self.getSidePoint(start, length);
  };

  Circle.prototype.getTextAnchor = function getTextAnchor(vector) {
    var align = void 0;
    if (Util.snapEqual(vector[0], 0)) {
      align = 'center';
    } else if (vector[0] > 0) {
      align = 'left';
    } else if (vector[0] < 0) {
      align = 'right';
    }
    return align;
  };

  Circle.prototype.getLinePath = function getLinePath() {
    var self = this;
    var center = self.get('center');
    var x = center.x;
    var y = center.y;
    var rx = self.get('radius');
    var ry = rx;
    var startAngle = self.get('startAngle');
    var endAngle = self.get('endAngle');
    var inner = self.get('inner');

    var path = [];
    if (Math.abs(endAngle - startAngle) === Math.PI * 2) {
      path = [['M', x, y], ['m', 0, -ry], ['a', rx, ry, 0, 1, 1, 0, 2 * ry], ['a', rx, ry, 0, 1, 1, 0, -2 * ry], ['z']];
    } else {
      var startPoint = self._getCirclePoint(startAngle);
      var endPoint = self._getCirclePoint(endAngle);
      var large = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
      var sweep = startAngle > endAngle ? 0 : 1;
      if (!inner) {
        path = [['M', x, y], ['L', startPoint.x, startPoint.y], ['A', rx, ry, 0, large, sweep, endPoint.x, endPoint.y], ['L', x, y]];
      } else {
        var innerStartVector = self.getSideVector(inner * rx, startPoint);
        var innerEndVector = self.getSideVector(inner * rx, endPoint);
        var innerStartPoint = {
          x: innerStartVector[0] + x,
          y: innerStartVector[1] + y
        };
        var innerEndPoint = {
          x: innerEndVector[0] + x,
          y: innerEndVector[1] + y
        };

        path = [['M', innerStartPoint.x, innerStartPoint.y], ['L', startPoint.x, startPoint.y], ['A', rx, ry, 0, large, sweep, endPoint.x, endPoint.y], ['L', innerEndPoint.x, innerEndPoint.y], ['A', rx * inner, ry * inner, 0, large, Math.abs(sweep - 1), innerStartPoint.x, innerStartPoint.y]];
      }
    }
    return path;
  };

  Circle.prototype.addLabel = function addLabel(tick, point, index) {
    var self = this;
    var offset = self.get('label').offset || self.get('_labelOffset') || 0.001;
    point = self.getSidePoint(point, offset);
    _Base.prototype.addLabel.call(this, tick, point, index);
  };

  Circle.prototype.autoRotateLabels = function autoRotateLabels() {
    var self = this;
    var ticks = self.get('ticks');
    var labelsGroup = self.get('labelsGroup');
    if (labelsGroup && ticks.length > 12) {
      // 小于12个文本时文本不旋转
      var radius = self.get('radius');
      var startAngle = self.get('startAngle');
      var endAngle = self.get('endAngle');
      var totalAngle = endAngle - startAngle;
      var avgAngle = totalAngle / (ticks.length - 1);
      var avgWidth = Math.sin(avgAngle / 2) * radius * 2;
      var maxLength = self.getMaxLabelWidth(labelsGroup);
      Util.each(labelsGroup.get('children'), function (label, index) {
        var tick = ticks[index];
        var angle = tick.value * totalAngle + startAngle;
        var mode = angle % (Math.PI * 2);
        if (maxLength < avgWidth) {
          // 文本的最大宽度大于
          if (mode <= 0) {
            angle = angle + Math.PI;
          }
          if (mode > Math.PI) {
            angle = angle - Math.PI;
          }
          angle = angle - Math.PI / 2;
          label.attr('textAlign', 'center');
        } else {
          if (mode > Math.PI / 2) {
            angle = angle - Math.PI;
          } else if (mode < Math.PI / 2 * -1) {
            angle = angle + Math.PI;
          }
        }
        label.rotateAtStart(angle);
      });
    }
  };

  return Circle;
}(Base);

module.exports = Circle;