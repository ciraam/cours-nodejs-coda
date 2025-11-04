import http from 'http';
const contacts = [
    { id: 1, firstname: 'Léo', lastname: 'Bé', email: 'test@test.fr', address: 'Rue de la Monster' },
    { id: 2, firstname: 'Romaric', lastname: 'Ah', email: 'encore@test.fr', address: 'Rue de la RedBull' },
];
let body = '';
const server = http.createServer((req, res) => {
    console.log('Nouvelle requête !');
    console.log('URL demandée :', req.url);
    try {
        if (req.url === '/') {
            res.setHeader('Content-Type', 'text/plain');
            res.end('Bonjour depuis Node.js !');
            res.statusCode = 200;
        }
        else if (req.url === '/api/contacts' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(contacts.map(b => b)));
            res.statusCode = 200;
        }
        else if (req.url === '/api/contacts' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    contacts.push(data);
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    console.log('body: ' + data);
                    res.end(JSON.stringify({ message: 'Contact ajouté avec succès', contact: data }));
                }
                catch (err) {
                    console.error('Erreur JSON: ', err);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    console.log('non ok');
                    res.end(JSON.stringify({ error: 'Corps de requête invalide. Envoie du JSON attendu.' }));
                }
                console.log('create: ' + contacts);
            });
        }
        else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('URL non-authorisée !');
            res.statusCode = 401;
        }
    }
    catch (err) {
        console.log("Méthode non authorisée: " + err);
    }
});
server.listen(3001, () => {
    console.log('Serveur lancé sur http://localhost:3001');
});
