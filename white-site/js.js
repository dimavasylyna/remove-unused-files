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



let findAllDependence = (file) => {
	// підгружаємо файл, в якому будемо працювати 
	// (обовязково ставити { decodeEntities: false })
	// інакше нелатинські символи будуть в hex unicode
	let $ = cheerio.load(fs.readFileSync(file), { decodeEntities: false });
	
	let getLinks = (selector, attr) => {
		let resultObj = {};
		$(selector).each(function(i, link){
			// ${path.dirname(file)}/ - прибирає зі шляху назву файлу
			// uslugi/index.html => uslugi/
			let filePath = path.resolve(__dirname, `${path.dirname(file)}/`, $(this).attr(attr));
			resultObj[filePath] = true; 
		});
		// повертає обєкт з абсолютними шляхами, типу {path: true}
		return resultObj;
	}


	// знаходимо шляхи всіх ресурсів, які використовуються
	let objStyles = getLinks(`link[rel=stylesheet]`, `href`);
	let objScripts = getLinks(`script[src]`, `src`);
	let objImg = getLinks(`img[src]`, `src`);
	let favicons = getLinks(`link[rel*=icon]`, `href`);

	// парсимо стилі


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
	console.log(count);
}
removeUnusedFiles();
// записуємо в файл
    // fs.writeFile("out.html", data,  function(err) {
    //     if(err) {
    //         throw err;
    //     }
    //     console.log("The file was saved!");
    // });