import express from 'express';
import { logger } from './logger';
const app = express();
app.use(express.json());

interface Contact {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    address: string;
}

const contacts: Contact[] = [
    { id: 1, firstname: 'Léo', lastname: 'Bé', email: 'test@test.fr', address: 'Rue de la Monster' },
    { id: 2, firstname: 'Romaric', lastname: 'Ah', email: 'encore@test.fr', address: 'Rue de la RedBull' }
];

let visitor = 0;
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    logger.info(`New visitor, n°${visitor + 1}`);
    visitor = visitor + 1;
    res.status(200).end('Hello,World!\n\nVoici les endpoints:\n - GET: /api/contacts\n - GET by id: /api/contacts/:id\n - POST: /api/contacts\n - PUT: /api/contacts/:id\n - DELETE: /api/contacts/:id\n\n\n*Pour ":id" remplacer par un id (1 ou 2 de base seulement, si aucun POST de fait avant)\nUn mock est disponible au besoin donc inutile de rajouter un body (mais il est toujours possible de le rajouter)');
});

app.get('/api/contacts', (req, res) => {
    res.json(contacts);
    logger.info('Contacts list retrieved');
});

app.get('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        res.status(200).json(contact);
        logger.info(`Contact with id ${id} retrieved`);
    } else {
        res.status(404).json({ error: 'Contact non trouvé' });
        logger.error(`Contact with id ${id} not found`);
    }
});

app.post('/api/contacts', (req, res) => {
    const { id, firstname, lastname, email, address } = req.body;
    if (contacts.find(c => c.id === id)) {
        res.status(409).json({ error: 'Contact avec cet ID existe déjà' });
        logger.error(`Contact with id ${id} already exists`);
        return;
    }

    if (!firstname || !lastname || !email || !address) {
        res.status(400).json({ error: 'Champs manquants pour le contact' });
        logger.error('Missing fields in contact creation');
        return;
    }
    const newContact = { id, firstname, lastname, email, address };
    contacts.push(newContact);
    res.status(201).json({ message: 'Contact ajouté avec succès', contact: newContact });
    logger.info(`Contact with id ${id} created`);
});

app.put('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = contacts.findIndex(c => c.id === id);

    if (index === -1) {
        res.status(404).json({ error: 'Contact non trouvé' });
        logger.error(`Contact with id ${id} not found for update`);
        return;
    }
    const { firstname, lastname, email, address } = req.body;

    if (
        (firstname && typeof firstname !== 'string') ||
        (lastname && typeof lastname !== 'string') ||
        (email && typeof email !== 'string') ||
        (address && typeof address !== 'string')) {
        res.status(400).json({ error: 'Tous les champs doivent être des chaînes de caractères' });
        logger.error('Bad Request: invalid field type');
        return;
    }
    const updatedContact = { ...contacts[index], ...req.body };
    contacts[index] = updatedContact;

    res.status(200).json({ message: 'Contact modifié avec succès', contact: updatedContact });
    logger.info(`Contact with id ${id} updated`);
});

app.delete('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
        contacts.splice(index, 1);
        res.status(204).send();
        logger.info(`Contact with id ${id} deleted`);
    } else {
        res.status(404).json({ error: 'Contact non trouvé' });
        logger.error(`Contact with id ${id} not found for deletion`);
    }
});

export function startServer(port: number) {
    return new Promise(resolve => {
        const server = app.listen(port, () => {
            console.log(`Serveur Express lancé sur http://localhost:${port}`);
            resolve(server);
        });
    });
}
startServer(3000);
export { app };
