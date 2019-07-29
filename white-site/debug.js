const htmlFilePathList = [
    `index.html`,
    `uslugi/index.html`,
    `contacts/contacts/contacts/index.html`
];
// модуль для роботи з файловою системою
const fs = require(`fs`);
// модуль для роботи зі шляхами
const path = require(`path`);
// модуль для роботи з DOM в файлах/сервері
const cheerio = require(`cheerio`);


let getLinks = (selector, attr, file) => {
    // підгружаємо файл, в якому будемо працювати
    // (обовязково ставити { decodeEntities: false })
    // інакше нелатинські символи будуть в hex unicode
    let $ = cheerio.load(fs.readFileSync(file), { decodeEntities: false });
    let resultObj = {};
    $(selector).each(function(i, link){
        // ${path.dirname(file)}/ - прибирає зі шляху назву файлу
        // uslugi/index.html => uslugi/
        let filePath = path.resolve(__dirname, `${path.dirname(file)}/`, $(this).attr(attr));
        // перевіряємо, чи існує файл за підключеним лінком
        if (fs.existsSync(filePath)) {
            console.log(`is file!`);
        } else {
            console.log(`sorry, it not a file`);
            return;
        }
        resultObj[filePath] = true;
    });
    // повертає обєкт з абсолютними шляхами, типу {path: true}
    console.log(resultObj);
    return resultObj;
}

let styles = getLinks(`link[rel=stylesheet]`, `href`, `uslugi/index.html`);
console.log(styles);