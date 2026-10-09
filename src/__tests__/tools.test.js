import { describe, expect, it } from 'vitest'
import { getToolBySlug, tools } from '../data/tools'

describe('tools data', () => {
  it('has 5 tools defined', () => {
    expect(tools).toHaveLength(5)
  })

  it('each tool has required fields', () => {
    for (const tool of tools) {
      expect(tool.slug).toBeTruthy()
      expect(tool.name).toBeTruthy()
      expect(tool.shortName).toBeTruthy()
      expect(tool.description).toBeTruthy()
      expect(tool.metaDescription).toBeTruthy()
      expect(tool.inputLabel).toBeTruthy()
      expect(tool.inputPlaceholder).toBeTruthy()
      expect(tool.buttonLabel).toBeTruthy()
      expect(tool.resultLabel).toBeTruthy()
      expect(typeof tool.maxLength).toBe('number')
      expect(typeof tool.isAI).toBe('boolean')
    }
  })

  it('AI tools have buildPrompt function', () => {
    const aiTools = tools.filter(t => t.isAI)
    expect(aiTools.length).toBe(4)
    for (const tool of aiTools) {
      expect(typeof tool.buildPrompt).toBe('function')
      const prompt = tool.buildPrompt('test topic', 'Professional')
      expect(typeof prompt).toBe('string')
      expect(prompt.length).toBeGreaterThan(0)
    }
  })

  it('readability scorer is not AI', () => {
    const readability = getToolBySlug('readability-scorer')
    expect(readability).toBeTruthy()
    expect(readability.isAI).toBe(false)
  })

  it('getToolBySlug returns correct tool', () => {
    const tool = getToolBySlug('grammar-checker')
    expect(tool).toBeTruthy()
    expect(tool.name).toBe('AI Grammar Checker')
  })

  it('getToolBySlug returns undefined for unknown slug', () => {
    expect(getToolBySlug('nonexistent')).toBeUndefined()
  })

  it('all slugs are unique', () => {
    const slugs = tools.map(t => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('paragraph rewriter has tones', () => {
    const rewriter = getToolBySlug('paragraph-rewriter')
    expect(rewriter.hasToneSelect).toBe(true)
    expect(rewriter.tones.length).toBeGreaterThan(0)
  })
})
