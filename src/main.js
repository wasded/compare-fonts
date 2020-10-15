import compareFonts from './lib/compare-fonts';

const folder = '/Users/andreybaskirtcev/Work/FontsScript/src/fonts/'

main()

async function main() {

  var result = {}
  var fs = require('fs');
  var files = fs.readdirSync(folder).filter(file => file.endsWith(".ttf"));

  for (var index in files) {
    var firstFontName = files[index]
    var firstFontPath = folder + firstFontName

    var array = []

    for (var index in files) {
      let secondFontName = files[index]
      var secondFontPath = folder + secondFontName

      result[firstFontName] = []

      let similarityIndex = await compareFonts(firstFontPath, secondFontPath)

      var value = new SimilarityFont(secondFontName, similarityIndex)
      array.push({fontName: secondFontName, similarity: similarityIndex})
    }

    array.sort(function(a,b) {
      return b.similarity-a.similarity
    })

    result[firstFontName] = array


    var json = JSON.stringify(result)

    console.log(json);

    if (index === 2) {
      break
    }

    fs.writeFile('myjsonfile.json', json, 'utf8', function(error) { });
  }
}

class SimilarityFont {
  constructor(fontName, similarityIndex) {
    this.fontName = fontName
    this.similarityIndex = similarityIndex
  }
}
