import { forwardRef, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { processEmoji } from '../utils/markdown'
import MermaidBlock from './MermaidBlock'

import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

function CodeBlock({ children, className, node, ...props }) {
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : null

  if (language === 'mermaid') {
    return <MermaidBlock chart={String(children).trim()} />
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

const Preview = forwardRef(function Preview({ content, previewTheme }, ref) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') ref(containerRef.current)
      else ref.current = containerRef.current
    }
  }, [ref])

  const processed = processEmoji(content || '')

  return (
    <div className={`preview-pane h-full preview-theme-${previewTheme}`}>
      <div ref={containerRef}
        className="prose prose-sm dark:prose-invert max-w-none
          prose-headings:font-semibold
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
          prose-p:leading-relaxed
          prose-a:no-underline hover:prose-a:underline
          prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900
          prose-code:before:content-none prose-code:after:content-none
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-img:rounded-lg">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
          components={{
            code: CodeBlock,
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
            input: ({ node, ...props }) => (
              <input {...props} disabled={false} />
            ),
          }}>
          {processed}
        </ReactMarkdown>
      </div>
    </div>
  )
})

export default Preview
