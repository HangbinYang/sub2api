import { createI18n } from 'vue-i18n'
import {
  inferLocaleFromClientContext,
  isLocaleCode,
  type LocaleCode
} from './localeHelpers'

type LocaleMessages = Record<string, any>

const LOCALE_KEY = 'sub2api_locale'
const DEFAULT_LOCALE: LocaleCode = 'en'

const localeLoaders: Record<LocaleCode, () => Promise<{ default: LocaleMessages }>> = {
  en: () => import('./locales/en'),
  zh: () => import('./locales/zh'),
  'zh-Hant': () => import('./locales/zh-Hant')
}

function getSavedLocale(): LocaleCode | null {
  if (typeof localStorage === 'undefined') {
    return null
  }

  const saved = localStorage.getItem(LOCALE_KEY)
  if (saved && isLocaleCode(saved)) {
    return saved
  }

  return null
}

function getNavigatorPreferredLanguages(): string[] {
  if (typeof navigator === 'undefined') {
    return []
  }

  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    return navigator.languages.filter((language): language is string => typeof language === 'string' && language.length > 0)
  }

  if (typeof navigator.language === 'string' && navigator.language.length > 0) {
    return [navigator.language]
  }

  return []
}

function getBrowserTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return undefined
  }
}

function getDefaultLocale(): LocaleCode {
  const saved = getSavedLocale()
  if (saved) {
    return saved
  }

  return inferLocaleFromClientContext({
    preferredLanguages: getNavigatorPreferredLanguages(),
    timeZone: getBrowserTimeZone()
  })
}

export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {},
  // 禁用 HTML 消息警告 - 引导步骤使用富文本内容（driver.js 支持 HTML）
  // 这些内容是内部定义的，不存在 XSS 风险
  warnHtmlMessage: false
})

const loadedLocales = new Set<LocaleCode>()

export async function loadLocaleMessages(locale: LocaleCode): Promise<void> {
  if (loadedLocales.has(locale)) {
    return
  }

  const loader = localeLoaders[locale]
  const module = await loader()
  i18n.global.setLocaleMessage(locale, module.default)
  loadedLocales.add(locale)
}

export async function initI18n(): Promise<void> {
  const current = getLocale()
  await loadLocaleMessages(current)
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', current)
  }
}

export async function setLocale(locale: string): Promise<void> {
  if (!isLocaleCode(locale)) {
    return
  }

  await loadLocaleMessages(locale)
  i18n.global.locale.value = locale
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCALE_KEY, locale)
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', locale)
  }

  // 同步更新浏览器页签标题，使其跟随语言切换
  const { resolveRouteDocumentTitle } = await import('@/router/title')
  const { default: router } = await import('@/router')
  const { useAppStore } = await import('@/stores/app')
  const { useAuthStore } = await import('@/stores/auth')
  const { useAdminSettingsStore } = await import('@/stores/adminSettings')
  const route = router.currentRoute.value
  const appStore = useAppStore()
  const authStore = useAuthStore()
  const adminSettingsStore = useAdminSettingsStore()
  const customMenuItems = [
    ...(appStore.cachedPublicSettings?.custom_menu_items ?? []),
    ...(authStore.isAdmin ? adminSettingsStore.customMenuItems : []),
  ]
  document.title = resolveRouteDocumentTitle(route, appStore.siteName, customMenuItems)
}

export function getLocale(): LocaleCode {
  const current = i18n.global.locale.value
  return isLocaleCode(current) ? current : DEFAULT_LOCALE
}

export const availableLocales = [
  { code: 'en', name: 'English', shortLabel: 'EN' },
  { code: 'zh', name: '简体中文', shortLabel: '简中' },
  { code: 'zh-Hant', name: '繁體中文', shortLabel: '繁中' }
] as const

export {
  getDateLocale,
  inferLocaleFromClientContext,
  isChineseLocale,
  isTraditionalChineseLocale
} from './localeHelpers'
export type { LocaleCode } from './localeHelpers'

export default i18n
