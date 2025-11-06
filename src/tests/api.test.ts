import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../server'
import request from 'supertest'
let serverTest: any
const port: number = 3002
const user_id: number = 1
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

describe('API /api/contacts (serveur natif)', () => {

  beforeAll(async () => {
    serverTest = app // attend que le serveur écoute
  })

  it('GET /api/contacts', async () => {
    const res = await request(serverTest)
      .get('/api/contacts')
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(contacts);
      });
  })
  

  it('GET by id /api/contacts/:id', async () => {
    const res = await request(serverTest)
      .get(`/api/contacts/${user_id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, firstname: 'Léo', lastname: 'Bé', email: 'test@test.fr', address: 'Rue de la Monster' });
  })

  it('GET /api/contacts/9999 not found', async () => {
    const res = await request(serverTest)
      .get('/api/contacts/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Contact non trouvé' });
  });

  it('POST /api/contacts', async () => {
    const newContact: Contact = {
      id: 3,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@test.fr",
      address: "42 rue de Coda"
    }
    const res = await request(serverTest)
      .post('/api/contacts')
      .send(newContact);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      message: 'Contact ajouté avec succès',
      contact: newContact
    });
  });
  it('POST /api/contacts/1 duplicate id', async () => {
    const duplicateContact: Contact = {
      id: 1,
      firstname: 'Léo',
      lastname: 'Bé',
      email: 'test@test.fr',
      address: 'Rue de la Monster'
    }
    const res = await request(serverTest)
      .post('/api/contacts')
      .send(duplicateContact);
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'Contact avec cet ID existe déjà' });
  });

  it('POST /api/contacts missing fields', async () => {
    const incompleteContact: Contact = {
      id: 4,
      firstname: "Jane",
      lastname: "",
      email: "jane.doe@test.fr",
      address: "42 rue de Coda"
    }
    const res = await request(serverTest)
      .post('/api/contacts')
      .send(incompleteContact);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Champs manquants: lastname' });
  });

  it('PUT /api/contacts/:id', async () => {
    const updateContact = {
      id: user_id,
      firstname: "Adibou",
      lastname: "Damdamdéo",
      email: "john.doe@test.fr",
      address: "42 rue de Coda"
    }
    const expectContact = {
      "contact": {
        "id": user_id,
        "address": "42 rue de Coda",
        "email": "john.doe@test.fr",
        "firstname": "Adibou",
        "lastname": "Damdamdéo",
      },
      "message": "Contact modifié avec succès",
    }
    const req = await request(serverTest)
      .put(`/api/contacts/${user_id}`)
      .send(updateContact);
    expect(req.status).toBe(201);
    expect(req.body).toMatchObject(expectContact);
  })

  it('DELETE by id /api/contacts/:id', async () => {
    const res = await request(serverTest).delete(`/api/contacts/${user_id}`);
    expect(res.status).toBe(204);
  });

  it('DELETE by id /api/contacts/9999 not found', async () => {
    const res = await request(serverTest).delete('/api/contacts/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Contact non trouvé' });
  });
})