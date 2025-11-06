import express from 'express';
import { logger } from './logger';
const app = express();
app.use(express.json());

const contacts = [
    { id: 1, firstname: 'Léo', lastname: 'Bé', email: 'test@test.fr', address: 'Rue de la Monster' },
    { id: 2, firstname: 'Romaric', lastname: 'Ah', email: 'encore@test.fr', address: 'Rue de la RedBull' }
];

app.get('/', (req, res) => {
    res.send("Bonjour depuis Express.js !");
    logger.info('Root endpoint accessed');
});

app.get('/api/contacts', (req, res) => {
    res.json(contacts);
    logger.info('Contacts list retrieved');
});

app.get('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        res.json(contact);
        res.status(200);
        logger.info(`Contact with id ${id} retrieved`);
    } else {
        res.status(404).json({ error: 'Contact non trouvé' });
        logger.error(`Contact with id ${id} not found`);
    }
});

app.post('/api/contacts', (req, res) => {
    const newContact = req.body;
    if (contacts.find(c => c.id === newContact.id)) {
        res.status(409).json({ error: 'Contact avec cet ID existe déjà' });
        logger.error(`Contact with id ${newContact.id} already exists`);
        return;
    }
    contacts.push(newContact);
    res.status(201).json({ message: 'Contact ajouté avec succès', contact: newContact });
    logger.info(`Contact with id ${newContact.id} created`);
});

app.put('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = contacts.findIndex(c => c.id === id);

    if (index !== -1) {
        const updatedContact = { ...contacts[index], ...req.body };
        contacts[index] = updatedContact;
        res.status(201).json({ message: 'Contact modifié avec succès', contact: updatedContact });
        logger.info(`Contact with id ${id} updated`);
    } else {
        res.status(404).json({ error: 'Contact non trouvé' });
        logger.error(`Contact with id ${id} not found for update`);
    }
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