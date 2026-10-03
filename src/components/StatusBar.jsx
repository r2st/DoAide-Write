import { getCharCount, getReadingTime, getWordCount } from '../utils/markdown'

export default function StatusBar({ content }) {
  const words = getWordCount(content)
  const chars = getCharCount(content)
  const readTime = getReadingTime(content)

  return (
    <footer className="flex items-center justify-between h-6 px-3 text-[10px] border-t no-print flex-shrink-0"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)', color: 'var(--color-ink-400)' }}>
      <div className="flex items-center gap-3">
        <span>{words} {words === 1 ? 'word' : 'words'}</span>
        <span>{chars} {chars === 1 ? 'character' : 'characters'}</span>
        <span>{readTime} min read</span>
      </div>
      <div className="flex items-center gap-3">
        <span>Markdown</span>
        <span className="hidden sm:inline">
          <kbd className="px-1 py-0.5 rounded text-[9px]" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>Ctrl</kbd>+<kbd className="px-1 py-0.5 rounded text-[9px]" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>B</kbd> Bold
        </span>
      </div>
    </footer>
  )
}
