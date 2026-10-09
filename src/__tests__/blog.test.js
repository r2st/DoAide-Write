import { describe, expect, it } from 'vitest'
import { blogPosts, getBlogBySlug } from '../data/blog'

describe('blog data', () => {
  it('has 3 blog posts', () => {
    expect(blogPosts).toHaveLength(3)
  })

  it('each post has required fields', () => {
    for (const post of blogPosts) {
      expect(post.slug).toBeTruthy()
      expect(post.title).toBeTruthy()
      expect(post.description).toBeTruthy()
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(post.readTime).toBeTruthy()
      expect(post.author).toBeTruthy()
      expect(post.content.length).toBeGreaterThan(100)
    }
  })

  it('getBlogBySlug returns correct post', () => {
    const post = getBlogBySlug('markdown-writing-tips')
    expect(post).toBeTruthy()
    expect(post.title).toContain('Markdown')
  })

  it('getBlogBySlug returns undefined for unknown slug', () => {
    expect(getBlogBySlug('nonexistent')).toBeUndefined()
  })

  it('all slugs are unique', () => {
    const slugs = blogPosts.map(p => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('posts contain markdown content with headings', () => {
    for (const post of blogPosts) {
      expect(post.content).toContain('##')
    }
  })
})
