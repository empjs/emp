import {describe, expect, test} from '@rstest/core'
import {TARGET_APP_DIRS} from '../scripts/apps.catalog.mjs'
import {ROOT_BROWSER_TEST_TARGETS} from '../scripts/root-test-targets.mjs'

const browserCoverage = {
  'adapter-app': 'blocked-missing-local-remote',
  'adapter-host': 'browser-smoke',
  demo: 'browser-interactive',
  'mf-app': 'browser-interactive',
  'mf-host': 'browser-interactive',
  'react-19-tanstack': 'browser-interactive',
  'rspack2-modern-module': 'build-only',
  'rspack2-optimization': 'browser-smoke',
  'tailwind-4': 'browser-interactive',
  'vue-2-base': 'browser-interactive',
  'vue-2-project': 'browser-interactive',
  'vue-3-base': 'browser-interactive',
  'vue-3-project': 'browser-interactive',
} as const

const browserTestFiles = Object.values(ROOT_BROWSER_TEST_TARGETS).flat()
const browserTestFilesByApp = new Map<string, string[]>()

for (const file of browserTestFiles) {
  const match = file.match(/^test\/apps\/browser\/([^/]+)\//)
  if (!match) continue
  browserTestFilesByApp.set(match[1], [...(browserTestFilesByApp.get(match[1]) ?? []), file])
}

describe('apps browser coverage matrix', () => {
  test('classifies every current apps target', () => {
    expect(Object.keys(browserCoverage).sort()).toEqual([...TARGET_APP_DIRS].sort())
  })

  test('keeps the real browser lane focused on apps with actual interaction surface', () => {
    expect(Object.values(browserCoverage).filter(value => value === 'browser-interactive').length).toBeGreaterThanOrEqual(8)
    expect(browserCoverage['adapter-app']).toBe('blocked-missing-local-remote')
    expect(browserCoverage['rspack2-modern-module']).toBe('build-only')
  })

  test('maps every browser-covered app to at least one per-app browser test file', () => {
    for (const [app, coverage] of Object.entries(browserCoverage)) {
      const files = browserTestFilesByApp.get(app) ?? []
      if (coverage === 'browser-interactive' || coverage === 'browser-smoke') {
        expect(files, `${app} must have a browser test file`).not.toHaveLength(0)
        expect(files.every(file => file.startsWith(`test/apps/browser/${app}/`))).toBe(true)
      } else {
        expect(files, `${app} must stay out of browser lane while ${coverage}`).toHaveLength(0)
      }
    }
  })
})
