function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileOverview The controller of tooltip
 * @author sima.zhang
 */
var Util = require('../../util');
var Tooltip = require('../../component/tooltip');
var MatrixUtil = Util.MatrixUtil;
var Vector2 = MatrixUtil.vec2;

var TYPE_SHOW_MARKERS = ['line', 'area', 'path', 'areaStack']; // 默认展示 tooltip marker 的几何图形
var TYPE_SHOW_CROSSHAIRS = ['line', 'area']; // 默认展示十字瞄准线的几何图形

// TODO FIXME this is HARD CODING
var IGNORE_TOOLTIP_ITEM_PROPERTIES = ['marker', 'showMarker'];

function _indexOfArray(items, item) {
  var rst = -1;
  Util.each(items, function (sub, index) {
    var isEqual = true;
    for (var key in item) {
      if (item.hasOwnProperty(key) && IGNORE_TOOLTIP_ITEM_PROPERTIES.indexOf(key) === -1) {
        if (!Util.isObject(item[key]) && item[key] !== sub[key]) {
          isEqual = false;
          break;
        }
      }
    }
    if (isEqual) {
      rst = index;
      return false;
    }
  });
  return rst;
}

// 判断是否有样式
function _hasClass(dom, className) {
  if (!dom) {
    return false;
  }
  var cls = '';
  if (!dom.className) return false;
  if (!Util.isNil(dom.className.baseVal)) {
    cls = dom.className.baseVal;
  } else {
    cls = dom.className;
  }
  return cls.indexOf(className) !== -1;
}

function _isParent(dom, cls) {
  var parent = dom.parentNode;
  var rst = false;
  while (parent && parent !== document.body) {
    if (_hasClass(parent, cls)) {
      rst = true;
      break;
    }
    parent = parent.parentNode;
  }
  return rst;
}

// 去除重复的值, 去除不同图形相同数据，只展示一份即可
function _uniqItems(items) {
  var tmp = [];
  Util.each(items, function (item) {
    var index = _indexOfArray(tmp, item);
    if (index === -1) {
      tmp.push(item);
    } else {
      tmp[index] = item;
    }
  });
  return tmp;
}

var TooltipController = function () {
  function TooltipController(cfg) {
    _classCallCheck(this, TooltipController);

    Util.assign(this, cfg);
    this.timeStamp = 0;
  }

  TooltipController.prototype._normalizeEvent = function _normalizeEvent(event) {
    var chart = this.chart;
    var canvas = this._getCanvas();
    var point = canvas.getPointByClient(event.clientX, event.clientY);
    var pixelRatio = canvas.get('pixelRatio');
    point.x = point.x / pixelRatio;
    point.y = point.y / pixelRatio;
    var views = chart.getViewsByPoint(point);
    point.views = views;
    return point;
  };

  TooltipController.prototype._getCanvas = function _getCanvas() {
    return this.chart.get('canvas');
  };

  TooltipController.prototype._getTriggerEvent = function _getTriggerEvent() {
    var options = this.options;
    var triggerOn = options.triggerOn;
    var eventName = void 0;

    if (!triggerOn || triggerOn === 'mousemove') {
      eventName = 'plotmove';
    } else if (triggerOn === 'click') {
      eventName = 'plotclick';
    } else if (triggerOn === 'none') {
      eventName = null;
    }

    return eventName;
  };

  TooltipController.prototype._getDefaultTooltipCfg = function _getDefaultTooltipCfg() {
    var self = this;
    var chart = self.chart;
    var viewTheme = self.viewTheme;
    var options = self.options;
    var defaultCfg = Util.mix({}, viewTheme.tooltip);
    var geoms = chart.getAllGeoms().filter(function (geom) {
      return geom.get('visible');
    });
    var shapes = [];
    Util.each(geoms, function (geom) {
      var type = geom.get('type');
      var adjusts = geom.get('adjusts');
      var isSymmetric = false;
      if (adjusts) {
        Util.each(adjusts, function (adjust) {
          if (adjust.type === 'symmetric' || adjust.type === 'Symmetric') {
            isSymmetric = true;
            return false;
          }
        });
      }
      if (Util.indexOf(shapes, type) === -1 && !isSymmetric) {
        shapes.push(type);
      }
    });

    var crosshairsCfg = void 0;
    if (geoms.length && geoms[0].get('coord') && geoms[0].get('coord').type === 'cartesian' && shapes.length === 1) {
      if (shapes[0] === 'interval' && options.shared !== false) {
        // 直角坐标系下 interval 的 crosshair 为矩形背景框
        crosshairsCfg = {
          zIndex: 0, // 矩形背景框不可覆盖 geom
          crosshairs: viewTheme.tooltipCrosshairsRect
        };
      } else if (Util.indexOf(TYPE_SHOW_CROSSHAIRS, shapes[0]) > -1) {
        crosshairsCfg = {
          crosshairs: viewTheme.tooltipCrosshairsLine
        };
      }
    }

    return Util.mix(defaultCfg, crosshairsCfg, {
      isTransposed: geoms.length && geoms[0].get('coord') ? geoms[0].get('coord').isTransposed : false
    });
  };

  TooltipController.prototype._bindEvent = function _bindEvent() {
    var chart = this.chart;
    var triggerEvent = this._getTriggerEvent();
    if (triggerEvent) {
      chart.on(triggerEvent, Util.wrapBehavior(this, 'onMouseMove'));
      chart.on('plotleave', Util.wrapBehavior(this, 'onMouseOut'));
    }
  };

  TooltipController.prototype._offEvent = function _offEvent() {
    var chart = this.chart;
    var triggerEvent = this._getTriggerEvent();
    if (triggerEvent) {
      chart.off(triggerEvent, Util.getWrapBehavior(this, 'onMouseMove'));
      chart.off('plotleave', Util.getWrapBehavior(this, 'onMouseOut'));
    }
  };

  TooltipController.prototype._setTooltip = function _setTooltip(point, items, markersItems, target) {
    var self = this;
    var tooltip = self.tooltip;
    var prePoint = self.prePoint;
    if (!prePoint || prePoint.x !== point.x || prePoint.y !== point.y) {
      items = _uniqItems(items);
      self.prePoint = point;

      var chart = self.chart;
      var viewTheme = self.viewTheme;
      var x = Util.isArray(point.x) ? point.x[point.x.length - 1] : point.x;
      var y = Util.isArray(point.y) ? point.y[point.y.length - 1] : point.y;
      if (!tooltip.get('visible')) {
        chart.emit('tooltip:show', {
          x: x,
          y: y,
          tooltip: tooltip
        });
      }
      var first = items[0];
      var title = first.title || first.name;
      if (tooltip.isContentChange(title, items)) {
        chart.emit('tooltip:change', {
          tooltip: tooltip,
          x: x,
          y: y,
          items: items
        });
        // bugfix: when set the title in the tooltip:change event does not take effect.
        title = items[0].title || items[0].name;
        tooltip.setContent(title, items);
        if (!Util.isEmpty(markersItems)) {
          if (self.options.hideMarkers === true) {
            // 不展示 tooltip marker
            tooltip.set('markerItems', markersItems); // 用于 tooltip 辅助线的定位
          } else {
            tooltip.setMarkers(markersItems, viewTheme.tooltipMarker);
          }
        } else {
          tooltip.clearMarkers();
        }
      }
      tooltip.setPosition(x, y, target);
      tooltip.show();
    }
  };

  TooltipController.prototype.hideTooltip = function hideTooltip() {
    var tooltip = this.tooltip;
    var chart = this.chart;
    var canvas = this._getCanvas();
    this.prePoint = null;
    tooltip.hide();
    chart.emit('tooltip:hide', {
      tooltip: tooltip
    });
    canvas.draw();
  };

  TooltipController.prototype.onMouseMove = function onMouseMove(ev) {
    if (Util.isEmpty(ev.views)) {
      return;
    }

    var lastTimeStamp = this.timeStamp;
    var timeStamp = +new Date();
    var point = {
      x: ev.x,
      y: ev.y
    };
    if (timeStamp - lastTimeStamp > 16) {
      this.showTooltip(point, ev.views, ev.shape);
      this.timeStamp = timeStamp;
    }
  };

  TooltipController.prototype.onMouseOut = function onMouseOut(ev) {
    var tooltip = this.tooltip;
    var canvas = this._getCanvas();
    if (!tooltip.get('visible')) {
      return;
    }
    if (ev && ev.target !== canvas) {
      return;
    }
    if (ev && ev.toElement && (_hasClass(ev.toElement, 'g2-tooltip') || _isParent(ev.toElement, 'g2-tooltip'))) {
      return;
    }
    this.hideTooltip();
  };

  TooltipController.prototype.renderTooltip = function renderTooltip() {
    var self = this;
    if (self.tooltip) {
      // tooltip 对象已经创建
      return;
    }
    var chart = self.chart;
    var viewTheme = self.viewTheme;
    var canvas = self._getCanvas();
    var defaultCfg = self._getDefaultTooltipCfg();
    var options = self.options;
    options = Util.deepMix({
      plotRange: chart.get('plotRange'),
      capture: false,
      canvas: canvas,
      frontPlot: chart.get('frontPlot'),
      viewTheme: viewTheme,
      backPlot: chart.get('backPlot')
    }, defaultCfg, options);
    if (options.crosshairs && options.crosshairs.type === 'rect') {
      options.zIndex = 0; // toolip 背景框不可遮盖住 geom，防止用户配置了 crosshairs
    }

    options.visible = false;
    if (options.shared === false && Util.isNil(options.position)) {
      options.position = 'top';
    }

    var tooltip = new Tooltip(options);
    self.tooltip = tooltip;

    var triggerEvent = self._getTriggerEvent();
    if (!tooltip.get('enterable') && triggerEvent === 'plotmove') {
      // 鼠标不允许进入 tooltip 容器
      var tooltipContainer = tooltip.get('container');
      if (tooltipContainer) {
        tooltipContainer.onmousemove = function (e) {
          // 避免 tooltip 频繁闪烁
          var eventObj = self._normalizeEvent(e);
          chart.emit(triggerEvent, eventObj);
        };
      }
    }
    self._bindEvent();
  };

  TooltipController.prototype.showTooltip = function showTooltip(point, views, target) {
    var self = this;
    if (Util.isEmpty(views) || !point) {
      return;
    }
    if (!this.tooltip) {
      this.renderTooltip(); // 如果一开始 tooltip 关闭，用户重新调用的时候需要先生成 tooltip
    }
    var options = self.options;
    var markersItems = [];
    var items = [];
    Util.each(views, function (view) {
      if (!view.get('tooltipEnable')) {
        // 如果不显示tooltip，则跳过
        return true;
      }
      var geoms = view.get('geoms');
      var coord = view.get('coord');
      Util.each(geoms, function (geom) {
        var type = geom.get('type');
        if (geom.get('visible') && geom.get('tooltipCfg') !== false) {
          var dataArray = geom.get('dataArray');
          if (geom.isShareTooltip() || options.shared === false && Util.inArray(['area', 'line', 'path'], type)) {
            Util.each(dataArray, function (obj) {
              var tmpPoint = geom.findPoint(point, obj);
              if (tmpPoint) {
                var subItems = geom.getTipItems(tmpPoint, options.title);
                if (Util.indexOf(TYPE_SHOW_MARKERS, type) !== -1) {
                  Util.each(subItems, function (v) {
                    var point = v.point;
                    if (point && point.x && point.y) {
                      // hotfix: make sure there is no null value
                      var x = Util.isArray(point.x) ? point.x[point.x.length - 1] : point.x;
                      var y = Util.isArray(point.y) ? point.y[point.y.length - 1] : point.y;
                      point = coord.applyMatrix(x, y, 1);
                      v.x = point[0];
                      v.y = point[1];
                      v.showMarker = true;
                      markersItems.push(v);
                    }
                  });
                }
                items = items.concat(subItems);
              }
            });
          } else {
            var geomContainer = geom.get('shapeContainer');
            if (target && target.get('visible') && target.get('origin') && target.get('parent') === geomContainer) {
              items = geom.getTipItems(target.get('origin'), options.title);
            }
          }
        }
      });

      Util.each(items, function (item) {
        var point = item.point;
        var x = Util.isArray(point.x) ? point.x[point.x.length - 1] : point.x;
        var y = Util.isArray(point.y) ? point.y[point.y.length - 1] : point.y;
        point = coord.applyMatrix(x, y, 1);
        item.x = point[0];
        item.y = point[1];
      });
    });

    if (items.length) {
      var first = items[0];

      // bugfix: multiple tooltip items with different titles
      if (!items.every(function (item) {
        return item.title === first.title;
      })) {
        var nearestItem = first;
        var nearestDistance = Infinity;
        items.forEach(function (item) {
          var distance = Vector2.distance([point.x, point.y], [item.x, item.y]);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestItem = item;
          }
        });
        items = items.filter(function (item) {
          return item.title === nearestItem.title;
        });
        markersItems = markersItems.filter(function (item) {
          return item.title === nearestItem.title;
        });
      }

      if (options.shared === false && items.length > 1) {
        var snapItem = items[0];
        var min = Math.abs(point.y - snapItem.y);
        Util.each(items, function (aItem) {
          if (Math.abs(point.y - aItem.y) <= min) {
            snapItem = aItem;
            min = Math.abs(point.y - aItem.y);
          }
        });
        if (snapItem && snapItem.x && snapItem.y) {
          markersItems = [snapItem];
        }
        items = [snapItem];
      }
      // 3.0 采用当前鼠标位置作为 tooltip 的参考点
      // if (!Util.isEmpty(markersItems)) {
      //   point = markersItems[0];
      // }
      self._setTooltip(point, items, markersItems, target);
    } else {
      self.hideTooltip();
    }
  };

  TooltipController.prototype.clear = function clear() {
    var tooltip = this.tooltip;
    tooltip && tooltip.destroy();
    this.tooltip = null;
    this.prePoint = null;
    this._offEvent();
  };

  return TooltipController;
}();

module.exports = TooltipController;