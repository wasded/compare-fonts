'use strict';

var opentype = require('opentype.js');

var getFontObject = function getFontObject(font) {
  var getPath = function getPath(text, size) {
    return font.getPath(text, 0, 0, size);
  };

  var getPathAt = function getPathAt(text, size, x, y) {
    return font.getPath(text, x, y, size);
  };

  var getSymbolWidth = function getSymbolWidth(symbol, size) {
    var glyph = font.charToGlyph(symbol);
    return glyph.advanceWidth / (glyph.path.unitsPerEm * size);
  };

  var getTextWidth = function getTextWidth(text, size) {
    if (text.length === 1) {
      return getSymbolWidth(text, size);
    }
    var box = getPath(text, size).getBoundingBox();
    return box.x2 - box.x1;
  };

  return {
    getPath: getPath,
    getPathAt: getPathAt,
    getTextWidth: getTextWidth
  };
};

var getFont = function getFont(filename) {
  return new Promise(function (resolve, reject) {
    if (filename && filename.getPath) {
      return resolve(getFontObject(filename));
    }

    return opentype.load(filename, function (err, font) {
      if (err) {
        return reject(err);
      }
      return resolve(getFontObject(font));
    });
  });
};

module.exports = getFont;