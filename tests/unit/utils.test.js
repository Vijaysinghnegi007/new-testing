import { formatPrice, formatDate } from '@/lib/utils'

describe('locale-aware formatting', () => {
  test('formatPrice en-US USD', () => {
    expect(formatPrice(1234.56, 'USD', 'en')).toMatch(/\$1,234\.56/)
  })
  test('formatPrice es-ES EUR', () => {
    const out = formatPrice(1234.56, 'EUR', 'es')
    const norm = out.replace(/\u00a0/g, ' ')
    // Accept optional thousands separator and trailing Euro symbol with optional space
    expect(norm).toMatch(/^(1\.234|1234),56 ?€$/)
  })
  test('formatDate en-US', () => {
    const d = formatDate('2024-01-15', {}, 'en')
    expect(d).toBeTruthy()
  })
  test('formatDate es-ES', () => {
    const d = formatDate('2024-01-15', {}, 'es')
    expect(d).toBeTruthy()
  })
})

