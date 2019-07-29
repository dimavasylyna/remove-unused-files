var css = require('css');

// модуль для роботи з файловою системою
const fs = require(`fs`);
// модуль для роботи зі шляхами
const path = require(`path`);
let styleFile = fs.readFileSync(`bitrix/cache/css/s1/stomatolog/kernel_main/kernel_main_v10d98.css`, `utf8`);
var ast = css.parse('body { font-size: 12px; }', { source: 'source.css' });

var css = css.stringify(ast);

var result = css.stringify(ast, { sourcemap: true });

console.log(result.code);