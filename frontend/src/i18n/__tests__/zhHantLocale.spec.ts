import { describe, expect, it } from 'vitest'

import zhHant from '../locales/zh-Hant'

describe('zh-Hant locale wording', () => {
  it('uses Taiwan-style terminology for key UI labels', () => {
    expect(zhHant.home.login).toBe('登入')
    expect(zhHant.common.email).toBe('電子郵件')
    expect(zhHant.common.chooseFile).toBe('選擇檔案')
    expect(zhHant.nav.settings).toBe('系統設定')
    expect(zhHant.keys.group).toBe('群組')
    expect(zhHant.usage.title).toBe('使用紀錄')
    expect(zhHant.admin.usage.tokenRanking.columns.notes).toBe('備註')
    expect(zhHant.admin.usage.tokenRanking.columns.balance).toBe('餘額')
    expect(zhHant.home.viewDocs).toBe('查看文件')
  })
})
