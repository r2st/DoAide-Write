import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { insertText } from '../utils/markdown'

const Editor = forwardRef(function Editor({ content, onChange, focusMode, typewriterMode }, ref) {
  const textareaRef = useRef(null)
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const lastContent = useRef(content)

  useImperativeHandle(ref, () => ({
    get textarea() { return textareaRef.current },
    insert(before, after, defaultText) {
      const textarea = textareaRef.current
      if (!textarea) return
      textarea.focus()
      const { newText, cursorPos } = insertText(textarea, before, after, defaultText)
      pushUndo(textarea.value)
      onChange(newText)
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorPos
      })
    },
    undo() {
      if (undoStack.length === 0) return
      const prev = undoStack[undoStack.length - 1]
      setUndoStack(s => s.slice(0, -1))
      setRedoStack(s => [...s, content])
      onChange(prev)
    },
    redo() {
      if (redoStack.length === 0) return
      const next = redoStack[redoStack.length - 1]
      setRedoStack(s => s.slice(0, -1))
      setUndoStack(s => [...s, content])
      onChange(next)
    },
    get undoStack() { return undoStack },
    get redoStack() { return redoStack },
  }), [undoStack, redoStack, content, onChange])

  const pushUndo = useCallback((value) => {
    setUndoStack(s => {
      const next = [...s, value]
      if (next.length > 100) next.shift()
      return next
    })
    setRedoStack([])
  }, [])

  const handleChange = useCallback((e) => {
    const value = e.target.value
    if (lastContent.current !== value) {
      pushUndo(lastContent.current)
      lastContent.current = value
    }
    onChange(value)
  }, [onChange, pushUndo])

  useEffect(() => {
    lastContent.current = content
  }, [content])

  const handleInsert = useCallback((before, after, defaultText) => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.focus()
    const { newText, cursorPos } = insertText(textarea, before, after, defaultText)
    pushUndo(textarea.value)
    onChange(newText)
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = cursorPos
    })
  }, [onChange, pushUndo])

  useKeyboardShortcuts(textareaRef, handleInsert)

  useEffect(() => {
    const handleUndoRedo = (e) => {
      if (document.activeElement !== textareaRef.current) return
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        ref.current?.undo()
      } else if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        ref.current?.redo()
      }
    }
    document.addEventListener('keydown', handleUndoRedo)
    return () => document.removeEventListener('keydown', handleUndoRedo)
  }, [ref])

  return (
    <div className={`h-full overflow-hidden ${focusMode ? 'focus-mode' : ''} ${typewriterMode ? 'typewriter-mode' : ''}`}>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        className="editor-textarea"
        placeholder="Start writing Markdown..."
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  )
})

export default Editor
