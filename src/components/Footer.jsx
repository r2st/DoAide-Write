import { Link } from 'react-router-dom'
import { tools } from '../data/tools'

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-baseline gap-0.5 mb-3">
              <span className="text-lg font-semibold" style={{ color: 'var(--color-ink-900)' }}>DoAide</span>
              <span className="text-lg font-display italic" style={{ color: 'var(--color-gold)' }}>Write</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-500)' }}>
              Free writing tools for everyone. No login required, no data stored on servers.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-ink-400)' }}>
              Product
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/editor" className="text-sm no-underline" style={{ color: 'var(--color-ink-700)' }}>Markdown Editor</Link>
              <Link to="/blog" className="text-sm no-underline" style={{ color: 'var(--color-ink-700)' }}>Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-ink-400)' }}>
              Free Tools
            </h4>
            <div className="flex flex-col gap-2">
              {tools.map(tool => (
                <Link key={tool.slug} to={`/tools/${tool.slug}`}
                  className="text-sm no-underline" style={{ color: 'var(--color-ink-700)' }}>
                  {tool.shortName}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-ink-400)' }}>
              Company
            </h4>
            <div className="flex flex-col gap-2">
              <a href="https://doaide.com" target="_blank" rel="noopener noreferrer"
                className="text-sm no-underline" style={{ color: 'var(--color-ink-700)' }}>DoAide</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-ink-400)' }}>
            &copy; {new Date().getFullYear()} DoAide. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--color-ink-400)' }}>
            Made with care by the <a href="https://doaide.com" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--color-gold)' }}>DoAide</a> team
          </p>
        </div>
      </div>
    </footer>
  )
}
