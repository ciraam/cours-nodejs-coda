import { promises as fs } from 'fs';
import path from 'path';
const fileName = 'nouveau.txt';
const folderName = 'test_modules';
const pathFile = path.join(folderName, fileName);
async function finalTest() {
    try {
        if (!fs.access(folderName)) {
            fs.mkdir('test_modules');
        }
        else {
            console.warn('Info: Dossier déjà existant');
        }
        // Await
        try {
            await fs.access(pathFile);
            await fs.appendFile(pathFile, '\n----------------------');
            await fs.appendFile(pathFile, '\n>>> Suite du fichier');
        }
        catch (err) {
            await fs.writeFile(pathFile, 'Hello, World!');
        }
        // Promises
        fs.stat(pathFile)
            .then(statFile => {
            return fs.appendFile(pathFile, '\nLe fichier: "' + fileName + '" fait ' + statFile.size + ' octets'),
                fs.appendFile(pathFile, '\nFichier de lancement: ' + process.argv[1]);
        })
            .catch((err) => {
            console.log('\nInfo: ' + err);
        });
        // Promises
        fs.readFile(pathFile, 'utf-8')
            .then(data => console.log(data))
            .catch(err => console.error('Erreur promises:', err));
        // Await
        await fs.unlink(pathFile);
        console.log('Info: Fichier ("' + pathFile + '") est supprimé');
    }
    catch (err) {
        console.error('Erreur async/await:', err);
    }
}
finalTest();
