const namedEntities: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  hellip: '\u2026',
  laquo: '\u00ab',
  ldquo: '\u201c',
  lsquo: '\u2018',
  lt: '<',
  mdash: '\u2014',
  nbsp: ' ',
  ndash: '\u2013',
  quot: '"',
  raquo: '\u00bb',
  rdquo: '\u201d',
  rsquo: '\u2019',
}

function decodeHtmlEntities(value: string) {
  const decodeCodePoint = (raw: string, radix: number, fallback: string) => {
    const codePoint = Number.parseInt(raw, radix)
    return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : fallback
  }

  return value
    .replace(/&#(\d+);?/g, (match, code) => decodeCodePoint(code, 10, match))
    .replace(/&#x([\da-f]+);?/gi, (match, code) => decodeCodePoint(code, 16, match))
    .replace(/&([a-z]+);/gi, (match, name) => namedEntities[String(name).toLowerCase()] ?? match)
}

/** Convert CMS-authored HTML fragments into safe, readable card and summary text. */
export function toPlainText(value: unknown) {
  if (typeof value !== 'string') return ''

  const withoutMarkup = value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/p\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')

  return decodeHtmlEntities(withoutMarkup).replace(/\s+/g, ' ').trim()
}

export function truncatePlainText(value: unknown, limit: number) {
  const clean = toPlainText(value)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}
