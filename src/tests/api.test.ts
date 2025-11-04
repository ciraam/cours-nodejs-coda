import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { startServer } from '../server'

let server: any
let user_id: number

describe('Test des endpoints', () => {

  beforeAll(() => {
    server = startServer(3001)
    user_id = 1
    console.log('Serveur démarré sur le port 3001')
  })

  afterAll(() => {
    server.close()
    console.log('Serveur arrêté')
  })

  it('GET / retourne "Bonjour depuis Node.js !"', async () => {
    const res = await fetch('http://localhost:3001/')
    const text = await res.text()
    expect(text).toBe('Bonjour depuis Node.js !')
  })
  it('GET /api/contacts retourne la liste des contacts', async () => {
    const res = await fetch('http://localhost:3001/api/contacts')
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })
})
