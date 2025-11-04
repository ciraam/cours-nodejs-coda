import path from 'path';

const dossier = '/utilisateurs/alice/docs';
const fichier = 'note.txt';

const cheminComplet = path.join(dossier, fichier);
console.log('Chemin complet :', cheminComplet);
console.log('Nom du fichier :', path.basename(cheminComplet));
console.log('Extension :', path.extname(cheminComplet));