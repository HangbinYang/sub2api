export type LocaleCode = 'en' | 'zh' | 'zh-Hant'

export type ClientLocaleContext = {
  preferredLanguages?: readonly string[]
  timeZone?: string
}

const DEFAULT_LOCALE: LocaleCode = 'en'

function normalizeLocaleTag(value: string): string {
  return value.trim().toLowerCase().replace(/_/g, '-')
}

function extractRegion(tag: string): string | null {
  const parts = normalizeLocaleTag(tag).split('-')
  const region = parts.find((part) => /^[a-z]{2}$/.test(part))
  return region ?? null
}

export function isLocaleCode(value: string): value is LocaleCode {
  return value === 'en' || value === 'zh' || value === 'zh-Hant'
}

export function isTraditionalChineseLocale(value: string): boolean {
  const normalized = normalizeLocaleTag(value)
  return (
    normalized === 'zh-hant' ||
    normalized.startsWith('zh-hant-') ||
    normalized.startsWith('zh-tw') ||
    normalized.startsWith('zh-hk') ||
    normalized.startsWith('zh-mo')
  )
}

export function isChineseLocale(value: string): boolean {
  return normalizeLocaleTag(value).startsWith('zh')
}

export function getDateLocale(value: string): string {
  if (isTraditionalChineseLocale(value)) {
    return 'zh-TW'
  }
  if (isChineseLocale(value)) {
    return 'zh-CN'
  }
  return 'en-US'
}

const traditionalChineseRegions = new Set(['tw', 'hk', 'mo'])
const simplifiedChineseRegions = new Set(['cn', 'sg'])
const traditionalChineseTimeZones = new Set(['asia/taipei', 'asia/hong_kong', 'asia/macau'])
const simplifiedChineseTimeZones = new Set([
  'asia/shanghai',
  'asia/chongqing',
  'asia/harbin',
  'asia/urumqi',
  'asia/singapore'
])

export function inferLocaleFromClientContext({
  preferredLanguages = [],
  timeZone
}: ClientLocaleContext = {}): LocaleCode {
  const normalizedLanguages = preferredLanguages
    .map((language) => normalizeLocaleTag(language))
    .filter(Boolean)

  for (const language of normalizedLanguages) {
    if (isTraditionalChineseLocale(language)) {
      return 'zh-Hant'
    }
    if (language.startsWith('zh-hans') || language.startsWith('zh-cn') || language.startsWith('zh-sg')) {
      return 'zh'
    }
  }

  for (const language of normalizedLanguages) {
    const region = extractRegion(language)
    if (region && traditionalChineseRegions.has(region)) {
      return 'zh-Hant'
    }
    if (region && simplifiedChineseRegions.has(region)) {
      return 'zh'
    }
  }

  const normalizedTimeZone = timeZone ? normalizeLocaleTag(timeZone) : ''
  if (traditionalChineseTimeZones.has(normalizedTimeZone)) {
    return 'zh-Hant'
  }
  if (simplifiedChineseTimeZones.has(normalizedTimeZone)) {
    return 'zh'
  }

  if (normalizedLanguages.some((language) => language.startsWith('zh'))) {
    return 'zh'
  }

  return DEFAULT_LOCALE
}
