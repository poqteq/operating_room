function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Util = require('../../util');
var PolarLabels = require('./polar-labels');
var PathUtil = require('../util/path');
var Global = require('../../global');
var MARGIN = 5;

function getEndPoint(center, angle, r) {
  return {
    x: center.x + r * Math.cos(angle),
    y: center.y + r * Math.sin(angle)
  };
}

function antiCollision(labels, lineHeight, plotRange, center, isRight) {
  // adjust y position of labels to avoid overlapping
  var overlapping = true;
  var start = plotRange.start;
  var end = plotRange.end;
  var startY = Math.min(start.y, end.y);
  var totalHeight = Math.abs(start.y - end.y);
  var i = void 0;

  var maxY = 0;
  var minY = Number.MIN_VALUE;
  var boxes = labels.map(function (label) {
    if (label.y > maxY) {
      maxY = label.y;
    }
    if (label.y < minY) {
      minY = label.y;
    }
    return {
      size: lineHeight,
      targets: [label.y - startY]
    };
  });
  minY -= startY;
  if (maxY - startY > totalHeight) {
    totalHeight = maxY - startY;
  }

  while (overlapping) {
    /* eslint no-loop-func: 0 */
    boxes.forEach(function (box) {
      var target = (Math.min.apply(minY, box.targets) + Math.max.apply(minY, box.targets)) / 2;
      box.pos = Math.min(Math.max(minY, target - box.size / 2), totalHeight - box.size);
      // box.pos = Math.max(0, target - box.size / 2);
    });

    // detect overlapping and join boxes
    overlapping = false;
    i = boxes.length;
    while (i--) {
      if (i > 0) {
        var previousBox = boxes[i - 1];
        var box = boxes[i];
        if (previousBox.pos + previousBox.size > box.pos) {
          // overlapping
          previousBox.size += box.size;
          previousBox.targets = previousBox.targets.concat(box.targets);

          // overflow, shift up
          if (previousBox.pos + previousBox.size > totalHeight) {
            previousBox.pos = totalHeight - previousBox.size;
          }
          boxes.splice(i, 1); // removing box
          overlapping = true;
        }
      }
    }
  }

  i = 0;
  // step 4: normalize y and adjust x
  boxes.forEach(function (b) {
    var posInCompositeBox = startY + lineHeight / 2; // middle of the label
    b.targets.forEach(function () {
      labels[i].y = b.pos + posInCompositeBox;
      posInCompositeBox += lineHeight;
      i++;
    });
  });

  // (x - cx)^2 + (y - cy)^2 = totalR^2
  labels.forEach(function (label) {
    var rPow2 = label.r * label.r;
    var dyPow2 = Math.pow(Math.abs(label.y - center.y), 2);
    if (rPow2 < dyPow2) {
      label.x = center.x;
    } else {
      var dx = Math.sqrt(rPow2 - dyPow2);
      if (!isRight) {
        // left
        label.x = center.x - dx;
      } else {
        // right
        label.x = center.x + dx;
      }
    }
  });
}

var PieLabels = function (_PolarLabels) {
  _inherits(PieLabels, _PolarLabels);

  function PieLabels() {
    _classCallCheck(this, PieLabels);

    return _possibleConstructorReturn(this, _PolarLabels.apply(this, arguments));
  }

  PieLabels.prototype.getDefaultCfg = function getDefaultCfg() {
    return {
      label: Global.thetaLabels
    };
  };

  PieLabels.prototype.getDefaultOffset = function getDefaultOffset() {
    var labelCfg = this.get('label');
    var offset = labelCfg.offset || 0;
    return offset;
  };

  /**
   * @protected
   * to avoid overlapping
   * @param {Array} items labels to be placed
   * @return {Array} items
   */


  PieLabels.prototype.adjustItems = function adjustItems(items) {
    var self = this;
    var offset = self.getDefaultOffset();
    if (offset > 0) {
      items = self._distribute(items, offset);
    }

    return items;
  };

  /**
   * @private
   * distribute labels
   * @param {Array} labels labels
   * @param {Number} offset offset
   * @return {Array} labels
   */


  PieLabels.prototype._distribute = function _distribute(labels, offset) {
    var self = this;
    var coord = self.get('coord');
    var radius = coord.getRadius();
    var lineHeight = self.get('label').labelHeight;
    var center = coord.getCenter();
    var totalR = radius + offset;
    var totalHeight = totalR * 2 + lineHeight * 2;
    var plotRange = {
      start: coord.start,
      end: coord.end
    };
    var geom = self.get('geom');
    if (geom) {
      var view = geom.get('view');
      plotRange = view.getViewRegion();
    }

    // step 1: separate labels
    var halves = [[], // left
    [] // right
    ];
    labels.forEach(function (label) {
      if (label.textAlign === 'right') {
        // left
        halves[0].push(label);
      } else {
        // right or center will be put on the right side
        halves[1].push(label);
      }
    });

    halves.forEach(function (half, index) {
      // step 2: reduce labels
      var maxLabelsCountForOneSide = parseInt(totalHeight / lineHeight, 10);
      if (half.length > maxLabelsCountForOneSide) {
        half.sort(function (a, b) {
          // sort by percentage DESC
          return b['..percent'] - a['..percent'];
        });
        half.splice(maxLabelsCountForOneSide, half.length - maxLabelsCountForOneSide);
      }

      // step 3: distribute position (x and y)
      half.sort(function (a, b) {
        // sort by y ASC
        return a.y - b.y;
      });
      antiCollision(half, lineHeight, plotRange, center, index);
    });

    return halves[0].concat(halves[1]);
  };

  // 连接线


  PieLabels.prototype.lineToLabel = function lineToLabel(label, labelLine) {
    var self = this;
    var coord = self.get('coord');
    var r = coord.getRadius();
    var distance = self.getDefaultOffset();
    var angle = label.orignAngle || label.angle;
    var center = coord.getCenter();
    var start = getEndPoint(center, angle, r + MARGIN / 2);
    var inner = getEndPoint(center, angle, r + distance / 2);
    var lineGroup = self.get('lineGroup');
    // var lineShape;
    if (!lineGroup) {
      lineGroup = self.addGroup({
        elCls: 'x-line-group'
      });
      self.set('lineGroup', lineGroup);
    }
    // lineShape =
    var lineShape = lineGroup.addShape('path', {
      attrs: Util.mix({
        path: ['M' + start.x, start.y + ' Q' + inner.x, inner.y + ' ' + label.x, label.y].join(','),
        fill: null,
        stroke: label.color
      }, labelLine)
    });
    // label 对应线的动画关闭
    lineShape.name = 'labelLine';
    lineShape._id = label._id && label._id.replace('glabel', 'glabelline'); // generate labelLine id according to label id
    lineShape.set('coord', coord);
  };

  /**
   * @protected
   * get rotation for label
   * @param {Number} angle angle
   * @param {Number} offset offset
   * @return {Number} rotate
   */


  PieLabels.prototype.getLabelRotate = function getLabelRotate(angle, offset) {
    var rotate = void 0;
    if (offset < 0) {
      rotate = angle * 180 / Math.PI;
      if (rotate > 90) {
        rotate = rotate - 180;
      }
      if (rotate < -90) {
        rotate = rotate + 180;
      }
    }
    return rotate / 180 * Math.PI;
  };

  /**
   * @protected
   * get text align for label
   * @param {Object} point point
   * @return {String} align
   */


  PieLabels.prototype.getLabelAlign = function getLabelAlign(point) {
    var self = this;
    var coord = self.get('coord');
    var center = coord.getCenter();

    var align = void 0;
    if (point.angle <= Math.PI / 2 && point.x >= center.x) {
      align = 'left';
    } else {
      align = 'right';
    }

    var offset = self.getDefaultOffset();
    if (offset <= 0) {
      if (align === 'right') {
        align = 'left';
      } else {
        align = 'right';
      }
    }
    return align;
  };

  PieLabels.prototype.getArcPoint = function getArcPoint(point) {
    return point;
  };

  PieLabels.prototype.getPointAngle = function getPointAngle(point) {
    var self = this;
    var coord = self.get('coord');
    var startPoint = {
      x: Util.isArray(point.x) ? point.x[0] : point.x,
      y: point.y[0]
    };
    self.transLabelPoint(startPoint); // 转换到画布坐标，如果坐标系发生改变
    var endPoint = {
      x: Util.isArray(point.x) ? point.x[1] : point.x,
      y: point.y[1]
    };
    self.transLabelPoint(endPoint); // 转换到画布坐标，如果坐标系发生改变
    var angle = void 0;
    var startAngle = PathUtil.getPointAngle(coord, startPoint);
    if (point.points && point.points[0].y === point.points[1].y) {
      angle = startAngle;
    } else {
      var endAngle = PathUtil.getPointAngle(coord, endPoint);
      if (startAngle >= endAngle) {
        // 100% pie slice
        endAngle = endAngle + Math.PI * 2;
      }
      angle = startAngle + (endAngle - startAngle) / 2;
    }
    return angle;
  };

  PieLabels.prototype.getCirclePoint = function getCirclePoint(angle, offset) {
    var self = this;
    var coord = self.get('coord');
    var center = coord.getCenter();
    var r = coord.getRadius() + offset;
    var point = getEndPoint(center, angle, r);
    point.angle = angle;
    point.r = r;
    return point;
  };

  return PieLabels;
}(PolarLabels);

module.exports = PieLabels;