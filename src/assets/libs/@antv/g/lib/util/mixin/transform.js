var Util = require('../index');
var mat3 = require('../matrix').mat3;
var vec3 = require('../matrix').vec3;

// 是否未改变
function isUnchanged(m) {
  return m[0] === 1 && m[1] === 0 && m[3] === 0 && m[4] === 1 && m[6] === 0 && m[7] === 0;
}

// 是否仅仅是scale
function isScale(m) {
  return m[1] === 0 && m[3] === 0 && m[6] === 0 && m[7] === 0;
}

function multiple(m1, m2) {
  if (!isUnchanged(m2)) {
    if (isScale(m2)) {
      m1[0] *= m2[0];
      m1[4] *= m2[4];
    } else {
      mat3.multiply(m1, m1, m2);
    }
  }
}

module.exports = {
  initTransform: function initTransform() {
    this.attr('matrix', [1, 0, 0, 0, 1, 0, 0, 0, 1]);
  },
  translate: function translate(tx, ty) {
    var matrix = this.attr('matrix');
    mat3.translate(matrix, matrix, [tx, ty]);
    this.clearTotalMatrix();
    this.attr('matrix', matrix);
    return this;
  },
  rotate: function rotate(radian) {
    var matrix = this.attr('matrix');
    mat3.rotate(matrix, matrix, radian);
    this.clearTotalMatrix();
    this.attr('matrix', matrix);
    return this;
  },
  scale: function scale(s1, s2) {
    var matrix = this.attr('matrix');
    mat3.scale(matrix, matrix, [s1, s2]);
    this.clearTotalMatrix();
    this.attr('matrix', matrix);
    return this;
  },

  /**
   * 绕起始点旋转
   * @param  {Number} rotate 0～360
   */
  rotateAtStart: function rotateAtStart(rotate) {
    var x = this.attr('x');
    var y = this.attr('y');
    if (Math.abs(rotate) > Math.PI * 2) {
      rotate = rotate / 180 * Math.PI;
    }
    this.transform([['t', -x, -y], ['r', rotate], ['t', x, y]]);
  },

  /**
   * 移动的到位置
   * @param  {Number} x 移动到x
   * @param  {Number} y 移动到y
   */
  move: function move(x, y) {
    var cx = this.get('x') || 0; // 当前的x
    var cy = this.get('y') || 0; // 当前的y
    this.translate(x - cx, y - cy);
    this.set('x', x);
    this.set('y', y);
  },
  transform: function transform(ts) {
    var self = this;
    var matrix = self.attr('matrix');

    Util.each(ts, function (t) {
      switch (t[0]) {
        case 't':
          self.translate(t[1], t[2]);
          break;
        case 's':
          self.scale(t[1], t[2]);
          break;
        case 'r':
          self.rotate(t[1]);
          break;
        case 'm':
          self.attr('matrix', mat3.multiply([], matrix, t[1]));
          self.clearTotalMatrix();
          break;
        default:
          break;
      }
    });
    return self;
  },
  setTransform: function setTransform(ts) {
    this.attr('matrix', [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    return this.transform(ts);
  },
  getMatrix: function getMatrix() {
    return this.attr('matrix');
  },
  setMatrix: function setMatrix(m) {
    this.attr('matrix', m);
    this.clearTotalMatrix();
    return this;
  },
  apply: function apply(v, root) {
    var m = void 0;
    if (root) {
      m = this._getMatrixByRoot(root);
    } else {
      m = this.attr('matrix');
    }
    vec3.transformMat3(v, v, m);
    return this;
  },

  // 获取到达指定根节点的矩阵
  _getMatrixByRoot: function _getMatrixByRoot(root) {
    var self = this;
    root = root || self;
    var parent = self;
    var parents = [];

    while (parent !== root) {
      parents.unshift(parent);
      parent = parent.get('parent');
    }
    parents.unshift(parent);

    var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    Util.each(parents, function (child) {
      mat3.multiply(m, child.attr('matrix'), m);
    });
    return m;
  },

  /**
   * 应用到当前元素上的总的矩阵
   * @return {Matrix} 矩阵
   */
  getTotalMatrix: function getTotalMatrix() {
    var m = this.__cfg.totalMatrix;
    if (!m) {
      m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      var parent = this.__cfg.parent;
      if (parent) {
        var pm = parent.getTotalMatrix();
        multiple(m, pm);
      }

      multiple(m, this.attr('matrix'));
      this.__cfg.totalMatrix = m;
    }
    return m;
  },

  // 清除当前的矩阵
  clearTotalMatrix: function clearTotalMatrix() {
    // this.__cfg.totalMatrix = null;
  },
  invert: function invert(v) {
    var m = this.getTotalMatrix();
    // 单精屏幕下大多数矩阵没变化
    if (isScale(m)) {
      v[0] /= m[0];
      v[1] /= m[4];
    } else {
      var inm = mat3.invert([], m);
      if (inm) {
        vec3.transformMat3(v, v, inm);
      }
    }
    return this;
  },
  resetTransform: function resetTransform(context) {
    var mo = this.attr('matrix');
    // 不改变时
    if (!isUnchanged(mo)) {
      context.transform(mo[0], mo[1], mo[3], mo[4], mo[6], mo[7]);
    }
  }
};