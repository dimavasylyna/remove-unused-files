// для звичайного js використовується метод forEach, а для cheerio - each(index, element) (див. документацію по cheerio);


// Файли, які необхідно просканувати на ресурси
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
let count = 0;
let allUsedFilesPathObj = {};
let allFilesPath = [];

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
			resultObj[filePath] = true;
		}

	});
	// повертає обєкт з абсолютними шляхами, типу {path: true}
	// console.log(resultObj);
	return resultObj;
}

let parseCss = (filePath) => {
	const bgUrlStyleRegex = /([:,\s]\s*url\s*\(\s*((?:'(\S*?)'|"(\S*?)"|((?:\\\s|\\\)|\\\"|\\\'|\S)*?))\s*)\))/gi;
	// console.log(filePath + ` filePath ------------`);
	let styleFile = fs.readFileSync(filePath, `utf8`);
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
	// console.log(bgUrlStyleObj);
}
let findAllDependence = (file) => {
	// знаходимо шляхи всіх ресурсів, які використовуються
	let objStyles = getLinks(`link[rel=stylesheet]`, `href`, file);
	let objScripts = getLinks(`script[src]`, `src`, file);
	let objImg = getLinks(`img[src]`, `src`, file);
	let favicons = getLinks(`link[rel*=icon]`, `href`, file);

	for (let styleFile in objStyles) {
		parseCss(styleFile);
	}

	let objUsedFilesPath = {...objStyles, ...objScripts, ...objImg, ...favicons};
	// повертаємо обєкт з абсолютними шляхами, типу {path: true}
	return objUsedFilesPath;
}



// запихуємо результати для всіх файлів, які використовуються 
htmlFilePathList.forEach((file)=>allUsedFilesPathObj = Object.assign(allUsedFilesPathObj, findAllDependence(file)));



// ф-ція пошуку всіх файлів в директорії і піддиректоріях
function getAllFiles(dirPath){
      fs.readdirSync(dirPath).forEach(function(file) {
      let filePath = path.join(dirPath , file);
      let stat= fs.statSync(filePath);
      if (stat.isDirectory()) {            
        getAllFiles(filePath);  
      } else {
             // записуємо в масив абсолютний шлях файлу
            allFilesPath.push(path.resolve(filePath)); 
                              
      }   
  });  
}
// в параметр передаємо директорію, в якій шукати
// '.' - поточна директорія, де знаходиться файл запуску (даний файл)
getAllFiles(`.`);




// видаляємо файли, які не використовуються
let removeUnusedFiles = () => {
	allFilesPath.forEach((filePath)=>{
		if (allUsedFilesPathObj[filePath]) {
			// fs.unlinkSync(filePath)
			// console.log(`${filePath}\n`);
			console.log(`${filePath} ------- USED`);
			count++;
		}
		console.log(`${filePath} ------- ALL`);
	})
	console.log(count + ` used`);
}
removeUnusedFiles();
// записуємо в файл
    // fs.writeFile("out.html", data,  function(err) {
    //     if(err) {
    //         throw err;
    //     }
    //     console.log("The file was saved!");
    // });