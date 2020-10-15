'use strict';

var config = require('./config');

var getBrowserCanvas = function getBrowserCanvas(width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

var getNodeCanvas = function getNodeCanvas(width, height) {
  var Canvas = require('canvas');
  return new Canvas.createCanvas(width, height);
};

var getSymbolPosition = function getSymbolPosition(symbol, font1, font2, fontSize1, fontSize2) {
  var box1 = font1.getPath(symbol, fontSize1).getBoundingBox();
  var box2 = font2.getPath(symbol, fontSize2).getBoundingBox();

  var offsetX = 1 - Math.min(box1.x1, box2.x1);
  var offsetY = 1 - Math.min(box1.y1, box2.y1);

  var width = Math.ceil(Math.max(box1.x2 - box1.x1, box2.x2 - box2.x1)) + 2;
  var height = Math.ceil(Math.max(box1.y2 - box1.y1, box2.y2 - box2.y1)) + 2;

  return {
    offsetX: offsetX,
    offsetY: offsetY,
    width: width,
    height: height
  };
};

var getPathMatrix = function getPathMatrix(path, width, height, cropBox) {
  var canvas = typeof document !== 'undefined' ? getBrowserCanvas(width, height) : getNodeCanvas(width, height);

  var ctx = canvas.getContext('2d');
  var localPath = path;
  localPath.fill = 'red';
  localPath.draw(ctx);

  var crop = cropBox || { left: 0, top: 0, width: width, height: height };
  return ctx.getImageData(crop.left, crop.top, crop.width, crop.height).data;
};

var getMatrixSimilarity = function getMatrixSimilarity(matrix1, matrix2) {
  var hits = 0;
  var total = 0;
  var i = void 0;
  var c1 = void 0;
  var c2 = void 0;

  for (i = 0; i < matrix1.length; i += 4) {

    c1 = matrix1[i] * matrix1[i + 3] / 255;
    c2 = matrix2[i] * matrix2[i + 3] / 255;

    if (c1 > 200 && c2 > 200) {
      hits += 1;
    }

    if (c1 > 200 || c2 > 200) {
      total += 1;
    }
  }

  if (total === 0) {
    return 0;
  }

  return hits / total;
};

var getSymbolVisualSimilarity = function getSymbolVisualSimilarity(symbol, baseFont, comparableFont, comparableFontSize) {
  var _getSymbolPosition = getSymbolPosition(symbol, baseFont, comparableFont, config.fontSize, comparableFontSize),
      offsetX = _getSymbolPosition.offsetX,
      offsetY = _getSymbolPosition.offsetY,
      width = _getSymbolPosition.width,
      height = _getSymbolPosition.height;

  var baseFontPath = baseFont.getPathAt(symbol, config.fontSize, offsetX, offsetY);
  var comparableFontPath = comparableFont.getPathAt(symbol, comparableFontSize, offsetX, offsetY);

  var baseFontMatrix = getPathMatrix(baseFontPath, width, height);
  var comparableFontMatrix = getPathMatrix(comparableFontPath, width, height);

  return getMatrixSimilarity(baseFontMatrix, comparableFontMatrix);
};

var getVisualStrokeSimilarity = function getVisualStrokeSimilarity(baseFont, comparableFont, heightScale) {
  var comparableFontSize = Math.round(config.fontSize * heightScale);
  var symbol = 'i';
  var cropHeight = 4;

  var _getSymbolPosition2 = getSymbolPosition(symbol, baseFont, comparableFont, config.fontSize, comparableFontSize),
      offsetX = _getSymbolPosition2.offsetX,
      offsetY = _getSymbolPosition2.offsetY,
      width = _getSymbolPosition2.width,
      height = _getSymbolPosition2.height;

  var baseFontPath = baseFont.getPathAt(symbol, config.fontSize, offsetX, offsetY);
  var comparableFontPath = comparableFont.getPathAt(symbol, comparableFontSize, offsetX, offsetY);

  var cropBox = {
    width: width,
    left: 0,
    top: Math.ceil((height - cropHeight) / 2),
    height: cropHeight
  };

  var baseFontMatrix = getPathMatrix(baseFontPath, width, height, cropBox);
  var comparableFontMatrix = getPathMatrix(comparableFontPath, width, height, cropBox);

  return getMatrixSimilarity(baseFontMatrix, comparableFontMatrix);
};

var getVisualSimilarity = function getVisualSimilarity(baseFont, comparableFont, heightScale, letterFrequency) {
  var comparableFontSize = Math.round(config.fontSize * heightScale);
  var avgSimilaritySum = 0;
  var avgSimilarityWeightSum = 0;
  var weight = void 0;
  var similarity = void 0;

  Object.keys(letterFrequency).forEach(function (symbol) {
    similarity = getSymbolVisualSimilarity(symbol, baseFont, comparableFont, comparableFontSize);

    weight = letterFrequency[symbol];

    avgSimilaritySum += similarity * weight;
    avgSimilarityWeightSum += weight;
  });

  var avgSimilarity = avgSimilaritySum / avgSimilarityWeightSum;

  // stroke weight correction (30%)
  var strokeSymbolSimilarity = getVisualStrokeSimilarity(baseFont, comparableFont, heightScale);
  return avgSimilarity * 0.7 + strokeSymbolSimilarity * 0.3;
};

module.exports = getVisualSimilarity;