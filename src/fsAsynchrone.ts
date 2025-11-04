import { promises as fs } from 'fs';

const path = 'test_modules/nouveau.txt';

async function exampleFS() {
  try {
    // Écrire dans un fichier (création ou remplacement)
    await fs.writeFile(path, 'Hello, World Node.js !');

    // Ajouter du texte à la fin
    await fs.appendFile(path, '\nNouvelle ligne ajoutée.');

    // Lire un fichier
    const data = await fs.readFile(path, 'utf-8');
    console.log(data);
    
    // Supprimer un fichier
    await fs.unlink(path);
    console.log('Info: Fichier ("'+ path +'") supprimé');
  } catch (err) {
    console.error('Erreur FS :', err);
  }
}

exampleFS();