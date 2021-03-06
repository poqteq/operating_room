var Util = require('../../util/index');
var Element = require('./element');
var Inside = require('../shape/util/inside');

var Shape = function Shape(cfg) {
  Shape.superclass.constructor.call(this, cfg);
};

Shape.ATTRS = {};

Util.extend(Shape, Element);

Util.augment(Shape, {
  isShape: true,
  createPath: function createPath() {},
  afterPath: function afterPath() {},
  drawInner: function drawInner(context) {
    var self = this;
    var attrs = self.__attrs;
    self.createPath(context);
    var originOpacity = context.globalAlpha;
    if (self.hasFill()) {
      var fillOpacity = attrs.fillOpacity;
      if (!Util.isNil(fillOpacity) && fillOpacity !== 1) {
        context.globalAlpha = fillOpacity;
        context.fill();
        context.globalAlpha = originOpacity;
      } else {
        context.fill();
      }
    }
    if (self.hasStroke()) {
      var lineWidth = self.__attrs.lineWidth;
      if (lineWidth > 0) {
        var strokeOpacity = attrs.strokeOpacity;
        if (!Util.isNil(strokeOpacity) && strokeOpacity !== 1) {
          context.globalAlpha = strokeOpacity;
        }
        context.stroke();
      }
    }
    self.afterPath(context);
  },

  /**
   * 节点是否在图形中
   * @param  {Number}  x x 坐标
   * @param  {Number}  y y 坐标
   * @return {Boolean}  是否在图形中
   */
  isPointInPath: function isPointInPath() {
    return false;
  },

  /**
   * 击中图形时是否进行包围盒判断
   * @return {Boolean} [description]
   */
  isHitBox: function isHitBox() {
    return true;
  },

  /**
   * 节点是否能够被击中
   * @param {Number} x x坐标
   * @param {Number} y y坐标
   * @return {Boolean} 是否在图形中
   */
  isHit: function isHit(x, y) {
    var self = this;
    var v = [x, y, 1];
    self.invert(v); // canvas

    if (self.isHitBox()) {
      var box = self.getBBox();
      if (box && !Inside.box(box.minX, box.maxX, box.minY, box.maxY, v[0], v[1])) {
        return false;
      }
    }
    var clip = self.__attrs.clip;
    if (clip) {
      if (clip.inside(x, y)) {
        return self.isPointInPath(v[0], v[1]);
      }
    } else {
      return self.isPointInPath(v[0], v[1]);
    }
    return false;
  },

  /**
   * @protected
   * 计算包围盒
   * @return {Object} 包围盒
   */
  calculateBox: function calculateBox() {
    return null;
  },

  // 获取拾取时线的宽度，需要考虑附加的线的宽度
  getHitLineWidth: function getHitLineWidth() {
    var attrs = this.__attrs;
    // if (!attrs.stroke) {
    //   return 0;
    // }
    var lineAppendWidth = attrs.lineAppendWidth || 0;
    var lineWidth = attrs.lineWidth || 0;
    return lineWidth + lineAppendWidth;
  },

  // 清除当前的矩阵
  clearTotalMatrix: function clearTotalMatrix() {
    this.__cfg.totalMatrix = null;
    this.__cfg.region = null;
  },
  clearBBox: function clearBBox() {
    this.__cfg.box = null;
    this.__cfg.region = null;
  },
  getBBox: function getBBox() {
    var box = this.__cfg.box;
    // 延迟计算
    if (!box) {
      box = this.calculateBox();
      if (box) {
        box.x = box.minX;
        box.y = box.minY;
        box.width = box.maxX - box.minX;
        box.height = box.maxY - box.minY;
      }
      this.__cfg.box = box;
    }
    return box;
  }
});

module.exports = Shape;