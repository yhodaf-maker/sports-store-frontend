import { describe, expect, it } from 'vitest'

import { getFallbackImage, getProductImage } from '../src/productImages'

describe('product image selection', () => {
  it('prefers a product-provided image URL', () => {
    expect(getProductImage({
      image_url: 'https://example.com/shoe.jpg',
      slug: 'velocity-runner',
      category: 'running-shoes',
    })).toBe('https://example.com/shoe.jpg')
  })

  it('falls back from an unknown product to its category image', () => {
    const categoryImage = getFallbackImage('accessories')

    expect(getProductImage({ slug: 'unknown-product', category: 'accessories' }))
      .toBe(categoryImage)
  })

  it('uses the default image for an unknown category', () => {
    expect(getFallbackImage('unknown-category')).toBe(getFallbackImage('running-shoes'))
  })
})
