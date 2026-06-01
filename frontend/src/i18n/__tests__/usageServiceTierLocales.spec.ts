import { describe, expect, it } from 'vitest'

import en from '../locales/en'
import zh from '../locales/zh'
import zhHant from '../locales/zh-Hant'

describe('usage service tier locale keys', () => {
  it('contains zh labels for service tier tooltip', () => {
    expect(zh.usage.serviceTier).toBe('服务档位')
    expect(zh.usage.serviceTierPriority).toBe('Fast')
    expect(zh.usage.serviceTierFlex).toBe('Flex')
    expect(zh.usage.serviceTierStandard).toBe('Standard')
  })

  it('contains en labels for service tier tooltip', () => {
    expect(en.usage.serviceTier).toBe('Service tier')
    expect(en.usage.serviceTierPriority).toBe('Fast')
    expect(en.usage.serviceTierFlex).toBe('Flex')
    expect(en.usage.serviceTierStandard).toBe('Standard')
  })

  it('contains zh-Hant labels for service tier tooltip', () => {
    expect(zhHant.usage.serviceTier).toBe('服務檔位')
    expect(zhHant.usage.serviceTierPriority).toBe('Fast')
    expect(zhHant.usage.serviceTierFlex).toBe('Flex')
    expect(zhHant.usage.serviceTierStandard).toBe('Standard')
  })
})
