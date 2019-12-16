function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview The class of slider
 * @author sima.zhang
 */
var Util = require('../../util');
var DomUtil = Util.DomUtil;

var _require = require('../../renderer'),
    Group = _require.Group;

var Slider = function (_Group) {
  _inherits(Slider, _Group);

  function Slider() {
    _classCallCheck(this, Slider);

    return _possibleConstructorReturn(this, _Group.apply(this, arguments));
  }

  Slider.prototype.getDefaultCfg = function getDefaultCfg() {
    return {
      /**
       * 范围
       * @type {Array}
       */
      range: null,
      /**
       * 中滑块属性
       * @type {ATTRS}
       */
      middleAttr: null,
      /**
       * 背景
       * @type {G-Element}
       */
      backgroundElement: null,
      /**
       * 下滑块
       * @type {G-Element}
       */
      minHandleElement: null,
      /**
       * 上滑块
       * @type {G-Element}
       */
      maxHandleElement: null,
      /**
       * 中块
       * @type {G-Element}
       */
      middleHandleElement: null,
      /**
       * 当前的激活的元素
       * @type {G-Element}
       */
      currentTarget: null,
      /**
       * 布局方式： horizontal，vertical
       * @type {String}
       */
      layout: 'vertical',
      /**
       * 宽
       * @type {Number}
       */
      width: null,
      /**
       * 高
       * @type {Number}
       */
      height: null,
      /**
       * 当前的PageX
       * @type {Number}
       */
      pageX: null,
      /**
       * 当前的PageY
       * @type {Number}
       */
      pageY: null
    };
  };

  Slider.prototype._beforeRenderUI = function _beforeRenderUI() {
    var layout = this.get('layout');
    var backgroundElement = this.get('backgroundElement');
    var minHandleElement = this.get('minHandleElement');
    var maxHandleElement = this.get('maxHandleElement');
    var middleHandleElement = this.addShape('rect', {
      attrs: this.get('middleAttr')
    });
    var trigerCursor = layout === 'vertical' ? 'ns-resize' : 'ew-resize';

    this.add([backgroundElement, minHandleElement, maxHandleElement]);
    this.set('middleHandleElement', middleHandleElement);
    backgroundElement.set('zIndex', 0);
    middleHandleElement.set('zIndex', 1);
    minHandleElement.set('zIndex', 2);
    maxHandleElement.set('zIndex', 2);
    middleHandleElement.attr('cursor', trigerCursor);
    minHandleElement.attr('cursor', trigerCursor);
    maxHandleElement.attr('cursor', trigerCursor);
    this.sort();
  };

  Slider.prototype._renderUI = function _renderUI() {
    if (this.get('layout') === 'horizontal') {
      this._renderHorizontal();
    } else {
      this._renderVertical();
    }
  };

  Slider.prototype._transform = function _transform(layout) {
    var range = this.get('range');
    var minRatio = range[0] / 100;
    var maxRatio = range[1] / 100;
    var width = this.get('width');
    var height = this.get('height');
    var minHandleElement = this.get('minHandleElement');
    var maxHandleElement = this.get('maxHandleElement');
    var middleHandleElement = this.get('middleHandleElement');

    minHandleElement.initTransform();
    maxHandleElement.initTransform();

    if (layout === 'horizontal') {
      middleHandleElement.attr({
        x: width * minRatio,
        y: 0,
        width: (maxRatio - minRatio) * width,
        height: height
      });
      minHandleElement.translate(minRatio * width, height);
      maxHandleElement.translate(maxRatio * width, height);
    } else {
      middleHandleElement.attr({
        x: 0,
        y: height * (1 - maxRatio),
        width: width,
        height: (maxRatio - minRatio) * height
      });
      minHandleElement.translate(width / 2, (1 - minRatio) * height);
      maxHandleElement.translate(width / 2, (1 - maxRatio) * height);
    }
  };

  Slider.prototype._renderHorizontal = function _renderHorizontal() {
    this._transform('horizontal');
  };

  Slider.prototype._renderVertical = function _renderVertical() {
    this._transform('vertical');
  };

  Slider.prototype._bindUI = function _bindUI() {
    this.on('mousedown', Util.wrapBehavior(this, '_onMouseDown'));
  };

  Slider.prototype._isElement = function _isElement(target, name) {
    // 判断是否是该元素
    var element = this.get(name);
    if (target === element) {
      return true;
    }
    if (element.isGroup) {
      var elementChildren = element.get('children');
      return elementChildren.indexOf(target) > -1;
    }
    return false;
  };

  Slider.prototype._getRange = function _getRange(diff, range) {
    var rst = diff + range;
    rst = rst > 100 ? 100 : rst;
    rst = rst < 0 ? 0 : rst;
    return rst;
  };

  Slider.prototype._updateStatus = function _updateStatus(dim, ev) {
    var totalLength = dim === 'x' ? this.get('width') : this.get('height');
    dim = Util.upperFirst(dim);
    var range = this.get('range');
    var page = this.get('page' + dim);
    var currentTarget = this.get('currentTarget');
    var rangeStash = this.get('rangeStash');
    var layout = this.get('layout');
    var sign = layout === 'vertical' ? -1 : 1;
    var currentPage = ev['page' + dim];
    var diffPage = currentPage - page;
    var diffRange = diffPage / totalLength * 100 * sign;
    var diffStashRange = void 0;

    if (range[1] <= range[0]) {
      if (this._isElement(currentTarget, 'minHandleElement') || this._isElement(currentTarget, 'maxHandleElement')) {
        range[0] = this._getRange(diffRange, range[0]);
        range[1] = this._getRange(diffRange, range[0]);
      }
    } else {
      if (this._isElement(currentTarget, 'minHandleElement')) {
        range[0] = this._getRange(diffRange, range[0]);
      }
      if (this._isElement(currentTarget, 'maxHandleElement')) {
        range[1] = this._getRange(diffRange, range[1]);
      }
    }

    if (this._isElement(currentTarget, 'middleHandleElement')) {
      diffStashRange = rangeStash[1] - rangeStash[0];
      range[0] = this._getRange(diffRange, range[0]);
      range[1] = range[0] + diffStashRange;
      if (range[1] > 100) {
        range[1] = 100;
        range[0] = range[1] - diffStashRange;
      }
    }

    this.emit('sliderchange', {
      range: range
    });

    this.set('page' + dim, currentPage);
    this._renderUI();
    this.get('canvas').draw(); // need delete
    return;
  };

  Slider.prototype._onMouseDown = function _onMouseDown(ev) {
    var currentTarget = ev.currentTarget;
    var originEvent = ev.event;
    var range = this.get('range');
    originEvent.stopPropagation();
    originEvent.preventDefault();
    this.set('pageX', originEvent.pageX);
    this.set('pageY', originEvent.pageY);
    this.set('currentTarget', currentTarget);
    this.set('rangeStash', [range[0], range[1]]);
    this._bindCanvasEvents();
  };

  Slider.prototype._bindCanvasEvents = function _bindCanvasEvents() {
    var containerDOM = this.get('canvas').get('containerDOM');
    this.onMouseMoveListener = DomUtil.addEventListener(containerDOM, 'mousemove', Util.wrapBehavior(this, '_onCanvasMouseMove'));
    this.onMouseUpListener = DomUtil.addEventListener(containerDOM, 'mouseup', Util.wrapBehavior(this, '_onCanvasMouseUp'));
  };

  Slider.prototype._onCanvasMouseMove = function _onCanvasMouseMove(ev) {
    if (!this._mouseOutArea(ev)) {
      var layout = this.get('layout');
      if (layout === 'horizontal') {
        this._updateStatus('x', ev);
      } else {
        this._updateStatus('y', ev);
      }
    }
  };

  Slider.prototype._onCanvasMouseUp = function _onCanvasMouseUp() {
    this._removeDocumentEvents();
  };

  Slider.prototype._removeDocumentEvents = function _removeDocumentEvents() {
    this.onMouseMoveListener.remove();
    this.onMouseUpListener.remove();
  };

  Slider.prototype._mouseOutArea = function _mouseOutArea(ev) {
    var parent = this.get('parent');
    var bbox = parent.getBBox();
    var left = parent.attr('matrix')[6];
    var top = parent.attr('matrix')[7];
    var right = left + bbox.width;
    var bottom = top + bbox.height;
    var mouseX = ev.clientX;
    var mouseY = ev.clientY;
    if (mouseX < left || mouseX > right || mouseY < top || mouseY > bottom) {
      return true;
    }
    return false;
  };

  return Slider;
}(Group);

module.exports = Slider;