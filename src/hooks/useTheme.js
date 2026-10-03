import { useCallback, useEffect, useState } from 'react'

const THEME_KEY = 'doaide-write-theme'
const PREVIEW_THEME_KEY = 'doaide-write-preview-theme'

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'system'
    } catch {
      return 'system'
    }
  })

  const [previewTheme, setPreviewThemeState] = useState(() => {
    try {
      return localStorage.getItem(PREVIEW_THEME_KEY) || 'github'
    } catch {
      return 'github'
    }
  })

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try { localStorage.setItem(THEME_KEY, theme) } catch { /* ignore */ }
  }, [theme, isDark])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setThemeState('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((t) => {
    setThemeState(t)
  }, [])

  const setPreviewTheme = useCallback((t) => {
    setPreviewThemeState(t)
    try { localStorage.setItem(PREVIEW_THEME_KEY, t) } catch { /* ignore */ }
  }, [])

  return { theme, setTheme, isDark, previewTheme, setPreviewTheme }
}
