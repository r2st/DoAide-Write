import { Outlet } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import Footer from './Footer'
import NavBar from './NavBar'

export default function Layout() {
  useTheme()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-canvas)', color: 'var(--color-ink-900)' }}>
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
