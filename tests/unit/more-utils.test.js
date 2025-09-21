import { generateSlug, validateEmail } from '@/lib/utils'

describe('misc utils', () => {
  test('generateSlug', () => {
    expect(generateSlug('Hello World!')).toBe('hello-world')
    expect(generateSlug('  Spaces  and  symbols ** ')).toMatch(/spaces-and-symbols/)
  })

  test('validateEmail', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('not-an-email')).toBe(false)
  })
})

