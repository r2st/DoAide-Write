import { useEffect, useRef, useState } from 'react'

let mermaidInit = null

function getMermaid() {
  if (mermaidInit) return mermaidInit
  mermaidInit = import('mermaid').then(m => {
    m.default.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'strict',
    })
    return m.default
  })
  return mermaidInit
}

let renderCounter = 0

export default function MermaidBlock({ chart }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getMermaid().then(async (mermaid) => {
      if (cancelled || !containerRef.current) return
      try {
        const id = `mermaid-${++renderCounter}`
        const { svg } = await mermaid.render(id, chart)
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Invalid diagram')
        }
      }
    })

    return () => { cancelled = true }
  }, [chart])

  if (error) {
    return (
      <div className="p-3 rounded text-xs font-mono" style={{ background: 'var(--color-surface)', color: 'var(--color-ink-500)' }}>
        Mermaid: {error}
      </div>
    )
  }

  return <div ref={containerRef} className="mermaid-wrapper" />
}
