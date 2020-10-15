'use strict';

var shuffle = require('shuffle-array');

var config = require('./config');

var getLetterSpacing = function getLetterSpacing(baseFont, comparableFont, comparableFontSize, letterFrequency) {
  var symbols = [];

  Object.keys(letterFrequency).forEach(function (symbol) {
    for (var i = 0; i < Math.ceil(letterFrequency[symbol] * 10); i += 1) {
      symbols.push(symbol);
    }
  });

  shuffle(symbols);
  var text = symbols.join('');

  var baseFontWidth = baseFont.getTextWidth(text, config.fontSize);
  var comparableFontWidth = comparableFont.getTextWidth(text, comparableFontSize);

  var spaces = text.length - 1;

  return (baseFontWidth - comparableFontWidth) / spaces / comparableFontSize;
};

var getWordSpacing = function getWordSpacing(baseFont, comparableFont, comparableFontSize, letterSpacing) {
  var textNoSpace = 'oo';
  var textWithSpace = 'o o';

  var baseFontWidthNoSpace = baseFont.getTextWidth(textNoSpace, config.fontSize);
  var comparableFontWidthNoSpace = comparableFont.getTextWidth(textNoSpace, comparableFontSize);

  var baseFontWidthWithSpace = baseFont.getTextWidth(textWithSpace, config.fontSize);
  var comparableFontWidthWithSpace = comparableFont.getTextWidth(textWithSpace, comparableFontSize);

  var baseFontDiff = baseFontWidthWithSpace - baseFontWidthNoSpace;
  var comparableFontDiff = comparableFontWidthWithSpace - comparableFontWidthNoSpace;

  return (baseFontDiff - comparableFontDiff) / comparableFontSize - letterSpacing * 2;
};

var getAdaptation = function getAdaptation(baseFont, comparableFont, heightScale, letterFrequency) {
  var comparableFontSize = Math.round(config.fontSize * heightScale);

  var letterSpacing = getLetterSpacing(baseFont, comparableFont, comparableFontSize, letterFrequency);
  var wordSpacing = getWordSpacing(baseFont, comparableFont, comparableFontSize, letterSpacing);

  return {
    letterSpacing: letterSpacing,
    wordSpacing: wordSpacing,
    fontSize: heightScale
  };
};

module.exports = getAdaptation;