import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { startServer } from '../server'

let server: any
let user_id: number

describe('Test des endpoints', () => {

  beforeAll(() => {
    server = startServer(3000)
    user_id = 1
    console.log('Serveur démarré sur le port 3000')
  })

  afterAll(() => {
    server.close()
    console.log('Serveur arrêté')
  })

  it('GET /ping retourne "pong"', async () => {
    const res = await fetch('http://localhost:3000/ping')
    const text = await res.text()
    expect(text).toBe('pong')
  })
})
