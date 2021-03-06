var Util = require('../util/index');
var Shape = require('../core/shape');
var Inside = require('./util/inside');
var Arrow = require('./util/arrow');
var LineMath = require('./math/line');

var Line = function Line(cfg) {
  Line.superclass.constructor.call(this, cfg);
};

Line.ATTRS = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  lineWidth: 1,
  startArrow: false,
  endArrow: false
};

Util.extend(Line, Shape);

Util.augment(Line, {
  canStroke: true,
  type: 'line',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1,
      startArrow: false,
      endArrow: false
    };
  },
  calculateBox: function calculateBox() {
    var attrs = this.__attrs;
    var x1 = attrs.x1,
        y1 = attrs.y1,
        x2 = attrs.x2,
        y2 = attrs.y2;

    var lineWidth = this.getHitLineWidth();
    return LineMath.box(x1, y1, x2, y2, lineWidth);
  },
  isPointInPath: function isPointInPath(x, y) {
    var attrs = this.__attrs;
    var x1 = attrs.x1,
        y1 = attrs.y1,
        x2 = attrs.x2,
        y2 = attrs.y2;

    var lineWidth = this.getHitLineWidth();

    if (this.hasStroke()) {
      return Inside.line(x1, y1, x2, y2, lineWidth, x, y);
    }

    return false;
  },
  createPath: function createPath(context) {
    var attrs = this.__attrs;
    var x1 = attrs.x1,
        y1 = attrs.y1,
        x2 = attrs.x2,
        y2 = attrs.y2;

    context = context || self.get('context');
    context.beginPath();

    Arrow.addStartArrow(context, attrs, x1, y1, x2, y2);
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    Arrow.addEndArrow(context, attrs, x2, y2, x1, y1);
  },
  getPoint: function getPoint(t) {
    var attrs = this.__attrs;
    return {
      x: LineMath.at(attrs.x1, attrs.x2, t),
      y: LineMath.at(attrs.y1, attrs.y2, t)
    };
  }
});

module.exports = Line;