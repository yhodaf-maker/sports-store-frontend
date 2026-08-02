import { afterEach, describe, expect, it, vi } from 'vitest'

import { apiFetch } from '../src/api'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apiFetch', () => {
  it('adds the API prefix and authorization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ id: 42 }),
    })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('test-token'),
    })

    await expect(apiFetch('/products')).resolves.toEqual({ id: 42 })
    expect(fetchMock).toHaveBeenCalledWith('/api/products', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    })
  })

  it('throws the API error detail with response metadata', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ detail: 'Invalid credentials' }),
    }))
    vi.stubGlobal('localStorage', { getItem: vi.fn().mockReturnValue(null) })

    const request = apiFetch('/login')
    await expect(request).rejects.toMatchObject({
      message: 'Invalid credentials',
      status: 401,
      body: { detail: 'Invalid credentials' },
    })
  })
})
