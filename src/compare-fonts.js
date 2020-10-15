const config = require('./config');
const getFont = require('./get-font');
const getHeightScale = require('./get-height-scale');
const getSizeSimilarity = require('./get-size-similarity');
const getVisualSimilarity = require('./get-visual-similarity');
const getAdaptation = require('./get-adaptation');

const compareFonts = (baseFontFilename, comparableFontFilename, options = {}) => {
  const letterFrequency = options.letterFrequency || config.defaultLetterFrequency;
  const fontsPromises = [
    getFont(baseFontFilename),
    getFont(comparableFontFilename),
  ];

  return Promise.all(fontsPromises).then(([baseFont, comparableFont]) => {
    const heightScale = getHeightScale(baseFont, comparableFont);
    const visualSimilarity = getVisualSimilarity(baseFont, comparableFont, heightScale, letterFrequency);
    return Promise.resolve(visualSimilarity);
  });
};

module.exports = compareFonts;
