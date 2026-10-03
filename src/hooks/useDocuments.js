import { useCallback, useEffect, useRef, useState } from 'react'
import { createDocument, getActiveId, getDefaultDocuments, getDocuments, saveActiveId, saveDocuments } from '../utils/storage'

export function useDocuments() {
  const [documents, setDocuments] = useState(() => {
    return getDocuments() || getDefaultDocuments()
  })
  const [activeId, setActiveId] = useState(() => {
    const saved = getActiveId()
    const docs = getDocuments() || getDefaultDocuments()
    if (saved && docs.find(d => d.id === saved)) return saved
    return docs[0]?.id || null
  })
  const saveTimer = useRef(null)

  const activeDoc = documents.find(d => d.id === activeId) || documents[0]

  useEffect(() => {
    saveDocuments(documents)
  }, [documents])

  useEffect(() => {
    if (activeId) saveActiveId(activeId)
  }, [activeId])

  const updateContent = useCallback((content) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      setDocuments(prev => prev.map(d =>
        d.id === activeId ? { ...d, content, updatedAt: Date.now() } : d
      ))
    }, 300)
    setDocuments(prev => prev.map(d =>
      d.id === activeId ? { ...d, content } : d
    ))
  }, [activeId])

  const addDocument = useCallback((name = 'Untitled') => {
    const doc = createDocument(name)
    setDocuments(prev => [...prev, doc])
    setActiveId(doc.id)
    return doc
  }, [])

  const removeDocument = useCallback((id) => {
    setDocuments(prev => {
      const next = prev.filter(d => d.id !== id)
      if (next.length === 0) {
        const doc = createDocument('Untitled')
        setActiveId(doc.id)
        return [doc]
      }
      if (activeId === id) {
        const idx = prev.findIndex(d => d.id === id)
        const newActive = next[Math.min(idx, next.length - 1)]
        setActiveId(newActive.id)
      }
      return next
    })
  }, [activeId])

  const renameDocument = useCallback((id, name) => {
    setDocuments(prev => prev.map(d =>
      d.id === id ? { ...d, name, updatedAt: Date.now() } : d
    ))
  }, [])

  return {
    documents,
    activeDoc,
    activeId,
    setActiveId,
    updateContent,
    addDocument,
    removeDocument,
    renameDocument,
  }
}
