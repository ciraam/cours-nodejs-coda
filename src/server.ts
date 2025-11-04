import http from 'http';

const contacts = [
    {id: 1, firstname: 'Léo', lastname: 'Bé', email: 'test@test.fr', address: 'Rue de la Monster'},
    {id: 2, firstname: 'Romaric', lastname: 'Ah', email: 'encore@test.fr', address: 'Rue de la RedBull'},
];
let body = '';

const server = http.createServer((req, res) => {
    const baseUrl = `http://${req.headers.host}${req.url}`;
    const parsedUrl = new URL(baseUrl);
    const params = parsedUrl.searchParams;
    console.log('Nouvelle requête !');
    console.log('URL demandée :', req.url);

  try {
    if(req.url === '/') {
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bonjour depuis Node.js !');
        res.statusCode = 200;

    } else if(req.url === '/api/contacts' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(contacts));
        res.statusCode = 200;

    } else if(req.url === '/api/contacts' && req.method === 'POST') {
        let body2 = '';
        res.setHeader('Content-Type', 'application/json');
        req.on('data', chunk => {
            body2 += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body2);
                contacts.push(data);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Contact ajouté avec succès', contact: data }));
                
            } catch (err) {
                console.error('Erreur JSON: ', err);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 400;
                res.end(JSON.stringify({error: 'Corps de requête invalide. Envoie du JSON attendu'}));
                
            }
        });
        
    } else if(req.method === 'GET' && req.url=== `/api/contacts?id=${params.get('id')}`) {
        const id = params.get('id'); 
        res.setHeader('Content-Type', 'application/json');
        const result = contacts.find(c => c.id === Number(id));

        if(result) {
            res.statusCode = 200;
            res.end(JSON.stringify(contacts.find(c => c.id === Number(id))));
            
        } else {
            res.statusCode = 400;
            res.end(JSON.stringify({error: 'Contact introuvable, id: '+ id}));
        } 

    } else {
        res.setHeader('Content-Type', 'text/plain');
        res.end('URL non-authorisée !');
        res.statusCode = 401;
    }
  } catch(err) {
    console.log("Méthode non authorisée: " + err);
  }
});

server.listen(3001, () => {
  console.log('Serveur lancé sur http://localhost:3001');
});