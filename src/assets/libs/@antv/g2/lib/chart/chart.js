function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview G2 图表的入口文件
 * @author dxq613@gmail.com
 */

var Util = require('../util');
var View = require('./view');
var G = require('../renderer');
var Canvas = G.Canvas;
var DomUtil = Util.DomUtil;
var Global = require('../global');
var Plot = require('../component/plot');
var Controller = require('./controller/index');
var AUTO_STR = 'auto';

function _isScaleExist(scales, compareScale) {
  var flag = false;
  Util.each(scales, function (scale) {
    var scaleValues = [].concat(scale.values);
    var compareScaleValues = [].concat(compareScale.values);
    if (scale.type === compareScale.type && scale.field === compareScale.field && scaleValues.sort().toString() === compareScaleValues.sort().toString()) {
      flag = true;
      return;
    }
  });

  return flag;
}

function mergeBBox(box1, box2) {
  return {
    minX: Math.min(box1.minX, box2.minX),
    minY: Math.min(box1.minY, box2.minY),
    maxX: Math.max(box1.maxX, box2.maxX),
    maxY: Math.max(box1.maxY, box2.maxY)
  };
}

function isEqualArray(arr1, arr2) {
  return Util.isEqualWith(arr1, arr2, function (v1, v2) {
    return v1 === v2;
  });
}

/**
 * 图表的入口
 * @class Chart
 */

var Chart = function (_View) {
  _inherits(Chart, _View);

  function Chart() {
    _classCallCheck(this, Chart);

    return _possibleConstructorReturn(this, _View.apply(this, arguments));
  }

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  Chart.prototype.getDefaultCfg = function getDefaultCfg() {
    var viewCfg = _View.prototype.getDefaultCfg.call(this);
    return Util.mix(viewCfg, {
      id: null,
      forceFit: false,
      container: null,
      wrapperEl: null,
      canvas: null,
      width: 500,
      height: 500,
      pixelRatio: null,
      backPlot: null,
      frontPlot: null,
      plotBackground: null,
      padding: Global.plotCfg.padding,
      background: null,
      autoPaddingAppend: 5,
      views: []
    });
  };

  Chart.prototype.init = function init() {
    var self = this;
    var viewTheme = self.get('viewTheme');
    self._initCanvas();
    self._initPlot();
    self._initEvents();
    _View.prototype.init.call(this);

    var tooltipController = new Controller.Tooltip({
      chart: self,
      viewTheme: viewTheme,
      options: {}
    });
    self.set('tooltipController', tooltipController);

    var legendController = new Controller.Legend({
      chart: self,
      viewTheme: viewTheme
    });
    self.set('legendController', legendController);
    self.set('_id', 'chart'); // 防止同用户设定的 id 同名
    self.emit('afterinit'); // 初始化完毕
  };

  Chart.prototype._isAutoPadding = function _isAutoPadding() {
    var padding = this.get('padding');
    if (Util.isArray(padding)) {
      return padding.indexOf(AUTO_STR) !== -1;
    }
    return padding === AUTO_STR;
  };

  Chart.prototype._getAutoPadding = function _getAutoPadding() {
    var padding = this.get('padding');
    // 图例在最前面的一层
    var frontPlot = this.get('frontPlot');
    var frontBBox = frontPlot.getBBox();
    // 坐标轴在最后面的一层
    var backPlot = this.get('backPlot');
    var backBBox = backPlot.getBBox();

    var box = mergeBBox(frontBBox, backBBox);
    var outter = [0 - box.minY, // 上面超出的部分
    box.maxX - this.get('width'), // 右边超出的部分
    box.maxY - this.get('height'), // 下边超出的部分
    0 - box.minX];
    // 如果原始的 padding 内部存在 'auto' 则替换对应的边
    var autoPadding = Util.toAllPadding(padding);
    for (var i = 0; i < autoPadding.length; i++) {
      if (autoPadding[i] === AUTO_STR) {
        var tmp = Math.max(0, outter[i]);
        autoPadding[i] = tmp + this.get('autoPaddingAppend');
      }
    }
    return autoPadding;
  };

  // 初始化画布


  Chart.prototype._initCanvas = function _initCanvas() {
    var container = this.get('container');
    var id = this.get('id');
    // 如果未设置 container 使用 ID, 兼容 2.x 版本
    if (!container && id) {
      container = id;
      this.set('container', id);
    }
    var width = this.get('width');
    var height = this.get('height');
    if (Util.isString(container)) {
      container = document.getElementById(container);
      if (!container) {
        throw new Error('Please specify the container for the chart!');
      }
      this.set('container', container);
    }
    var wrapperEl = DomUtil.createDom('<div style="position:relative;"></div>');
    container.appendChild(wrapperEl);
    this.set('wrapperEl', wrapperEl);
    if (this.get('forceFit')) {
      width = DomUtil.getWidth(container, width);
      this.set('width', width);
    }
    var canvas = new Canvas({
      containerDOM: wrapperEl,
      width: width,
      height: height,
      pixelRatio: this.get('pixelRatio')
    });
    this.set('canvas', canvas);
  };

  // 初始化绘图区间


  Chart.prototype._initPlot = function _initPlot() {
    var self = this;
    self._initPlotBack(); // 最底层的是背景相关的 group
    var canvas = self.get('canvas');
    var backPlot = canvas.addGroup({
      zIndex: 1
    }); // 图表最后面的容器
    var plotContainer = canvas.addGroup({
      zIndex: 2
    }); // 图表所在的容器
    var frontPlot = canvas.addGroup({
      zIndex: 3
    }); // 图表前面的容器

    self.set('backPlot', backPlot);
    self.set('middlePlot', plotContainer);
    self.set('frontPlot', frontPlot);
  };

  // 初始化背景


  Chart.prototype._initPlotBack = function _initPlotBack() {
    var self = this;
    var canvas = self.get('canvas');
    var viewTheme = self.get('viewTheme');

    var plot = canvas.addGroup(Plot, {
      padding: this.get('padding'),
      plotBackground: Util.mix({}, viewTheme.plotBackground, self.get('plotBackground')),
      background: Util.mix({}, viewTheme.background, self.get('background'))
    });
    self.set('plot', plot);
    self.set('plotRange', plot.get('plotRange'));
  };

  Chart.prototype._initEvents = function _initEvents() {
    if (this.get('forceFit')) {
      window.addEventListener('resize', Util.wrapBehavior(this, '_initForceFitEvent'));
    }
  };

  Chart.prototype._initForceFitEvent = function _initForceFitEvent() {
    var timer = setTimeout(Util.wrapBehavior(this, 'forceFit'), 200);
    clearTimeout(this.get('resizeTimer'));
    this.set('resizeTimer', timer);
  };

  // 绘制图例


  Chart.prototype._renderLegends = function _renderLegends() {
    var options = this.get('options');
    var legendOptions = options.legends;
    if (Util.isNil(legendOptions) || legendOptions !== false) {
      // 没有关闭图例
      var legendController = this.get('legendController');
      legendController.options = legendOptions || {};
      legendController.plotRange = this.get('plotRange');

      if (legendOptions && legendOptions.custom) {
        // 用户自定义图例
        legendController.addCustomLegend();
      } else {
        var geoms = this.getAllGeoms();
        var scales = [];
        Util.each(geoms, function (geom) {
          var view = geom.get('view');
          var attrs = geom.getAttrsForLegend();
          Util.each(attrs, function (attr) {
            var type = attr.type;
            var scale = attr.getScale(type);
            if (scale.field && scale.type !== 'identity' && !_isScaleExist(scales, scale)) {
              scales.push(scale);
              var filteredValues = view.getFilteredOutValues(scale.field);
              legendController.addLegend(scale, attr, geom, filteredValues);
            }
          });
        });

        // 双轴的情况
        var yScales = this.getYScales();
        if (scales.length === 0 && yScales.length > 1) {
          legendController.addMixedLegend(yScales, geoms);
        }
      }

      legendController.alignLegends();
    }
  };

  // 绘制 tooltip


  Chart.prototype._renderTooltips = function _renderTooltips() {
    var options = this.get('options');
    if (Util.isNil(options.tooltip) || options.tooltip !== false) {
      // 用户没有关闭 tooltip
      var tooltipController = this.get('tooltipController');
      tooltipController.options = options.tooltip || {};
      tooltipController.renderTooltip();
    }
  };

  /**
   * 获取所有的几何标记
   * @return {Array} 所有的几何标记
   */


  Chart.prototype.getAllGeoms = function getAllGeoms() {
    var geoms = [];
    geoms = geoms.concat(this.get('geoms'));

    var views = this.get('views');
    Util.each(views, function (view) {
      geoms = geoms.concat(view.get('geoms'));
    });

    return geoms;
  };

  /**
   * 自适应宽度
   * @chainable
   * @return {Chart} 图表对象
   */


  Chart.prototype.forceFit = function forceFit() {
    var self = this;
    if (!self || self.destroyed) {
      return;
    }
    var container = self.get('container');
    var oldWidth = self.get('width');
    var width = DomUtil.getWidth(container, oldWidth);
    if (width !== 0 && width !== oldWidth) {
      var height = self.get('height');
      self.changeSize(width, height);
    }
    return self;
  };

  Chart.prototype.resetPlot = function resetPlot() {
    var plot = this.get('plot');
    var padding = this.get('padding');
    if (!isEqualArray(padding, plot.get('padding'))) {
      // 重置 padding，仅当padding 发生更改
      plot.set('padding', padding);
      plot.repaint();
    }
  };

  /**
   * 改变大小
   * @param  {Number} width  图表宽度
   * @param  {Number} height 图表高度
   * @return {Chart} 图表对象
   */


  Chart.prototype.changeSize = function changeSize(width, height) {
    var self = this;
    var canvas = self.get('canvas');
    canvas.changeSize(width, height);
    var plot = this.get('plot');
    self.set('width', width);
    self.set('height', height);
    // change size 时重新计算边框
    plot.repaint();
    // 保持边框不变，防止自动 padding 时绘制多遍
    this.set('keepPadding', true);
    self.repaint();
    this.set('keepPadding', false);
    this.emit('afterchangesize');
    return self;
  };
  /**
   * 改变宽度
   * @param  {Number} width  图表宽度
   * @return {Chart} 图表对象
   */


  Chart.prototype.changeWidth = function changeWidth(width) {
    return this.changeSize(width, this.get('height'));
  };
  /**
   * 改变宽度
   * @param  {Number} height  图表高度
   * @return {Chart} 图表对象
   */


  Chart.prototype.changeHeight = function changeHeight(height) {
    return this.changeSize(this.get('width'), height);
  };

  /**
   * 创建一个视图
   * @param  {Object} cfg 视图的配置项
   * @return {View} 视图对象
   */


  Chart.prototype.view = function view(cfg) {
    cfg = cfg || {};
    cfg.theme = this.get('theme');
    cfg.parent = this;
    cfg.backPlot = this.get('backPlot');
    cfg.middlePlot = this.get('middlePlot');
    cfg.frontPlot = this.get('frontPlot');
    cfg.canvas = this.get('canvas');
    if (Util.isNil(cfg.animate)) {
      cfg.animate = this.get('animate');
    }
    cfg.options = Util.mix({}, this._getSharedOptions(), cfg.options);
    var view = new View(cfg);
    view.set('_id', 'view' + this.get('views').length); // 标识 ID，防止同用户设定的 id 重名
    this.get('views').push(view);
    this.emit('addview', { view: view });
    return view;
  };

  // isShapeInView() {
  //   return true;
  // }

  Chart.prototype.removeView = function removeView(view) {
    var views = this.get('views');
    Util.Array.remove(views, view);
    view.destroy();
  };

  Chart.prototype._getSharedOptions = function _getSharedOptions() {
    var options = this.get('options');
    var sharedOptions = {};
    Util.each(['scales', 'coord', 'axes'], function (name) {
      sharedOptions[name] = Util.cloneDeep(options[name]);
    });
    return sharedOptions;
  };

  /**
   * @override
   * 当前chart 的范围
   */


  Chart.prototype.getViewRegion = function getViewRegion() {
    var plotRange = this.get('plotRange');
    return {
      start: plotRange.bl,
      end: plotRange.tr
    };
  };

  /**
   * 设置图例配置信息
   * @param  {String|Object} field 字段名
   * @param  {Object} [cfg] 图例的配置项
   * @return {Chart} 当前的图表对象
   */


  Chart.prototype.legend = function legend(field, cfg) {
    var options = this.get('options');
    if (!options.legends) {
      options.legends = {};
    }

    var legends = {};
    if (field === false) {
      options.legends = false;
    } else if (Util.isObject(field)) {
      legends = field;
    } else if (Util.isString(field)) {
      legends[field] = cfg;
    } else {
      legends = cfg;
    }
    Util.mix(options.legends, legends);

    return this;
  };

  /**
   * 设置提示信息
   * @param  {String|Object} visible 是否可见
   * @param  {Object} [cfg] 提示信息的配置项
   * @return {Chart} 当前的图表对象
   */


  Chart.prototype.tooltip = function tooltip(visible, cfg) {
    var options = this.get('options');
    if (!options.tooltip) {
      options.tooltip = {};
    }

    if (visible === false) {
      options.tooltip = false;
    } else if (Util.isObject(visible)) {
      Util.mix(options.tooltip, visible);
    } else {
      Util.mix(options.tooltip, cfg);
    }

    return this;
  };

  /**
   * 清空图表
   * @return {Chart} 当前的图表对象
   */


  Chart.prototype.clear = function clear() {
    this.emit('beforeclear');
    var views = this.get('views');
    while (views.length > 0) {
      var view = views.shift();
      view.destroy();
    }
    _View.prototype.clear.call(this);
    var canvas = this.get('canvas');
    this.resetPlot();
    canvas.draw();
    this.emit('afterclear');
    return this;
  };

  Chart.prototype.clearInner = function clearInner() {
    var views = this.get('views');
    Util.each(views, function (view) {
      view.clearInner();
    });

    var tooltipController = this.get('tooltipController');
    tooltipController && tooltipController.clear();

    if (!this.get('keepLegend')) {
      var legendController = this.get('legendController');
      legendController && legendController.clear();
    }

    _View.prototype.clearInner.call(this);
  };

  // chart 除了view 上绘制的组件外，还会绘制图例和 tooltip


  Chart.prototype.drawComponents = function drawComponents() {
    _View.prototype.drawComponents.call(this);
    // 一般是点击图例时，仅仅隐藏某些选项，而不销毁图例
    if (!this.get('keepLegend')) {
      this._renderLegends(); // 渲染图例
    }
  };

  /**
   * 绘制图表
   * @override
   */


  Chart.prototype.render = function render() {
    // 需要自动计算边框，则重新设置
    if (!this.get('keepPadding') && this._isAutoPadding()) {
      this.beforeRender(); // 初始化各个 view 和 绘制
      this.drawComponents();
      var autoPadding = this._getAutoPadding();
      var plot = this.get('plot');
      // 在计算出来的边框不一致的情况，重新改变边框
      if (!isEqualArray(plot.get('padding'), autoPadding)) {
        plot.set('padding', autoPadding);
        plot.repaint();
      }
    }
    _View.prototype.render.call(this);
    this._renderTooltips(); // 渲染 tooltip
  };

  Chart.prototype.repaint = function repaint() {
    // 重绘时需要判定当前的 padding 是否发生过改变，如果发生过改变进行调整
    // 需要判定是否使用了自动 padding
    if (!this.get('keepPadding')) {
      this.resetPlot();
    }
    _View.prototype.repaint.call(this);
  };

  /**
   * @override
   * 显示或者隐藏
   */


  Chart.prototype.changeVisible = function changeVisible(visible) {
    var wrapperEl = this.get('wrapperEl');
    var visibleStr = visible ? '' : 'none';
    wrapperEl.style.display = visibleStr;
  };

  /**
   * 返回图表的 dataUrl 用于生成图片
   * @return {String} dataUrl 路径
   */


  Chart.prototype.toDataURL = function toDataURL() {
    var canvas = this.get('canvas');
    var canvasDom = canvas.get('el');
    var dataURL = canvasDom.toDataURL('image/png');
    return dataURL;
  };

  /**
   * 图表导出功能
   * @param  {String} [name] 图片的名称，默认为 chart.png
   * @return {String} 返回生成图片的 dataUrl 路径
   */


  Chart.prototype.downloadImage = function downloadImage(name) {
    var dataURL = this.toDataURL();
    var link = document.createElement('a');

    if (window.Blob && window.URL) {
      var arr = dataURL.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      var blobObj = new Blob([u8arr], { type: mime });
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blobObj, (name || 'chart') + '.png');
      } else {
        link.addEventListener('click', function () {
          link.download = (name || 'chart') + '.png';
          link.href = window.URL.createObjectURL(blobObj);
        });
      }
    } else {
      link.addEventListener('click', function () {
        link.download = (name || 'chart') + '.png';
        link.href = dataURL.replace('image/png', 'image/octet-stream');
      });
    }
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', false, false);
    link.dispatchEvent(e);
    return dataURL;
  };

  /**
   * 根据坐标点显示对应的 tooltip
   * @param  {Object} point 画布上的点
   * @return {Chart}       返回 chart 实例
   */


  Chart.prototype.showTooltip = function showTooltip(point) {
    var views = this.getViewsByPoint(point);
    if (views.length) {
      var tooltipController = this.get('tooltipController');
      tooltipController.showTooltip(point, views);
    }
    return this;
  };

  /**
   * 隐藏 tooltip
  * @return {Chart}       返回 chart 实例
   */


  Chart.prototype.hideTooltip = function hideTooltip() {
    var tooltipController = this.get('tooltipController');
    tooltipController.hideTooltip();
    return this;
  };

  /**
   * 根据传入的画布坐标，获取该处的 tooltip 上的记录信息
   * @param  {Object} point 画布坐标点
   * @return {Array}       返回结果
   */


  Chart.prototype.getTooltipItems = function getTooltipItems(point) {
    var self = this;
    var views = self.getViewsByPoint(point);
    var rst = [];
    Util.each(views, function (view) {
      var geoms = view.get('geoms');
      Util.each(geoms, function (geom) {
        var dataArray = geom.get('dataArray');
        var items = [];
        Util.each(dataArray, function (data) {
          var tmpPoint = geom.findPoint(point, data);
          if (tmpPoint) {
            var subItems = geom.getTipItems(tmpPoint);
            items = items.concat(subItems);
          }
        });
        rst = rst.concat(items);
      });
    });
    return rst;
  };

  /**
   * @override
   * 销毁图表
   */


  Chart.prototype.destroy = function destroy() {
    this.emit('beforedestroy');
    clearTimeout(this.get('resizeTimer'));
    var canvas = this.get('canvas');
    var wrapperEl = this.get('wrapperEl');
    wrapperEl.parentNode.removeChild(wrapperEl);
    _View.prototype.destroy.call(this);
    canvas.destroy();
    window.removeEventListener('resize', Util.getWrapBehavior(this, '_initForceFitEvent'));
    this.emit('afterdestroy');
  };

  return Chart;
}(View);

module.exports = Chart;