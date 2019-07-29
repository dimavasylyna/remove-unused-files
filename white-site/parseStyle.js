// модуль для роботи з файловою системою
const fs = require(`fs`);
// модуль для роботи зі шляхами
const path = require(`path`);
const bgUrlStyleRegex = /([:,\s]\s*url\s*\(\s*((?:'(\S*?)'|"(\S*?)"|((?:\\\s|\\\)|\\\"|\\\'|\S)*?))\s*)\))/gi;
let styleFile = fs.readFileSync(`bitrix/cache/css/s1/stomatolog/kernel_main/kernel_main_v10d98.css`, `utf8`);
let bgUrl = styleFile.match(bgUrlStyleRegex);
let bgUrlStyleObj = {};

// підчищаємо за регуляркою лапки
bgUrl.forEach((elem)=>{
    elem = elem.replace(bgUrlStyleRegex, `$2`);
    if (elem[elem.length - 1] === `'` || elem[elem.length - 1] === `"` ) {
        elem = elem.substring(0, elem.length - 1);
    }
    if (elem[0] === `'` || elem[0] === `"`) {
        elem = elem.substring(1);
    }

    bgUrlStyleObj[elem] =  true;
});
console.log(bgUrlStyleObj);
