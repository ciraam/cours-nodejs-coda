import * as fs from 'node:fs';

if (!fs.existsSync('test_modules')) {
  fs.mkdirSync('test_modules');
}

fs.writeFileSync('test_modules/nouveau.txt', 'Hello, World !');

const contenu = fs.readFileSync('test_modules/nouveau.txt', 'utf-8');
console.log(contenu);

fs.appendFileSync('test_modules/nouveau.txt', '\nEncore du texte.');

// fs.unlinkSync('test_modules/nouveau.txt');
