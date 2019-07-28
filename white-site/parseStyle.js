// модуль для роботи з файловою системою
const fs = require(`fs`);
// модуль для роботи зі шляхами
const path = require(`path`);
const bgUrlStyleRegex = /[:,\s]\s*url(\s*\(\s*(?:'(\S*?)'|"(\S*?)"|((?:\\\s|\\\)|\\\"|\\\'|\S)*?))\s*\))/g;
let styleFile = fs.readFileSync(`bitrix/cache/css/s1/stomatolog/kernel_main/kernel_main_v10d98.css`, `utf8`);
let bgUrl = styleFile.match(bgUrlStyleRegex);
let bgUrlStyleObj = {};
bgUrl.forEach((elem)=>{
    elem = elem.replace(bgUrlStyleRegex, `$1`);
    elem = path.resolve(elem);
    bgUrlStyleObj[elem] =  true;
});
console.log(bgUrlStyleObj);
