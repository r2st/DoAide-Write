import { useState } from 'react'

export default function Sidebar({ documents, activeId, onSelect, onAdd, onRemove, onRename }) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const startRename = (doc) => {
    setEditingId(doc.id)
    setEditName(doc.name)
  }

  const finishRename = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim())
    }
    setEditingId(null)
  }

  const sorted = [...documents].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col border-r h-full overflow-hidden"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}>
      <div className="flex items-center justify-between px-3 h-10 border-b flex-shrink-0"
        style={{ borderColor: 'var(--color-border)' }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-ink-400)' }}>
          Documents
        </span>
        <button onClick={() => onAdd()}
          className="p-1 rounded hover:bg-[var(--color-surface-hover)] transition-colors"
          title="New document">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {sorted.map(doc => (
          <div key={doc.id}
            className={`group flex items-center gap-1 mx-1 px-2 py-1.5 rounded cursor-pointer transition-colors
              ${doc.id === activeId ? 'bg-[var(--color-gold-bg)]' : 'hover:bg-[var(--color-surface-hover)]'}`}
            onClick={() => onSelect(doc.id)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              style={{ color: doc.id === activeId ? 'var(--color-gold)' : 'var(--color-ink-400)', flexShrink: 0 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>

            {editingId === doc.id ? (
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={finishRename}
                onKeyDown={e => { if (e.key === 'Enter') finishRename(); if (e.key === 'Escape') setEditingId(null) }}
                className="flex-1 text-xs bg-transparent outline-none border-b min-w-0"
                style={{ borderColor: 'var(--color-gold)', color: 'var(--color-ink-900)' }}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 text-xs truncate"
                style={{ color: doc.id === activeId ? 'var(--color-gold)' : 'var(--color-ink-700)' }}
                onDoubleClick={(e) => { e.stopPropagation(); startRename(doc) }}>
                {doc.name}
              </span>
            )}

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); startRename(doc) }}
                className="p-0.5 rounded hover:bg-[var(--color-surface-hover)]"
                title="Rename">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
              </button>
              {documents.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); onRemove(doc.id) }}
                  className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                  title="Delete">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 border-t text-center" style={{ borderColor: 'var(--color-border)' }}>
        <a href="https://doaide.com" target="_blank" rel="noopener noreferrer"
          className="text-[10px] hover:underline" style={{ color: 'var(--color-ink-400)' }}>
          doaide.com
        </a>
      </div>
    </aside>
  )
}
