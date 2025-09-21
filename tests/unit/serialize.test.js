import { toSerializable, reviveDates } from '@/lib/serialize'

describe('serialize helpers', () => {
  test('converts Date to ISO string', () => {
    const d = new Date('2023-05-01T12:34:56.000Z')
    const input = { createdAt: d }
    const out = toSerializable(input)
    expect(typeof out.createdAt).toBe('string')
    expect(out.createdAt).toBe('2023-05-01T12:34:56.000Z')
  })

  test('handles nested structures', () => {
    const input = {
      list: [
        { when: new Date('2024-01-01T00:00:00.000Z') },
        { when: new Date('2024-01-02T00:00:00.000Z') },
      ],
      meta: {
        startDate: new Date('2024-01-03T00:00:00.000Z'),
      },
    }
    const out = toSerializable(input)
    expect(out.list[0].when).toBe('2024-01-01T00:00:00.000Z')
    expect(out.list[1].when).toBe('2024-01-02T00:00:00.000Z')
    expect(out.meta.startDate).toBe('2024-01-03T00:00:00.000Z')
  })

  test('throws on Map/Set/Function by default', () => {
    expect(() => toSerializable({ m: new Map() })).toThrow()
    expect(() => toSerializable({ s: new Set() })).toThrow()
    expect(() => toSerializable({ f: () => {} })).toThrow()
  })

  test('reviveDates turns ISO back to Date for keys ending with At/Date', () => {
    const input = {
      createdAt: '2023-01-01T10:00:00.000Z',
      updatedAt: '2023-02-01T10:00:00.000Z',
      startDate: '2023-03-01T10:00:00.000Z',
      plain: '2023-04-01',
    }
    const out = reviveDates(input)
    expect(out.createdAt instanceof Date).toBe(true)
    expect(out.updatedAt instanceof Date).toBe(true)
    expect(out.startDate instanceof Date).toBe(true)
    expect(typeof out.plain).toBe('string')
  })
})

