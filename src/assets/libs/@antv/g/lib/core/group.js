var Util = require('../util/index');
var Element = require('./element');
var Shape = require('../shape/index');
var SHAPE_MAP = {}; // 缓存图形类型
var INDEX = '_INDEX';

function find(children, x, y) {
  var rst = void 0;
  for (var i = children.length - 1; i >= 0; i--) {
    var child = children[i];
    if (child.__cfg.visible && child.__cfg.capture) {
      if (child.isGroup) {
        rst = child.getShape(x, y);
      } else if (child.isHit(x, y)) {
        rst = child;
      }
    }
    if (rst) {
      break;
    }
  }
  return rst;
}

function getComparer(compare) {
  return function (left, right) {
    var result = compare(left, right);
    return result === 0 ? left[INDEX] - right[INDEX] : result;
  };
}

var Group = function Group(cfg) {
  Group.superclass.constructor.call(this, cfg);
  this.set('children', []);

  this._beforeRenderUI();
  this._renderUI();
  this._bindUI();
};

function initClassCfgs(c) {
  if (c.__cfg || c === Group) {
    return;
  }
  var superCon = c.superclass.constructor;
  if (superCon && !superCon.__cfg) {
    initClassCfgs(superCon);
  }
  c.__cfg = {};

  Util.merge(c.__cfg, superCon.__cfg);
  Util.merge(c.__cfg, c.CFG);
}

Util.extend(Group, Element);

Util.augment(Group, {
  isGroup: true,
  canFill: true,
  canStroke: true,
  getDefaultCfg: function getDefaultCfg() {
    initClassCfgs(this.constructor);
    return Util.merge({}, this.constructor.__cfg);
  },
  _beforeRenderUI: function _beforeRenderUI() {},
  _renderUI: function _renderUI() {},
  _bindUI: function _bindUI() {},
  addShape: function addShape(type, cfg) {
    var canvas = this.get('canvas');
    cfg = cfg || {};
    var shapeType = SHAPE_MAP[type];
    if (!shapeType) {
      shapeType = Util.upperFirst(type);
      SHAPE_MAP[type] = shapeType;
    }
    if (cfg.attrs) {
      var attrs = cfg.attrs;
      if (type === 'text') {
        // 临时解决
        var topFontFamily = canvas.get('fontFamily');
        if (topFontFamily) {
          attrs.fontFamily = attrs.fontFamily ? attrs.fontFamily : topFontFamily;
        }
      }
    }
    cfg.canvas = canvas;
    cfg.type = type;
    var rst = new Shape[shapeType](cfg);
    this.add(rst);
    return rst;
  },

  /** 添加图组
   * @param  {Function|Object|undefined} param 图组类
   * @param  {Object} cfg 配置项
   * @return {Object} rst 图组
   */
  addGroup: function addGroup(param, cfg) {
    var canvas = this.get('canvas');
    var rst = void 0;
    cfg = Util.merge({}, cfg);
    if (Util.isFunction(param)) {
      if (cfg) {
        cfg.canvas = canvas;
        cfg.parent = this;
        rst = new param(cfg);
      } else {
        rst = new param({
          canvas: canvas,
          parent: this
        });
      }
      this.add(rst);
    } else if (Util.isObject(param)) {
      param.canvas = canvas;
      rst = new Group(param);
      this.add(rst);
    } else if (param === undefined) {
      rst = new Group();
      this.add(rst);
    } else {
      return false;
    }
    return rst;
  },

  /** 绘制背景
   * @param  {Array} padding 内边距
   * @param  {Attrs} attrs 图形属性
   * @param  {Shape} backShape 背景图形
   * @return {Object} 背景层对象
   */
  renderBack: function renderBack(padding, attrs) {
    var backShape = this.get('backShape');
    var innerBox = this.getBBox();
    // const parent = this.get('parent'); // getParent
    Util.merge(attrs, {
      x: innerBox.minX - padding[3],
      y: innerBox.minY - padding[0],
      width: innerBox.width + padding[1] + padding[3],
      height: innerBox.height + padding[0] + padding[2]
    });
    if (backShape) {
      backShape.attr(attrs);
    } else {
      backShape = this.addShape('rect', {
        zIndex: -1,
        attrs: attrs
      });
    }
    this.set('backShape', backShape);
    this.sort();
    return backShape;
  },
  removeChild: function removeChild(item, destroy) {
    if (arguments.length >= 2) {
      if (this.contain(item)) {
        item.remove(destroy);
      }
    } else {
      if (arguments.length === 1) {
        if (Util.isBoolean(item)) {
          destroy = item;
        } else {
          if (this.contain(item)) {
            item.remove(true);
          }
          return this;
        }
      }
      if (arguments.length === 0) {
        destroy = true;
      }

      Group.superclass.remove.call(this, destroy);
    }
    return this;
  },

  /**
   * 向组中添加shape或者group
   * @param {Object} items 图形或者分组
   * @return {Object} group 本尊
   */
  add: function add(items) {
    var self = this;
    var children = self.get('children');
    if (Util.isArray(items)) {
      Util.each(items, function (item) {
        var parent = item.get('parent');
        if (parent) {
          parent.removeChild(item, false);
        }
        self.__setEvn(item);
      });
      children.push.apply(children, items);
    } else {
      var item = items;
      var parent = item.get('parent');
      if (parent) {
        parent.removeChild(item, false);
      }
      self.__setEvn(item);
      children.push(item);
    }
    return self;
  },
  contain: function contain(item) {
    var children = this.get('children');
    return children.indexOf(item) > -1;
  },
  getChildByIndex: function getChildByIndex(index) {
    var children = this.get('children');
    return children[index];
  },
  getFirst: function getFirst() {
    return this.getChildByIndex(0);
  },
  getLast: function getLast() {
    var lastIndex = this.get('children').length - 1;
    return this.getChildByIndex(lastIndex);
  },
  __setEvn: function __setEvn(item) {
    var self = this;
    item.__cfg.parent = self;
    item.__cfg.context = self.__cfg.context;
    item.__cfg.canvas = self.__cfg.canvas;
    var clip = item.__attrs.clip;
    if (clip) {
      clip.setSilent('parent', self);
      clip.setSilent('context', self.get('context'));
    }
    var children = item.__cfg.children;
    if (children) {
      Util.each(children, function (child) {
        item.__setEvn(child);
      });
    }
  },
  getBBox: function getBBox() {
    var self = this;
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;
    var children = self.get('children');
    Util.each(children, function (child) {
      if (child.get('visible')) {
        var _box = child.getBBox();
        if (!_box) {
          return true;
        }

        var leftTop = [_box.minX, _box.minY, 1];
        var leftBottom = [_box.minX, _box.maxY, 1];
        var rightTop = [_box.maxX, _box.minY, 1];
        var rightBottom = [_box.maxX, _box.maxY, 1];

        child.apply(leftTop);
        child.apply(leftBottom);
        child.apply(rightTop);
        child.apply(rightBottom);

        var boxMinX = Math.min(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0]);
        var boxMaxX = Math.max(leftTop[0], leftBottom[0], rightTop[0], rightBottom[0]);
        var boxMinY = Math.min(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1]);
        var boxMaxY = Math.max(leftTop[1], leftBottom[1], rightTop[1], rightBottom[1]);

        if (boxMinX < minX) {
          minX = boxMinX;
        }

        if (boxMaxX > maxX) {
          maxX = boxMaxX;
        }

        if (boxMinY < minY) {
          minY = boxMinY;
        }

        if (boxMaxY > maxY) {
          maxY = boxMaxY;
        }
      }
    });
    var box = {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY
    };
    box.x = box.minX;
    box.y = box.minY;
    box.width = box.maxX - box.minX;
    box.height = box.maxY - box.minY;
    return box;
  },
  drawInner: function drawInner(context) {
    var children = this.get('children');
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      child.draw(context);
    }
    return this;
  },
  getCount: function getCount() {
    return this.get('children').length;
  },
  sort: function sort() {
    var children = this.get('children');
    // 稳定排序
    Util.each(children, function (child, index) {
      child[INDEX] = index;
      return child;
    });

    children.sort(getComparer(function (obj1, obj2) {
      return obj1.get('zIndex') - obj2.get('zIndex');
    }));

    return this;
  },
  find: function find(id) {
    return this.findBy(function (item) {
      return item.get('id') === id;
    });
  },

  /**
   * 根据查找函数查找分组或者图形
   * @param  {Function} fn 匹配函数
   * @return {Canvas.Base} 分组或者图形
   */
  findBy: function findBy(fn) {
    var children = this.get('children');
    var rst = null;

    Util.each(children, function (item) {
      if (fn(item)) {
        rst = item;
      } else if (item.findBy) {
        rst = item.findBy(fn);
      }
      if (rst) {
        return false;
      }
    });
    return rst;
  },
  findAllBy: function findAllBy(fn) {
    var children = this.get('children');
    var rst = [];
    var childRst = [];
    Util.each(children, function (item) {
      if (fn(item)) {
        rst.push(item);
      }
      if (item.findAllBy) {
        childRst = item.findAllBy(fn);
        rst = rst.concat(childRst);
      }
    });
    return rst;
  },

  /**
   * 根据x，y轴坐标获取对应的图形
   * @param  {Number} x x坐标
   * @param  {Number} y y坐标
   * @return {Object}  最上面的图形
   */
  getShape: function getShape(x, y) {
    var self = this;
    var clip = self.__attrs.clip;
    var children = self.__cfg.children;
    var rst = void 0;
    if (clip) {
      if (clip.inside(x, y)) {
        rst = find(children, x, y);
      }
    } else {
      rst = find(children, x, y);
    }
    return rst;
  },
  clearTotalMatrix: function clearTotalMatrix() {
    var m = this.get('totalMatrix');
    if (m) {
      this.setSilent('totalMatrix', null);
      var children = this.__cfg.children;
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        child.clearTotalMatrix();
      }
    }
  },
  clear: function clear() {
    var children = this.get('children');

    while (children.length !== 0) {
      children[children.length - 1].remove();
    }
    return this;
  },
  destroy: function destroy() {
    if (this.get('destroyed')) {
      return;
    }
    this.clear();
    Group.superclass.destroy.call(this);
  }
});

module.exports = Group;