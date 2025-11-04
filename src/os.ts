import os from 'os';

async function systemInfo() {
  console.log('Système :', os.type());
  console.log('Plateforme :', os.platform());
  console.log('Architecture :', os.arch());
  console.log('Mémoire totale :', os.totalmem());
  console.log('Mémoire libre :', os.freemem());
  console.log('Répertoire utilisateur :', os.homedir());
}

systemInfo();