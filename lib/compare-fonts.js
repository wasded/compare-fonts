'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var config = require('./config');
var getFont = require('./get-font');
var getHeightScale = require('./get-height-scale');
var getSizeSimilarity = require('./get-size-similarity');
var getVisualSimilarity = require('./get-visual-similarity');
var getAdaptation = require('./get-adaptation');

var compareFonts = function compareFonts(baseFontFilename, comparableFontFilename) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var letterFrequency = options.letterFrequency || config.defaultLetterFrequency;
  var fontsPromises = [getFont(baseFontFilename), getFont(comparableFontFilename)];

  return Promise.all(fontsPromises).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        baseFont = _ref2[0],
        comparableFont = _ref2[1];

    var heightScale = getHeightScale(baseFont, comparableFont);
    var visualSimilarity = getVisualSimilarity(baseFont, comparableFont, heightScale, letterFrequency);
    return Promise.resolve(visualSimilarity);
  });
};

module.exports = compareFonts;