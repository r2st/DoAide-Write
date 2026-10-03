export function getWordCount(text) {
  if (!text || !text.trim()) return 0
  return text.trim().split(/\s+/).length
}

export function getCharCount(text) {
  return text ? text.length : 0
}

export function getReadingTime(text) {
  const words = getWordCount(text)
  const minutes = Math.ceil(words / 200)
  return minutes
}

export function getHeadings(text) {
  if (!text) return []
  const lines = text.split('\n')
  const headings = []
  let inCodeBlock = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = line.match(/^(#{1,6})\s+(.+)/)
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].replace(/[*_`~\[\]]/g, ''),
        line: i,
        id: match[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      })
    }
  }

  return headings
}

export function processEmoji(text) {
  const emojiMap = {
    ':smile:': '😄', ':laughing:': '😆', ':blush:': '😊', ':heart:': '❤️',
    ':thumbsup:': '👍', ':thumbsdown:': '👎', ':star:': '⭐', ':fire:': '🔥',
    ':check:': '✅', ':x:': '❌', ':warning:': '⚠️', ':bulb:': '💡',
    ':rocket:': '🚀', ':tada:': '🎉', ':eyes:': '👀', ':wave:': '👋',
    ':pray:': '🙏', ':clap:': '👏', ':muscle:': '💪', ':100:': '💯',
    ':sparkles:': '✨', ':zap:': '⚡', ':memo:': '📝', ':book:': '📖',
    ':link:': '🔗', ':lock:': '🔒', ':key:': '🔑', ':gear:': '⚙️',
    ':hammer:': '🔨', ':wrench:': '🔧', ':bug:': '🐛', ':art:': '🎨',
    ':chart_with_upwards_trend:': '📈', ':package:': '📦', ':white_check_mark:': '✅',
    ':heavy_check_mark:': '✔️', ':arrow_right:': '➡️', ':arrow_left:': '⬅️',
    ':point_right:': '👉', ':point_left:': '👈', ':thinking:': '🤔',
    ':+1:': '👍', ':-1:': '👎', ':ok:': '👌', ':coffee:': '☕',
  }

  return text.replace(/:[a-z0-9_+-]+:/g, (match) => emojiMap[match] || match)
}

export function insertText(textarea, before, after = '', defaultText = '') {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end) || defaultText

  const newText = text.substring(0, start) + before + selected + after + text.substring(end)
  const cursorPos = start + before.length + selected.length

  return { newText, cursorPos }
}
