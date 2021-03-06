function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview 多边形
 * @author dxq613@gmail.com
 */
var GeomBase = require('./base');
var Util = require('../util');
require('./shape/polygon');

var Polygon = function (_GeomBase) {
  _inherits(Polygon, _GeomBase);

  function Polygon() {
    _classCallCheck(this, Polygon);

    return _possibleConstructorReturn(this, _GeomBase.apply(this, arguments));
  }

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  Polygon.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);
    cfg.type = 'polygon';
    cfg.shapeType = 'polygon';
    cfg.generatePoints = true;
    return cfg;
  };

  Polygon.prototype.createShapePointsCfg = function createShapePointsCfg(obj) {
    var cfg = _GeomBase.prototype.createShapePointsCfg.call(this, obj);
    var self = this;
    var x = cfg.x;
    var y = cfg.y;
    var temp = void 0;
    if (!(Util.isArray(x) && Util.isArray(y))) {
      // x y 都是数组时，不做处理
      var xScale = self.getXScale();
      var yScale = self.getYScale();
      var xCount = xScale.values ? xScale.values.length : xScale.ticks.length;
      var yCount = yScale.values ? yScale.values.length : yScale.ticks.length;
      var xOffset = 0.5 * 1 / xCount;
      var yOffset = 0.5 * 1 / yCount;
      if (xScale.isCategory && yScale.isCategory) {
        // 如果x,y都是分类
        x = [x - xOffset, x - xOffset, x + xOffset, x + xOffset];
        y = [y - yOffset, y + yOffset, y + yOffset, y - yOffset];
      } else if (Util.isArray(x)) {
        // x 是数组
        temp = x;
        x = [temp[0], temp[0], temp[1], temp[1]];
        y = [y - yOffset / 2, y + yOffset / 2, y + yOffset / 2, y - yOffset / 2];
      } else if (Util.isArray(y)) {
        // y 是数组
        temp = y;
        y = [temp[0], temp[1], temp[1], temp[0]];
        x = [x - xOffset / 2, x - xOffset / 2, x + xOffset / 2, x + xOffset / 2];
      }
      cfg.x = x;
      cfg.y = y;
    }
    return cfg;
  };

  return Polygon;
}(GeomBase);

GeomBase.Polygon = Polygon;

module.exports = Polygon;