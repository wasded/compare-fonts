'use strict';

var _compareFonts = require('./lib/compare-fonts');

var _compareFonts2 = _interopRequireDefault(_compareFonts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var folder = '/Users/andreybaskirtcev/Work/FontsScript/src/fonts/';

var fs = require('fs');
var files = fs.readdirSync(folder).filter(function (file) {
  return file.endsWith(".ttf");
});

var firstFont = folder + files[0];

for (var index in files) {
  var secondFont = folder + files[index];
  (0, _compareFonts2.default)(firstFont, secondFont).catch(function (error) {
    return console.log(files[index]);
  });
}

//console.log(files);

//compareFonts(roboto, arial).then(a => console.log(a));