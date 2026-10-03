# DoAide Write

Free online Markdown editor with live preview at [write.doaide.com](https://write.doaide.com).

## Features

- Split-pane editor with live preview
- Full CommonMark + GitHub Flavored Markdown
- Syntax highlighting (highlight.js)
- Math equations (KaTeX)
- Mermaid diagrams
- Multiple documents with localStorage persistence
- Export: Markdown, HTML, PDF
- Share via URL (content encoded in hash — no backend)
- Light/dark themes, multiple preview themes
- Focus mode, typewriter mode
- Word count, reading time, table of contents
- Mobile responsive

## Tech Stack

- React 19 + Vite
- Tailwind CSS 3.4
- react-markdown + remark-gfm + remark-math
- rehype-katex + rehype-highlight
- Mermaid (lazy-loaded)
- lz-string (URL compression)

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

Serve with:

```bash
npx serve dist -l tcp://172.18.0.1:3057 -s
```

systemd service file: `deploy/doaide-write-web.service`

## Architecture

Frontend-only (no backend). All documents are saved in localStorage.
Sharing works by encoding content in the URL hash using lz-string compression.

## License

Proprietary — DoAide
