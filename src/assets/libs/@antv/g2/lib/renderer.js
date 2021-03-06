
var G = require('@antv/g/lib');
var Global = require('./global');
var Util = require('./util');

var renderer = G.canvas;

if (Global.renderer === 'svg') {
  renderer = G.svg;
}

Util.mix(renderer, G);

module.exports = renderer;