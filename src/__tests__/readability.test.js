import { describe, expect, it } from 'vitest'
import { analyzeReadability } from '../utils/readability'

describe('analyzeReadability', () => {
  it('returns null for empty text', () => {
    expect(analyzeReadability('')).toBeNull()
    expect(analyzeReadability(null)).toBeNull()
    expect(analyzeReadability('  ')).toBeNull()
  })

  it('returns null for text with fewer than 10 words', () => {
    expect(analyzeReadability('Hello world this is short.')).toBeNull()
  })

  it('analyzes simple text correctly', () => {
    const text = 'The cat sat on the mat. The dog ran in the park. It was a sunny day outside today.'
    const result = analyzeReadability(text)

    expect(result).not.toBeNull()
    expect(result.wordCount).toBeGreaterThan(10)
    expect(result.sentenceCount).toBe(3)
    expect(result.fleschEase).toBeGreaterThan(60)
    expect(result.level).toBeTruthy()
    expect(result.color).toBeTruthy()
  })

  it('identifies complex text as harder to read', () => {
    const simple = 'The cat sat on the mat. The dog ran fast. Birds sang in the trees. Fish swam in the lake.'
    const complex = 'The implementation of sophisticated algorithmic methodologies necessitates comprehensive understanding of computational complexity. Furthermore, the utilization of advanced mathematical abstractions facilitates the development of optimized solutions.'

    const simpleResult = analyzeReadability(simple)
    const complexResult = analyzeReadability(complex)

    expect(simpleResult.fleschEase).toBeGreaterThan(complexResult.fleschEase)
    expect(simpleResult.fleschGrade).toBeLessThan(complexResult.fleschGrade)
  })

  it('calculates all metrics', () => {
    const text = 'Writing clear content is important for reaching a wide audience. Short sentences help readers understand your message quickly. Use simple words whenever possible to improve readability scores.'
    const result = analyzeReadability(text)

    expect(result).toHaveProperty('fleschEase')
    expect(result).toHaveProperty('fleschGrade')
    expect(result).toHaveProperty('gunningFog')
    expect(result).toHaveProperty('colemanLiau')
    expect(result).toHaveProperty('ari')
    expect(result).toHaveProperty('avgWordsPerSentence')
    expect(result).toHaveProperty('avgSyllablesPerWord')
    expect(result).toHaveProperty('complexWordPercentage')
  })

  it('assigns correct difficulty levels', () => {
    const veryEasy = 'I like dogs. Dogs are fun. Dogs can run. I play with my dog every day in the park near home.'
    const result = analyzeReadability(veryEasy)
    expect(['Very Easy', 'Easy', 'Standard']).toContain(result.level)
  })
})
