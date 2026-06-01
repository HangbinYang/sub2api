import { describe, expect, it } from 'vitest'

import {
  getDateLocale,
  inferLocaleFromClientContext,
  isChineseLocale,
  isTraditionalChineseLocale,
} from '../localeHelpers'

describe('locale inference', () => {
  it('prefers zh-Hant for Taiwan locale tags', () => {
    expect(inferLocaleFromClientContext({ preferredLanguages: ['zh-TW', 'en-US'] })).toBe('zh-Hant')
  })

  it('prefers zh for simplified Chinese locale tags', () => {
    expect(inferLocaleFromClientContext({ preferredLanguages: ['zh-CN', 'en-US'] })).toBe('zh')
  })

  it('uses timezone to infer traditional Chinese when browser language is English', () => {
    expect(
      inferLocaleFromClientContext({
        preferredLanguages: ['en-US'],
        timeZone: 'Asia/Taipei',
      })
    ).toBe('zh-Hant')
  })

  it('uses timezone to infer simplified Chinese when browser language is English', () => {
    expect(
      inferLocaleFromClientContext({
        preferredLanguages: ['en-US'],
        timeZone: 'Asia/Shanghai',
      })
    ).toBe('zh')
  })

  it('falls back to English outside Chinese locales', () => {
    expect(
      inferLocaleFromClientContext({
        preferredLanguages: ['en-US'],
        timeZone: 'America/New_York',
      })
    ).toBe('en')
  })
})

describe('locale helpers', () => {
  it('recognizes Chinese locales', () => {
    expect(isChineseLocale('zh')).toBe(true)
    expect(isChineseLocale('zh-Hant')).toBe(true)
    expect(isChineseLocale('en')).toBe(false)
  })

  it('recognizes traditional Chinese locales', () => {
    expect(isTraditionalChineseLocale('zh-Hant')).toBe(true)
    expect(isTraditionalChineseLocale('zh-TW')).toBe(true)
    expect(isTraditionalChineseLocale('zh')).toBe(false)
  })

  it('maps date locales correctly', () => {
    expect(getDateLocale('zh')).toBe('zh-CN')
    expect(getDateLocale('zh-Hant')).toBe('zh-TW')
    expect(getDateLocale('en')).toBe('en-US')
  })
})
