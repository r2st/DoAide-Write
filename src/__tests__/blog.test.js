import { describe, expect, it } from 'vitest'
import { blogPosts, getBlogBySlug } from '../data/blog'

describe('blog data', () => {
  it('has 6 blog posts', () => {
    expect(blogPosts).toHaveLength(6)
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

  it('new posts have faqs array', () => {
    const postsWithFaqs = blogPosts.filter(p => p.faqs && p.faqs.length > 0)
    expect(postsWithFaqs.length).toBeGreaterThanOrEqual(3)
    for (const post of postsWithFaqs) {
      for (const faq of post.faqs) {
        expect(faq.question).toBeTruthy()
        expect(faq.answer).toBeTruthy()
      }
    }
  })

  it('new blog posts have at least 800 words', () => {
    const newSlugs = ['email-writing-tips-2026', 'how-to-write-business-letter', 'content-writing-for-beginners-india']
    for (const slug of newSlugs) {
      const post = getBlogBySlug(slug)
      expect(post).toBeTruthy()
      const wordCount = post.content.trim().split(/\s+/).length
      expect(wordCount).toBeGreaterThanOrEqual(800)
    }
  })
})
