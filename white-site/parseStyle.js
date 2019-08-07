// модуль для роботи з файловою системою
const fs = require(`fs`);
// модуль для роботи зі шляхами
const path = require(`path`);
const bgUrlStyleRegex = /([:,\s]\s*url\s*\(\s*((?:'(\S*?)'|"(\S*?)"|((?:\\\s|\\\)|\\\"|\\\'|\S)*?))\s*)\))/gi;
let styleFile = fs.readFileSync(`main/style.css`, `utf8`);
let bgUrl = styleFile.match(bgUrlStyleRegex);
let bgUrlStyleObj = {};


// -------
let importStylesRegex = /@import[ ]*['\"]{0,}(url\()*['\"]*([^;'\"\)]*)['\"\)]*/gi;
let importStylesUrl = styleFile.match(importStylesRegex);

if (importStylesUrl) {
    importStylesUrl = importStylesUrl.map((importUrl)=>{
         let url = importUrl.replace(importStylesRegex, `$2`);
        let absPath = path.resolve(__dirname, `${path.dirname(`main/style.css`)}/`, url);
        return absPath;
    });
    console.log(importStylesUrl);
}


// підчищаємо за регуляркою лапки
bgUrl.forEach((elem)=>{
    elem = elem.replace(bgUrlStyleRegex, `$2`);
    if (elem[elem.length - 1] === `'` || elem[elem.length - 1] === `"` ) {
        elem = elem.substring(0, elem.length - 1);
    }
    if (elem[0] === `'` || elem[0] === `"`) {
        elem = elem.substring(1);
    }

    let absPath = path.resolve(__dirname, `${path.dirname(`main/style.css`)}/`, elem);
    bgUrlStyleObj[absPath] =  true;
});
console.log(bgUrlStyleObj);
