import { useState } from 'react'
import { copyToClipboard, downloadFile, getStandaloneHtml, printDocument } from '../utils/export'
import { getEmbedCode, getShareUrl, getTwitterShareUrl, getWhatsAppShareUrl } from '../utils/sharing'

function ToolbarButton({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-colors tooltip ${active ? 'bg-[var(--color-gold-bg)]' : 'hover:bg-[var(--color-surface-hover)]'}`}
      data-tip={label}
      title={label}>
      {icon}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-5 mx-0.5" style={{ background: 'var(--color-border)' }} />
}

export default function Toolbar({
  onInsert, content, activeDoc, previewRef,
  focusMode, onToggleFocus,
  typewriterMode, onToggleTypewriter,
  fullscreenEditor, onToggleFullscreenEditor,
  fullscreenPreview, onToggleFullscreenPreview,
  undoStack, redoStack, onUndo, onRedo,
}) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [copied, setCopied] = useState(null)

  const showCopied = (key) => {
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCopyMarkdown = async () => {
    await copyToClipboard(content)
    showCopied('md')
    setExportMenuOpen(false)
  }

  const handleCopyHtml = async () => {
    const html = previewRef?.current?.innerHTML || ''
    await copyToClipboard(html)
    showCopied('html')
    setExportMenuOpen(false)
  }

  const handleDownloadMd = () => {
    const name = (activeDoc?.name || 'document').replace(/[^\w.-]/g, '_')
    downloadFile(content, `${name}.md`, 'text/markdown')
    setExportMenuOpen(false)
  }

  const handleDownloadHtml = () => {
    const html = previewRef?.current?.innerHTML || ''
    const name = activeDoc?.name || 'Document'
    const standalone = getStandaloneHtml(html, name)
    downloadFile(standalone, `${name.replace(/[^\w.-]/g, '_')}.html`, 'text/html')
    setExportMenuOpen(false)
  }

  const handlePrintPdf = () => {
    printDocument()
    setExportMenuOpen(false)
  }

  const handleShare = async () => {
    const url = getShareUrl(content)
    await copyToClipboard(url)
    showCopied('share')
    setShareMenuOpen(false)
  }

  const handleEmbed = async () => {
    const code = getEmbedCode(content)
    await copyToClipboard(code)
    showCopied('embed')
    setShareMenuOpen(false)
  }

  const icon = (d, w = 15, h = 15) => (
    <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  )

  return (
    <div className="flex items-center gap-0.5 px-2 h-9 border-b overflow-x-auto no-print flex-shrink-0"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}>
      {/* Undo/Redo */}
      <ToolbarButton label="Undo (Ctrl+Z)" onClick={onUndo}
        icon={icon(<path d="M3 7v6h6"/>, 14, 14)} />
      <ToolbarButton label="Redo (Ctrl+Y)" onClick={onRedo}
        icon={icon(<><path d="M21 7v6h-6"/><path d="M21 13a9 9 0 1 0-3-7.7L21 7"/></>, 14, 14)} />
      <ToolbarDivider />

      {/* Text formatting */}
      <ToolbarButton label="Bold (Ctrl+B)" onClick={() => onInsert('**', '**', 'bold')}
        icon={<span className="text-xs font-bold w-[15px] text-center">B</span>} />
      <ToolbarButton label="Italic (Ctrl+I)" onClick={() => onInsert('*', '*', 'italic')}
        icon={<span className="text-xs italic w-[15px] text-center font-serif">I</span>} />
      <ToolbarButton label="Strikethrough (Ctrl+D)" onClick={() => onInsert('~~', '~~', 'strikethrough')}
        icon={<span className="text-xs line-through w-[15px] text-center">S</span>} />
      <ToolbarDivider />

      {/* Headings */}
      <ToolbarButton label="Heading 1" onClick={() => onInsert('\n# ', '', 'Heading')}
        icon={<span className="text-[10px] font-bold w-[15px] text-center">H1</span>} />
      <ToolbarButton label="Heading 2" onClick={() => onInsert('\n## ', '', 'Heading')}
        icon={<span className="text-[10px] font-bold w-[15px] text-center">H2</span>} />
      <ToolbarButton label="Heading 3" onClick={() => onInsert('\n### ', '', 'Heading')}
        icon={<span className="text-[10px] font-bold w-[15px] text-center">H3</span>} />
      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton label="Bullet list" onClick={() => onInsert('\n- ', '', 'item')}
        icon={icon(<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>)} />
      <ToolbarButton label="Numbered list" onClick={() => onInsert('\n1. ', '', 'item')}
        icon={icon(<><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="3" y="7" fontSize="7" fill="currentColor" stroke="none">1.</text><text x="3" y="13" fontSize="7" fill="currentColor" stroke="none">2.</text><text x="3" y="19" fontSize="7" fill="currentColor" stroke="none">3.</text></>)} />
      <ToolbarButton label="Task list" onClick={() => onInsert('\n- [ ] ', '', 'task')}
        icon={icon(<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 12l2 2 4-4"/></>)} />
      <ToolbarDivider />

      {/* Code */}
      <ToolbarButton label="Inline code (Ctrl+E)" onClick={() => onInsert('`', '`', 'code')}
        icon={icon(<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>)} />
      <ToolbarButton label="Code block (Ctrl+Shift+K)" onClick={() => onInsert('\n```\n', '\n```\n', 'code')}
        icon={icon(<><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="10 8 14 12 10 16"/></>)} />
      <ToolbarDivider />

      {/* Link & Image */}
      <ToolbarButton label="Link (Ctrl+K)" onClick={() => onInsert('[', '](url)', 'link text')}
        icon={icon(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>)} />
      <ToolbarButton label="Image" onClick={() => onInsert('![', '](url)', 'alt text')}
        icon={icon(<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>)} />
      <ToolbarDivider />

      {/* Table */}
      <ToolbarButton label="Insert table" onClick={() => onInsert('\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| ', ' | cell | cell |\n', 'cell')}
        icon={icon(<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></>)} />

      {/* Quote & HR */}
      <ToolbarButton label="Quote" onClick={() => onInsert('\n> ', '', 'quote')}
        icon={icon(<><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></>, 14, 14)} />
      <ToolbarButton label="Horizontal rule" onClick={() => onInsert('\n---\n', '', '')}
        icon={icon(<line x1="3" y1="12" x2="21" y2="12"/>)} />
      <ToolbarDivider />

      {/* Modes */}
      <ToolbarButton label="Focus mode" onClick={onToggleFocus} active={focusMode}
        icon={icon(<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></>)} />
      <ToolbarButton label="Typewriter mode" onClick={onToggleTypewriter} active={typewriterMode}
        icon={icon(<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 20h12"/><line x1="6" y1="8" x2="18" y2="8"/></>)} />

      <div className="flex-1" />

      {/* Fullscreen toggles */}
      <ToolbarButton label={fullscreenEditor ? 'Exit editor fullscreen' : 'Editor fullscreen'}
        onClick={onToggleFullscreenEditor} active={fullscreenEditor}
        icon={icon(<><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></>)} />
      <ToolbarButton label={fullscreenPreview ? 'Exit preview fullscreen' : 'Preview fullscreen'}
        onClick={onToggleFullscreenPreview} active={fullscreenPreview}
        icon={icon(<><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></>)} />
      <ToolbarDivider />

      {/* Export */}
      <div className="relative">
        <button onClick={() => { setExportMenuOpen(!exportMenuOpen); setShareMenuOpen(false) }}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium hover:bg-[var(--color-surface-hover)] transition-colors"
          style={{ color: 'var(--color-ink-700)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
        {exportMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 py-1 rounded-lg shadow-lg min-w-[180px]"
              style={{ background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
              <button onClick={handleCopyMarkdown} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors flex items-center gap-2"
                style={{ color: 'var(--color-ink-700)' }}>
                {copied === 'md' ? '✓ Copied!' : 'Copy Markdown'}
              </button>
              <button onClick={handleCopyHtml} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors flex items-center gap-2"
                style={{ color: 'var(--color-ink-700)' }}>
                {copied === 'html' ? '✓ Copied!' : 'Copy HTML'}
              </button>
              <div className="my-1" style={{ borderTop: '1px solid var(--color-border)' }} />
              <button onClick={handleDownloadMd} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors"
                style={{ color: 'var(--color-ink-700)' }}>
                Download .md
              </button>
              <button onClick={handleDownloadHtml} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors"
                style={{ color: 'var(--color-ink-700)' }}>
                Download .html
              </button>
              <button onClick={handlePrintPdf} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors"
                style={{ color: 'var(--color-ink-700)' }}>
                Print / Save as PDF
              </button>
            </div>
          </>
        )}
      </div>

      {/* Share */}
      <div className="relative">
        <button onClick={() => { setShareMenuOpen(!shareMenuOpen); setExportMenuOpen(false) }}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors"
          style={{ background: 'var(--color-gold-bg)', color: 'var(--color-gold)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share
        </button>
        {shareMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShareMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 py-1 rounded-lg shadow-lg min-w-[200px]"
              style={{ background: 'var(--color-paper)', border: '1px solid var(--color-border)' }}>
              <button onClick={handleShare} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors"
                style={{ color: 'var(--color-ink-700)' }}>
                {copied === 'share' ? '✓ Link copied!' : 'Copy share link'}
              </button>
              <button onClick={handleEmbed} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors"
                style={{ color: 'var(--color-ink-700)' }}>
                {copied === 'embed' ? '✓ Copied!' : 'Copy embed code'}
              </button>
              <div className="my-1" style={{ borderTop: '1px solid var(--color-border)' }} />
              <a href={getWhatsAppShareUrl(content)} target="_blank" rel="noopener noreferrer"
                className="block px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors flex items-center gap-2"
                style={{ color: '#25D366' }}
                onClick={() => setShareMenuOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Share on WhatsApp
              </a>
              <a href={getTwitterShareUrl(content, activeDoc?.name)} target="_blank" rel="noopener noreferrer"
                className="block px-3 py-1.5 text-sm hover:bg-[var(--color-surface-hover)] transition-colors flex items-center gap-2"
                style={{ color: 'var(--color-ink-700)' }}
                onClick={() => setShareMenuOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Share on X
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
