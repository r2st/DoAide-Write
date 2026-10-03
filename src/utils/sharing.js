import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

export function encodeContent(content) {
  return compressToEncodedURIComponent(content)
}

export function decodeContent(encoded) {
  try {
    return decompressFromEncodedURIComponent(encoded)
  } catch {
    return null
  }
}

export function getShareUrl(content) {
  const encoded = encodeContent(content)
  return `${window.location.origin}${window.location.pathname}#doc=${encoded}`
}

export function getSharedContent() {
  const hash = window.location.hash
  if (!hash || !hash.startsWith('#doc=')) return null
  const encoded = hash.slice(5)
  return decodeContent(encoded)
}

export function getEmbedCode(content) {
  const url = getShareUrl(content)
  return `<iframe src="${url}&embed=1" width="100%" height="600" frameborder="0" style="border:1px solid #e5e7eb;border-radius:8px;"></iframe>`
}

export function getWhatsAppShareUrl(content) {
  const url = getShareUrl(content)
  return `https://wa.me/?text=${encodeURIComponent(`Check out this document: ${url}`)}`
}

export function getTwitterShareUrl(content, title = 'My Document') {
  const url = getShareUrl(content)
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} — Written with DoAide Write`)}&url=${encodeURIComponent(url)}`
}
