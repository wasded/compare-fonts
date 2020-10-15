'use strict';

var config = require('./config');

var getSizeSimilarity = function getSizeSimilarity(baseFont, comparableFont, heightScale, letterFrequency) {
  var comparableFontSize = Math.round(config.fontSize * heightScale);
  var avgSimilaritySum = 0;
  var avgSimilarityWeightSum = 0;
  var baseFontWidth = void 0;
  var comparableFontWidth = void 0;
  var weight = void 0;
  var similarity = void 0;

  Object.keys(letterFrequency).forEach(function (symbol) {
    baseFontWidth = baseFont.getTextWidth(symbol, config.fontSize);
    comparableFontWidth = comparableFont.getTextWidth(symbol, comparableFontSize);

    if (baseFontWidth > comparableFontWidth) {
      similarity = comparableFontWidth / baseFontWidth;
    } else {
      similarity = baseFontWidth / comparableFontWidth;
    }

    weight = letterFrequency[symbol];

    avgSimilaritySum += similarity * weight;
    avgSimilarityWeightSum += weight;
  });

  return avgSimilaritySum / avgSimilarityWeightSum;
};

module.exports = getSizeSimilarity;