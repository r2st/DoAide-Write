import { describe, expect, it } from 'vitest'
import { getCharCount, getHeadings, getReadingTime, getWordCount, processEmoji } from '../utils/markdown'

describe('getWordCount', () => {
  it('returns 0 for empty text', () => {
    expect(getWordCount('')).toBe(0)
    expect(getWordCount(null)).toBe(0)
    expect(getWordCount('   ')).toBe(0)
  })

  it('counts words correctly', () => {
    expect(getWordCount('Hello world')).toBe(2)
    expect(getWordCount('one two three four')).toBe(4)
  })
})

describe('getCharCount', () => {
  it('returns 0 for empty text', () => {
    expect(getCharCount('')).toBe(0)
    expect(getCharCount(null)).toBe(0)
  })

  it('counts characters correctly', () => {
    expect(getCharCount('Hello')).toBe(5)
    expect(getCharCount('Hello world')).toBe(11)
  })
})

describe('getReadingTime', () => {
  it('returns 1 for short text', () => {
    expect(getReadingTime('Hello')).toBe(1)
  })

  it('calculates time based on 200 wpm', () => {
    const text = Array(400).fill('word').join(' ')
    expect(getReadingTime(text)).toBe(2)
  })
})

describe('getHeadings', () => {
  it('returns empty for no headings', () => {
    expect(getHeadings('Hello world')).toEqual([])
  })

  it('extracts headings with levels', () => {
    const text = '# Title\n## Subtitle\n### Section'
    const headings = getHeadings(text)
    expect(headings).toHaveLength(3)
    expect(headings[0].level).toBe(1)
    expect(headings[0].text).toBe('Title')
    expect(headings[1].level).toBe(2)
    expect(headings[2].level).toBe(3)
  })

  it('ignores headings inside code blocks', () => {
    const text = '# Real Heading\n```\n# Not a heading\n```\n## Another Real'
    const headings = getHeadings(text)
    expect(headings).toHaveLength(2)
  })
})

describe('processEmoji', () => {
  it('replaces known emoji codes', () => {
    expect(processEmoji(':smile:')).toBe('\u{1F604}')
    expect(processEmoji(':fire:')).toBe('\u{1F525}')
    expect(processEmoji(':rocket:')).toBe('\u{1F680}')
  })

  it('leaves unknown codes unchanged', () => {
    expect(processEmoji(':unknown_emoji:')).toBe(':unknown_emoji:')
  })

  it('processes multiple emojis in text', () => {
    const result = processEmoji('Hello :wave: world :heart:')
    expect(result).toContain('\u{1F44B}')
    expect(result).toContain('❤')
  })
})
