import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiFetch } from './api'

const storedValues = new Map()

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    clear: () => storedValues.clear(),
    getItem: (key) => storedValues.get(key) ?? null,
    setItem: (key, value) => storedValues.set(key, String(value)),
  })
})

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('apiFetch', () => {
  it('sends the saved token and returns a JSON response', async () => {
    localStorage.setItem('token', 'test-token')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'product-1' }),
    }))

    await expect(apiFetch('/products')).resolves.toEqual({ id: 'product-1' })
    expect(fetch).toHaveBeenCalledWith('/api/products', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
    })
  })
})
