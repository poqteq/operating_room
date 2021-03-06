function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the grid of axis
 * @author sima.zhang
 */
var _require = require('../../renderer'),
    Group = _require.Group;

var Util = require('../../util');

var Grid = function (_Group) {
  _inherits(Grid, _Group);

  function Grid() {
    _classCallCheck(this, Grid);

    return _possibleConstructorReturn(this, _Group.apply(this, arguments));
  }

  Grid.prototype.getDefaultCfg = function getDefaultCfg() {
    return {
      zIndex: 1,
      /**
       * 栅格线的类型
       *  - line 不封闭的线
       *  - polygon 封闭的多边形
       * @type {String}
       */
      type: 'line',
      /**
       * 线的样式配置
       * @type {Object}
       */
      lineStyle: null,
      /**
       * 线集合的配置
       * @type {Array}
       */
      items: null,
      /**
       * 为网格设置交替的背景色，指定一个值则先渲染奇数层，两个值则交替渲染
       * @type {String | Array}
       */
      alternateColor: null,
      matrix: null,
      /**
       * 是否隐藏第一条网格线，默认为 false
       * @type {Boolean}
       */
      hideFirstLine: false,
      /**
       * 是否隐藏最后一条网格线，默认为 false
       * @type {Boolean}
       */
      hideLastLine: false,
      /**
       * 0基线不在轴线上时，是否强调0基线
       * @type {Boolean}
       */
      hightLightZero: true,
      /**
       * 0基线样式
       * @type {Object}
       */
      zeroLineStyle: { stroke: '#000', lineDash: [0, 0] }
    };
  };

  Grid.prototype._renderUI = function _renderUI() {
    _Group.prototype._renderUI.call(this);
    this._drawLines();
  };

  Grid.prototype._drawLines = function _drawLines() {
    var self = this;
    var lineStyle = self.get('lineStyle');
    var items = self.get('items');
    if (items && items.length) {
      self._precessItems(items);
      self._drawGridLines(items, lineStyle);
    }
  };

  Grid.prototype._precessItems = function _precessItems(items) {
    var self = this;
    var preItem = void 0;
    Util.each(items, function (item, index) {
      if (preItem && self.get('alternateColor')) {
        self._drawAlternativeBg(item, preItem, index);
      }
      preItem = item;
    });
  };

  Grid.prototype._drawGridLines = function _drawGridLines(items, lineStyle) {
    var self = this;
    var type = this.get('type');

    var gridLine = void 0;
    var path = void 0;
    var cfg = void 0;
    var points = void 0;
    var itemsLength = items.length;

    if (type === 'line' || type === 'polygon') {
      Util.each(items, function (item, idx) {
        if (self.get('hideFirstLine') && idx === 0) {
          // 不展示第一条网格线
          return;
        }
        if (self.get('hideLastLine') && idx === itemsLength - 1) {
          // 不展示最后一条网格线
          return;
        }

        points = item.points;
        path = [];
        if (type === 'line') {
          path.push(['M', points[0].x, points[0].y]);
          path.push(['L', points[points.length - 1].x, points[points.length - 1].y]);
        } else {
          Util.each(points, function (point, index) {
            if (index === 0) {
              path.push(['M', point.x, point.y]);
            } else {
              path.push(['L', point.x, point.y]);
            }
          });
        }

        if (self._drawZeroLine(type, idx)) {
          cfg = Util.mix({}, self.get('zeroLineStyle'), {
            path: path
          });
        } else {
          cfg = Util.mix({}, lineStyle, {
            path: path
          });
        }

        gridLine = self.addShape('path', {
          attrs: cfg
        });
        gridLine.name = 'axis-grid';
        gridLine._id = item._id;
        gridLine.set('coord', self.get('coord'));
        self.get('appendInfo') && gridLine.setSilent('appendInfo', self.get('appendInfo'));
      });
    } else {
      Util.each(items, function (item, idx) {
        if (self.get('hideFirstLine') && idx === 0) {
          // 不展示第一条网格线
          return;
        }
        if (self.get('hideLastLine') && idx === itemsLength - 1) {
          // 不展示最后一条网格线
          return;
        }

        points = item.points;
        path = [];
        Util.each(points, function (point, index) {
          var radius = point.radius;
          if (index === 0) {
            path.push(['M', point.x, point.y]);
          } else {
            path.push(['A', radius, radius, 0, 0, point.flag, point.x, point.y]);
          }
        });
        cfg = Util.mix({}, lineStyle, {
          path: path
        });
        gridLine = self.addShape('path', {
          attrs: cfg
        });
        gridLine.name = 'axis-grid';
        gridLine._id = item._id;
        gridLine.set('coord', self.get('coord'));
        self.get('appendInfo') && gridLine.setSilent('appendInfo', self.get('appendInfo'));
      });
    }
  };

  Grid.prototype._drawZeroLine = function _drawZeroLine(type, idx) {
    var self = this;
    var tickValues = self.get('tickValues');
    if (type === 'line' && tickValues) {
      if (tickValues[idx] === 0 && self.get('hightLightZero')) {
        return true;
      }
    }
    return false;
  };

  Grid.prototype._drawAlternativeBg = function _drawAlternativeBg(item, preItem, index) {
    var self = this;
    var alternateColor = self.get('alternateColor');
    var attrs = void 0;
    var oddColor = void 0;
    var evenColor = void 0;

    if (Util.isString(alternateColor)) {
      oddColor = alternateColor;
    } else if (Util.isArray(alternateColor)) {
      oddColor = alternateColor[0];
      evenColor = alternateColor[1];
    }

    if (index % 2 === 0) {
      if (evenColor) {
        attrs = self._getBackItem(preItem.points, item.points, evenColor);
      }
    } else if (oddColor) {
      attrs = self._getBackItem(preItem.points, item.points, oddColor);
    }

    var shape = self.addShape('Path', {
      attrs: attrs
    });
    shape.name = 'axis-grid-rect';
    shape._id = item._id && item._id.replace('grid', 'grid-rect');
    shape.set('coord', self.get('coord'));
    self.get('appendInfo') && shape.setSilent('appendInfo', self.get('appendInfo'));
  };

  Grid.prototype._getBackItem = function _getBackItem(start, end, bgColor) {
    var path = [];
    var type = this.get('type');

    if (type === 'line') {
      path.push(['M', start[0].x, start[0].y]);
      path.push(['L', start[start.length - 1].x, start[start.length - 1].y]);
      path.push(['L', end[end.length - 1].x, end[end.length - 1].y]);
      path.push(['L', end[0].x, end[0].y]);
      path.push(['Z']);
    } else if (type === 'polygon') {
      Util.each(start, function (subItem, index) {
        if (index === 0) {
          path.push(['M', subItem.x, subItem.y]);
        } else {
          path.push(['L', subItem.x, subItem.y]);
        }
      });
      for (var i = end.length - 1; i >= 0; i--) {
        path.push(['L', end[i].x, end[i].y]);
      }
      path.push(['Z']);
    } else {
      var flag = start[0].flag;
      Util.each(start, function (subItem, index) {
        var radius = subItem.radius;
        if (index === 0) {
          path.push(['M', subItem.x, subItem.y]);
        } else {
          path.push(['A', radius, radius, 0, 0, subItem.flag, subItem.x, subItem.y]);
        }
      });
      for (var j = end.length - 1; j >= 0; j--) {
        var endSubItem = end[j];
        var endRadius = endSubItem.radius;
        if (j === end.length - 1) {
          path.push(['M', endSubItem.x, endSubItem.y]);
        } else {
          path.push(['A', endRadius, endRadius, 0, 0, flag === 1 ? 0 : 1, endSubItem.x, endSubItem.y]);
        }
      }
    }

    return {
      fill: bgColor,
      path: path
    };
  };

  return Grid;
}(Group);

module.exports = Grid;