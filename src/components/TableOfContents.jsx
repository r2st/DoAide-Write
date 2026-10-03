import { getHeadings } from '../utils/markdown'

export default function TableOfContents({ content, onClose }) {
  const headings = getHeadings(content)

  return (
    <div className="w-56 flex-shrink-0 border-l h-full overflow-hidden flex flex-col"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}>
      <div className="flex items-center justify-between px-3 h-10 border-b flex-shrink-0"
        style={{ borderColor: 'var(--color-border)' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-ink-400)' }}>
          Contents
        </span>
        <button onClick={onClose}
          className="p-1 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
          title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {headings.length === 0 ? (
          <p className="px-3 text-xs" style={{ color: 'var(--color-ink-400)' }}>
            No headings found. Add headings with # syntax.
          </p>
        ) : (
          headings.map((h, i) => (
            <a key={i}
              href={`#${h.id}`}
              className="block px-3 py-1 text-xs hover:bg-[var(--color-surface-hover)] transition-colors truncate"
              style={{
                paddingLeft: `${(h.level - 1) * 12 + 12}px`,
                color: h.level === 1 ? 'var(--color-ink-900)' : 'var(--color-ink-500)',
                fontWeight: h.level <= 2 ? 500 : 400,
              }}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(h.id)
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}>
              {h.text}
            </a>
          ))
        )}
      </div>
    </div>
  )
}
