import { useEffect } from 'react'

export function useKeyboardShortcuts(editorRef, onInsert) {
  useEffect(() => {
    function handleKeyDown(e) {
      const textarea = editorRef?.current
      if (!textarea) return
      if (document.activeElement !== textarea) return

      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key === 'b') {
        e.preventDefault()
        onInsert('**', '**', 'bold text')
      } else if (mod && e.key === 'i') {
        e.preventDefault()
        onInsert('*', '*', 'italic text')
      } else if (mod && e.key === 'k') {
        e.preventDefault()
        onInsert('[', '](url)', 'link text')
      } else if (mod && e.key === 'd') {
        e.preventDefault()
        onInsert('~~', '~~', 'strikethrough')
      } else if (mod && e.key === 'e') {
        e.preventDefault()
        onInsert('`', '`', 'code')
      } else if (mod && e.shiftKey && e.key === 'K') {
        e.preventDefault()
        onInsert('\n```\n', '\n```\n', 'code block')
      } else if (e.key === 'Tab') {
        e.preventDefault()
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const value = textarea.value

        if (e.shiftKey) {
          const beforeCursor = value.substring(0, start)
          const lastNewline = beforeCursor.lastIndexOf('\n')
          const lineStart = lastNewline + 1
          const lineContent = value.substring(lineStart, start)
          if (lineContent.startsWith('  ')) {
            const newValue = value.substring(0, lineStart) + value.substring(lineStart + 2)
            textarea.value = newValue
            textarea.selectionStart = Math.max(lineStart, start - 2)
            textarea.selectionEnd = Math.max(lineStart, end - 2)
            textarea.dispatchEvent(new Event('input', { bubbles: true }))
          }
        } else {
          const newValue = value.substring(0, start) + '  ' + value.substring(end)
          textarea.value = newValue
          textarea.selectionStart = textarea.selectionEnd = start + 2
          textarea.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editorRef, onInsert])
}
