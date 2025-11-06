import express from 'express'
import pinoHttp from 'pino-http';
import logger from './logger';

const PORT = 3001
let visitor = 0;
let contacts = [
    {id: 1, firstname: 'Léo', lastname: 'Bé', email: 'test@test.fr', address: 'Rue de la Monster'},
    {id: 2, firstname: 'Romaric', lastname: 'Ah', email: 'encore@test.fr', address: 'Rue de la RedBull'},
];
let newContact = {id: 0, firstname: 'Adibou', lastname: 'Coda', email: 'dora@test.fr', address: 'Rue de la Toison de pierre'}
let updateContact = {id: 2, firstname: 'HTML', lastname: 'CSS', email: 'laptop@test.fr', address: 'Rue de la POO'}

const app = express()

app.use(express.json())
app.use(pinoHttp({
    logger,
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
        if (res.statusCode >= 500 || err) return 'error';
        return 'info';
    },
    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} completed`;
    },
    customErrorMessage: (req, res, err) => {
        return `${req.method} ${req.url} failed: ${err.message}`;
    }
}));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    req.log.info(`New visitor, n°${visitor +1}`);
    visitor = visitor +1;
    res.status(200).end('Hello,World!\n\nVoici les endpoints:\n - GET: /api/contacts\n - GET by id*: /api/contacts/:id\n - POST**: /api/contacts\n - PUT***: /api/contacts/:id\n - DELETE**: /api/contacts/:id\n\n\n*Pour ":id" remplacer par un id (1 ou 2 de base seulement, si aucun POST de fait avant)\n**Un mock est disponible au besoin donc inutile de rajouter un body (mais il est toujours possible de le rajouter)');
});

app.get('/api/contacts', (req, res) => {
    try {
        req.log.info(`Fetching contacts, length: ${contacts.length}`);
        res.status(200).json(contacts);
    } catch (err) {
        req.log.error(err, 'Erreur lors de la récupération des contacts');
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.get('/api/contacts/:id', (req, res) => {
  try {
    const id = Number(req.params.id)
    if(req.method !== "GET") {
        req.log.error({ error: `Mauvaise méthode HTTP, method: ${req.method}` });
        return res.status(405).json({ error: `Mauvaise méthode HTTP, method: ${req.method}` })
    }
    const contact = contacts.find(c => c.id === id)
    if (!contact) {
        req.log.error({ error: `Contact introuvable, id: ${id}` });
        return res.status(404).json({ error: `Contact introuvable, id: ${id}` })
    }
    req.log.info(`Fetching contact, contact: ${contact.email}`);
    res.status(200).json(contact)
  } catch (error) {
    req.log.error({ error: 'Erreur interne du serveur'});
    res.status(500).json({ error: 'Erreur interne du serveur' })
  }
})

app.post('/api/contacts', (req, res) => {
    try {
        if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.address) {
            req.log.error({ error: `Champs manquants` });
            return res.status(400).json({ error: `Champs manquants` })
        }
        if(req.method !== "POST") {
            req.log.error({ error: `Mauvaise méthode HTTP, method: ${req.method}` });
            return res.status(405).json({ error: `Mauvaise méthode HTTP, method: ${req.method}` })
        }
        const isFind = contacts.find(c => c.email === req.body.email);
        if (isFind) { 
            req.log.error({ error: `Email déjà utilisé` });
            return res.status(409).json({ error: `Email déjà utilisé` })
        }
        req.body ? newContact = req.body : '';
        newContact.id = contacts.length + 1
        contacts.push(newContact)
        req.log.info({ contact : isFind }, 'New contact');
        res.status(201).json(newContact)
    } catch(error) {
        req.log.error({ error: 'Erreur interne du serveur' });
        res.status(500).json({ error: 'Erreur interne du serveur' })
    }
})

app.put('/api/contacts/:id', (req, res) => {
    try {
        if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.address) {
            req.log.error({ error: `Champs manquants` });
            return res.status(400).json({ error: `Champs manquants` })
        }
        if(req.method !== "PUT") {
            req.log.error({ error: `Mauvaise méthode HTTP, method: ${req.method}` });
            return res.status(405).json({ error: `Mauvaise méthode HTTP, method: ${req.method}` })
        }
        updateContact = req.body ? updateContact = req.body : updateContact;
        const id = updateContact.id;
        const isFind = contacts.find(c => c.id === id);
        if(!isFind) {
            req.log.error({error : `Contact introuvable, id: ${id}`});
            return res.status(404).json({error : `Contact introuvable, id: ${id}`});
        }
        req.log.info({ contact: updateContact }, 'Update contact');
        res.status(201).json(updateContact);
    } catch(error) {
        req.log.error({ error: 'Erreur interne du serveur' });
        res.status(500).json({ error: 'Erreur interne du serveur' })
    }
})

app.delete('/api/contacts/:id', (req, res) => {
    try {
        if(req.method !== "DELETE") {
            req.log.error({ error: `Mauvaise méthode HTTP, method: ${req.method}` });
            return res.status(405).json({ error: `Mauvaise méthode HTTP, method: ${req.method}` })
        }
        const id = Number(req.params.id);
        const isFind = contacts.find(c => c.id === id);
        if(!isFind) {
            req.log.error({error : `Contact introuvable, id: ${id}`});
            return res.status(404).json({error : `Contact introuvable, id: ${id}`});
        }
        req.log.info({ contact: isFind }, 'Delete contact');
        res.status(204).end()
    } catch(error) {
        req.log.error({ error: 'Erreur interne du serveur' });
        res.status(500).json({ error: 'Erreur interne du serveur' })
    }
})

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})

export default app