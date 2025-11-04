import { describe, it, expect } from 'vitest'

// Fonction à tester
function addition(a: number, b: number) {
  return a + b
}

describe('addition', () => {
  it('additionne deux nombres', () => {
    expect(addition(2, 3)).toBe(5)
  })
})