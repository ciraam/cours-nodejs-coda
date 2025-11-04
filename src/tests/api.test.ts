import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { startServer } from '../server'

let serverTest: any
const port: number = 3002
const user_id: number = 1 

describe('API /api/contacts (serveur natif)', () => {

  beforeAll(async () => {
    serverTest = await startServer(port) // attend que le serveur écoute
    console.log('Serveur démarré sur le port'+ port)
  })

  afterAll(() => {
    serverTest.close()
    console.log(`Serveur arrêté`)
  })

  it('GET /api/contacts', async () => {
    const req = await fetch(`http://localhost:${port}/api/contacts`)
    const res = await req.json()
    expect(res).toEqual([
        {id: 1, firstname: 'Léo', lastname: 'Bé', email: 'test@test.fr', address: 'Rue de la Monster'},
        {id: 2, firstname: 'Romaric', lastname: 'Ah', email: 'encore@test.fr', address: 'Rue de la RedBull'},
    ])
  })
  it('GET by id /api/contacts/:id', async () => {
    const req = await fetch(`http://localhost:${port}/api/contacts/${user_id}`)
    const res = await req.json()
    expect(res).toEqual({id: 1, firstname: 'Léo', lastname: 'Bé', email: 'test@test.fr', address: 'Rue de la Monster'})
  })
})

