import request from 'supertest'
import { describe, it, expect } from 'vitest'
import server from '../server'

const contacts = [
    {id: 1, firstname: 'Léo', lastname: 'Bé', email: 'test@test.fr', address: 'Rue de la Monster'},
    {id: 2, firstname: 'Romaric', lastname: 'Ah', email: 'encore@test.fr', address: 'Rue de la RedBull'},
];
const newContact = {id: 0, firstname: 'Adibou', lastname: 'Coda', email: 'dora@test.fr', address: 'Rue de la Toison de pierre'}
const updateContact = {id: 2, firstname: 'HTML', lastname: 'CSS', email: 'laptop@test.fr', address: 'Rue de la POO'}

describe('Test API des endpoints ', () => {
  it('GET /api/contacts', async () => {
    const res = await request(server)
    .get('/api/contacts')
    .expect(200)
    expect(res.body[0].firstname).toBe("Léo")
  })
  it('GET on success /api/contacts/:id', async () => {
    const res = await request(server)
    .get(`/api/contacts/${contacts[1].id}`)
    .expect(200)
    expect(res.body.firstname).toBe("Romaric")
  })
  it('GET on failed /api/contacts/:id', async () => {
    const res = await request(server)
    .get(`/api/contacts/${contacts[1].id}`)
    expect(res.body.firstname).toBe("Romaric")
  })
  it('POST /api/contacts', async () => {
    const req = await request(server)
    .post(`/api/contacts`)
    .send(newContact)
    .expect(201)
    expect(req.body).toMatchObject({
      "id": 3,
      "firstname": "Adibou",
      "lastname": "Coda",
      "email": "dora@test.fr",
      "address": "Rue de la Toison de pierre"
    })
  })
  it('PUT /api/contacts/:id', async () => {
    const req = await request(server)
    .put(`/api/contacts/${updateContact.id}`)
    .send(updateContact)
    .expect(201)
    expect(req.body).toMatchObject({
        "id": 2,
        "address": "Rue de la POO",
        "email": "laptop@test.fr",
        "firstname": "HTML",
        "lastname": "CSS",
    })
  })
  it('DELETE /api/contacts/:id', async () => {
    const req = await request(server)
    .delete(`/api/contacts/${contacts[0].id}`)
    .expect(204)
  })
})