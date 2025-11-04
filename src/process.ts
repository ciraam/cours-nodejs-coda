async function processExample() {
  console.log('Arguments :', process.argv);
  console.log('Version Node :', process.version);
  console.log('Variables d\'environnement :', process.env.NODE_ENV);

  if (!process.env.NODE_ENV) {
    console.warn('NODE_ENV non défini, utilisation par défaut');
    console.warn('Sortie du programme...');
    process.exit(0);
  } else {
    console.warn('Suite du programme...');
    setTimeout(() => process.exit(0), 2000);
  }
}

processExample();