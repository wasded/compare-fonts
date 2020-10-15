'use strict';

var config = require('./config');

var getPathHeight = function getPathHeight(path) {
  var box = path.getBoundingBox();
  return box.x2 - box.x1;
};

var getHeightScale = function getHeightScale(baseFont, comparableFont) {
  var symbol = 'o';

  var baseFontHeight = getPathHeight(baseFont.getPath(symbol, config.fontSize));
  var comparableFontHeight = getPathHeight(comparableFont.getPath(symbol, config.fontSize));
  return baseFontHeight / comparableFontHeight;
};

module.exports = getHeightScale;