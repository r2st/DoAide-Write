import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'doaide-write-docs'
const ACTIVE_KEY = 'doaide-write-active'

const DEFAULT_CONTENT = `# Welcome to DoAide Write

A free, powerful Markdown editor with live preview.

## Features

- **Live Preview** — See your Markdown rendered in real-time
- **GitHub Flavored Markdown** — Tables, task lists, strikethrough
- **Code Highlighting** — Syntax highlighting for 190+ languages
- **Math Equations** — LaTeX math with KaTeX
- **Mermaid Diagrams** — Flowcharts, sequence diagrams, and more
- **Multiple Documents** — Work on several documents at once
- **Export Options** — Download as .md, .html, or PDF
- **Share via URL** — Share documents without any backend

## Quick Start

Try editing this document! Here are some examples:

### Task List

- [x] Write some Markdown
- [x] See it rendered live
- [ ] Share with the world

### Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}! Welcome to DoAide Write.\`;
}
\`\`\`

### Table

| Feature | Status |
|---------|--------|
| Live Preview | ✅ |
| Dark Mode | ✅ |
| Export | ✅ |
| Share | ✅ |

### Math

Inline math: $E = mc^2$

Block math:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

### Mermaid Diagram

\`\`\`mermaid
graph LR
    A[Write Markdown] --> B[Live Preview]
    B --> C[Export / Share]
\`\`\`

---

*Made with ❤️ by [DoAide](https://doaide.com)*
`

export function getDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveDocuments(docs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
  } catch { /* storage full */ }
}

export function getActiveId() {
  try {
    return localStorage.getItem(ACTIVE_KEY) || null
  } catch {
    return null
  }
}

export function saveActiveId(id) {
  try {
    localStorage.setItem(ACTIVE_KEY, id)
  } catch { /* ignore */ }
}

export function createDocument(name = 'Untitled', content = '') {
  return {
    id: uuidv4(),
    name,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export function getDefaultDocuments() {
  const doc = createDocument('Welcome', DEFAULT_CONTENT)
  return [doc]
}
