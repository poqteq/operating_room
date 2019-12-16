var Util = require('../index');
var PathUtil = require('../path');
var d3Timer = require('d3-timer');
var d3Ease = require('d3-ease');

var _require = require('d3-interpolate'),
    interpolate = _require.interpolate,
    interpolateArray = _require.interpolateArray; // 目前整体动画只需要数值和数组的差值计算

var Timeline = function Timeline() {
  // 待执行动画的队列
  this._animators = [];
  // 当前时间
  this._current = 0;
  // 计时器实例
  this._timer = null;
};

function _update(self, animator, ratio) {
  var cProps = {}; // 此刻属性
  var toAttrs = animator.toAttrs;
  var fromAttrs = animator.fromAttrs;
  var toMatrix = animator.toMatrix;
  if (self.get('destroyed')) {
    return;
  }
  var interf = void 0; //  差值函数
  for (var k in toAttrs) {
    if (!Util.isEqual(fromAttrs[k], toAttrs[k])) {
      if (k === 'path') {
        var toPath = PathUtil.parsePathString(toAttrs[k]); // 终点状态
        var fromPath = PathUtil.parsePathString(fromAttrs[k]); // 起始状态
        cProps[k] = [];
        for (var i = 0; i < toPath.length; i++) {
          var toPathPoint = toPath[i];
          var fromPathPoint = fromPath[i];
          var cPathPoint = [];
          for (var j = 0; j < toPathPoint.length; j++) {
            if (Util.isNumber(toPathPoint[j]) && fromPathPoint) {
              interf = interpolate(fromPathPoint[j], toPathPoint[j]);
              cPathPoint.push(interf(ratio));
            } else {
              cPathPoint.push(toPathPoint[j]);
            }
          }
          cProps[k].push(cPathPoint);
        }
      } else {
        interf = interpolate(fromAttrs[k], toAttrs[k]);
        cProps[k] = interf(ratio);
      }
    }
  }
  if (toMatrix) {
    var mf = interpolateArray(animator.fromMatrix, toMatrix);
    var cM = mf(ratio);
    self.setMatrix(cM);
  }
  self.attr(cProps);
}

function update(shape, animator, elapsed) {
  var startTime = animator.startTime;
  // 如果还没有开始执行或暂停，先不更新
  if (elapsed < startTime + animator.delay || animator.isPaused) {
    return false;
  }
  var ratio = void 0;
  var isFinished = false;
  var duration = animator.duration;
  var easing = animator.easing;
  // 已执行时间
  elapsed = elapsed - startTime - animator.delay;
  if (animator.toAttrs.repeat) {
    ratio = elapsed % duration / duration;
    ratio = d3Ease[easing](ratio);
  } else {
    ratio = elapsed / duration;
    if (ratio < 1) {
      ratio = d3Ease[easing](ratio);
    } else {
      ratio = 1;
      if (animator.callback) {
        animator.callback();
      }
      isFinished = true;
    }
  }
  _update(shape, animator, ratio);
  return isFinished;
}

Util.augment(Timeline, {
  initTimer: function initTimer() {
    var _this = this;

    var self = this;
    var isFinished = false;
    var shape = void 0,
        animators = void 0,
        animator = void 0,
        canvas = void 0;
    self._timer = d3Timer.timer(function (elapsed) {
      self._current = elapsed;
      if (_this._animators.length > 0) {
        for (var i = _this._animators.length - 1; i >= 0; i--) {
          shape = _this._animators[i];
          if (shape.get('destroyed')) {
            // 如果已经被销毁，直接移出队列
            self.removeAnimator(i);
            continue;
          }
          if (!canvas) {
            canvas = shape.get('canvas');
          }
          if (!shape.get('pause').isPaused) {
            animators = shape.get('animators');
            for (var j = animators.length - 1; j >= 0; j--) {
              animator = animators[j];
              isFinished = update(shape, animator, elapsed);
              if (isFinished) {
                animators.splice(j, 1);
                isFinished = false;
              }
            }
          }
          if (animators.length === 0) {
            self.removeAnimator(i);
          }
        }
        if (canvas) {
          canvas.draw();
        }
      }
    });
  },
  addAnimator: function addAnimator(shape) {
    this._animators.push(shape);
  },
  removeAnimator: function removeAnimator(index) {
    this._animators.splice(index, 1);
  },
  clear: function clear() {
    this._animators = [];
  },
  isAnimating: function isAnimating() {
    return !!this._animators.length;
  },
  getTime: function getTime() {
    return this._current;
  }
});

module.exports = Timeline;