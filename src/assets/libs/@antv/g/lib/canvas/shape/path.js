var Util = require('../../util/index');
var Shape = require('../core/shape');
var PathSegment = require('./util/path-segment');
var Format = require('../../util/format');
var Arrow = require('./util/arrow');
var PathUtil = require('../../util/path');
var CubicMath = require('./math/cubic');

var Path = function Path(cfg) {
  Path.superclass.constructor.call(this, cfg);
};

Path.ATTRS = {
  path: null,
  lineWidth: 1,
  curve: null, // 曲线path
  tCache: null,
  startArrow: false,
  endArrow: false
};

Util.extend(Path, Shape);

Util.augment(Path, {
  canFill: true,
  canStroke: true,
  type: 'path',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1,
      startArrow: false,
      endArrow: false
    };
  },
  _afterSetAttrPath: function _afterSetAttrPath(path) {
    var self = this;
    if (Util.isNil(path)) {
      self.setSilent('segments', null);
      self.setSilent('box', undefined);
      return;
    }
    var pathArray = Format.parsePath(path);
    var preSegment = void 0;
    var segments = [];

    if (!Util.isArray(pathArray) || pathArray.length === 0 || pathArray[0][0] !== 'M' && pathArray[0][0] !== 'm') {
      return;
    }
    var count = pathArray.length;
    for (var i = 0; i < pathArray.length; i++) {
      var item = pathArray[i];
      preSegment = new PathSegment(item, preSegment, i === count - 1);
      segments.push(preSegment);
    }
    self.setSilent('segments', segments);
    self.set('tCache', null);
    this.setSilent('box', null);
  },
  _afterSetAttrAll: function _afterSetAttrAll(objs) {
    if (objs.path) {
      this._afterSetAttrPath(objs.path);
    }
  },
  calculateBox: function calculateBox() {
    var self = this;
    var segments = self.get('segments');

    if (!segments) {
      return null;
    }
    var lineWidth = this.getHitLineWidth();
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;
    Util.each(segments, function (segment) {
      segment.getBBox(lineWidth);
      var box = segment.box;
      if (box) {
        if (box.minX < minX) {
          minX = box.minX;
        }

        if (box.maxX > maxX) {
          maxX = box.maxX;
        }

        if (box.minY < minY) {
          minY = box.minY;
        }

        if (box.maxY > maxY) {
          maxY = box.maxY;
        }
      }
    });
    return {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY
    };
  },
  isPointInPath: function isPointInPath(x, y) {
    var self = this;
    var fill = self.hasFill();
    var stroke = self.hasStroke();

    if (fill && stroke) {
      return self._isPointInFill(x, y) || self._isPointInStroke(x, y);
    }

    if (fill) {
      return self._isPointInFill(x, y);
    }

    if (stroke) {
      return self._isPointInStroke(x, y);
    }

    return false;
  },
  _isPointInFill: function _isPointInFill(x, y) {
    var self = this;
    var context = self.get('context');
    if (!context) return undefined;
    self.createPath();
    return context.isPointInPath(x, y);
  },
  _isPointInStroke: function _isPointInStroke(x, y) {
    var self = this;
    var segments = self.get('segments');
    if (!Util.isEmpty(segments)) {
      var lineWidth = self.getHitLineWidth();
      for (var i = 0, l = segments.length; i < l; i++) {
        if (segments[i].isInside(x, y, lineWidth)) {
          return true;
        }
      }
    }

    return false;
  },
  _setTcache: function _setTcache() {
    var totalLength = 0;
    var tempLength = 0;
    var tCache = [];
    var segmentT = void 0;
    var segmentL = void 0;
    var segmentN = void 0;
    var l = void 0;
    var curve = this.curve;

    if (!curve) {
      return;
    }

    Util.each(curve, function (segment, i) {
      segmentN = curve[i + 1];
      l = segment.length;
      if (segmentN) {
        totalLength += CubicMath.len(segment[l - 2], segment[l - 1], segmentN[1], segmentN[2], segmentN[3], segmentN[4], segmentN[5], segmentN[6]);
      }
    });

    Util.each(curve, function (segment, i) {
      segmentN = curve[i + 1];
      l = segment.length;
      if (segmentN) {
        segmentT = [];
        segmentT[0] = tempLength / totalLength;
        segmentL = CubicMath.len(segment[l - 2], segment[l - 1], segmentN[1], segmentN[2], segmentN[3], segmentN[4], segmentN[5], segmentN[6]);
        tempLength += segmentL;
        segmentT[1] = tempLength / totalLength;
        tCache.push(segmentT);
      }
    });

    this.tCache = tCache;
  },
  _calculateCurve: function _calculateCurve() {
    var self = this;
    var attrs = self.__attrs;
    var path = attrs.path;
    this.curve = PathUtil.pathTocurve(path);
  },
  getStartTangent: function getStartTangent() {
    var segments = this.get('segments');
    var startPoint = void 0,
        endPoint = void 0,
        tangent = void 0,
        result = void 0;
    if (segments.length > 1) {
      startPoint = segments[0].endPoint;
      endPoint = segments[1].endPoint;
      tangent = segments[1].startTangent;
      result = [];
      if (Util.isFunction(tangent)) {
        var v = tangent();
        result.push([startPoint.x - v[0], startPoint.y - v[1]]);
        result.push([startPoint.x, startPoint.y]);
      } else {
        result.push([endPoint.x, endPoint.y]);
        result.push([startPoint.x, startPoint.y]);
      }
    }
    return result;
  },
  getEndTangent: function getEndTangent() {
    var segments = this.get('segments');
    var segmentsLen = segments.length;
    var startPoint = void 0,
        endPoint = void 0,
        tangent = void 0,
        result = void 0;
    if (segmentsLen > 1) {
      startPoint = segments[segmentsLen - 2].endPoint;
      endPoint = segments[segmentsLen - 1].endPoint;
      tangent = segments[segmentsLen - 1].endTangent;
      result = [];
      if (Util.isFunction(tangent)) {
        var v = tangent();
        result.push([endPoint.x - v[0], endPoint.y - v[1]]);
        result.push([endPoint.x, endPoint.y]);
      } else {
        result.push([startPoint.x, startPoint.y]);
        result.push([endPoint.x, endPoint.y]);
      }
    }
    return result;
  },
  getPoint: function getPoint(t) {
    var tCache = this.tCache;
    var subt = void 0;
    var index = void 0;

    if (!tCache) {
      this._calculateCurve();
      this._setTcache();
      tCache = this.tCache;
    }

    var curve = this.curve;

    if (!tCache) {
      if (curve) {
        return {
          x: curve[0][1],
          y: curve[0][2]
        };
      }
      return null;
    }
    Util.each(tCache, function (v, i) {
      if (t >= v[0] && t <= v[1]) {
        subt = (t - v[0]) / (v[1] - v[0]);
        index = i;
      }
    });
    var seg = curve[index];
    if (Util.isNil(seg) || Util.isNil(index)) {
      return null;
    }
    var l = seg.length;
    var nextSeg = curve[index + 1];
    return {
      x: CubicMath.at(seg[l - 2], nextSeg[1], nextSeg[3], nextSeg[5], 1 - subt),
      y: CubicMath.at(seg[l - 1], nextSeg[2], nextSeg[4], nextSeg[6], 1 - subt)
    };
  },
  createPath: function createPath(context) {
    var self = this;
    var segments = self.get('segments');
    if (!Util.isArray(segments)) return;

    context = context || self.get('context');

    context.beginPath();
    var segmentsLen = segments.length;

    for (var i = 0; i < segmentsLen; i++) {
      segments[i].draw(context);
    }
  },
  afterPath: function afterPath(context) {
    var self = this;
    var attrs = self.__attrs;
    var segments = self.get('segments');
    var path = attrs.path;
    context = context || self.get('context');
    if (!Util.isArray(segments)) return;
    if (!attrs.startArrow && !attrs.endArrow) {
      return;
    }
    if (path[path.length - 1] === 'z' || path[path.length - 1] === 'Z' || attrs.fill) {
      // 闭合路径不绘制箭头
      return;
    }
    var startPoints = self.getStartTangent();
    Arrow.addStartArrow(context, attrs, startPoints[0][0], startPoints[0][1], startPoints[1][0], startPoints[1][1]);

    var endPoints = self.getEndTangent();
    Arrow.addEndArrow(context, attrs, endPoints[0][0], endPoints[0][1], endPoints[1][0], endPoints[1][1]);
  }
});

module.exports = Path;