import {readFileSync} from 'node:fs'
import {describe, expect, test} from '@rstest/core'
import {TARGET_APP_DIRS} from '../../scripts/apps.catalog.mjs'
import {ROOT_BROWSER_TEST_TARGETS} from '../../scripts/root-test-targets.mjs'

const browserCoverage = {
  'adapter-app': 'browser-interactive',
  'adapter-host': 'browser-smoke',
  demo: 'browser-interactive',
  'mf-app': 'browser-interactive',
  'mf-host': 'browser-interactive',
  'react-19-tanstack': 'browser-interactive',
  'rspack2-modern-module': 'browser-smoke',
  'rspack2-optimization': 'browser-smoke',
  'tailwind-4': 'browser-interactive',
  'vue-2-base': 'browser-interactive',
  'vue-2-project': 'browser-interactive',
  'vue-3-base': 'browser-interactive',
  'vue-3-project': 'browser-interactive',
} as const

const browserTestFiles = Object.values(ROOT_BROWSER_TEST_TARGETS).flat()
const browserTestFilesByApp = new Map<string, string[]>()
const appsMatrixDoc = readFileSync('docs/testing/apps-feature-test-matrix.md', 'utf8')

const p2BoundaryCoverage = {
  'adapter-host': {
    boundaries: ['remote-provider-manifest-diagnostic'],
    files: ['apps/adapter-host/test/browser/smoke.browser.ts'],
  },
  demo: {
    boundaries: ['proxy-target-unavailable-diagnostic'],
    files: ['apps/demo/test/browser/proxy.browser.ts'],
  },
  'mf-host': {
    boundaries: ['remote-provider-manifest-diagnostic'],
    files: ['apps/mf-host/test/browser/mobx.browser.ts'],
  },
  'mf-app': {
    boundaries: ['remote-consumer-manifest-diagnostic'],
    files: ['apps/mf-app/test/browser/remote.browser.ts'],
  },
  'react-19-tanstack': {
    boundaries: ['route-deep-refresh'],
    files: ['apps/react-19-tanstack/test/browser/react19.browser.ts'],
  },
  'vue-2-base': {
    boundaries: ['remote-provider-manifest-diagnostic'],
    files: ['apps/vue-2-base/test/browser/interactive.browser.ts'],
  },
  'vue-2-project': {
    boundaries: ['remote-consumer-manifest-diagnostic'],
    files: ['apps/vue-2-project/test/browser/remote.browser.ts'],
  },
  'vue-3-base': {
    boundaries: ['remote-provider-manifest-diagnostic'],
    files: ['apps/vue-3-base/test/browser/interactive.browser.ts'],
  },
  'vue-3-project': {
    boundaries: ['route-deep-refresh', 'remote-consumer-manifest-diagnostic'],
    files: ['apps/vue-3-project/test/browser/remote.browser.ts'],
  },
} as const

for (const file of browserTestFiles) {
  const match = file.match(/^apps\/([^/]+)\/test\/browser\//)
  if (!match) continue
  browserTestFilesByApp.set(match[1], [...(browserTestFilesByApp.get(match[1]) ?? []), file])
}

describe('apps browser coverage matrix', () => {
  test('classifies every current apps target', () => {
    expect(Object.keys(browserCoverage).sort()).toEqual([...TARGET_APP_DIRS].sort())
  })

  test('keeps the real browser lane focused on apps with actual interaction surface', () => {
    expect(Object.values(browserCoverage).filter(value => value === 'browser-interactive').length).toBeGreaterThanOrEqual(8)
    expect(browserCoverage['adapter-app']).toBe('browser-interactive')
    expect(browserCoverage['rspack2-modern-module']).toBe('browser-smoke')
  })

  test('maps every browser-covered app to at least one per-app browser test file', () => {
    for (const [app, coverage] of Object.entries(browserCoverage)) {
      const files = browserTestFilesByApp.get(app) ?? []
      if (coverage === 'browser-interactive' || coverage === 'browser-smoke') {
        expect(files, `${app} must have a browser test file`).not.toHaveLength(0)
        expect(files.every(file => file.startsWith(`apps/${app}/test/browser/`))).toBe(true)
      } else {
        expect(files, `${app} must stay out of browser lane while ${coverage}`).toHaveLength(0)
      }
    }
  })

  test('keeps the documented P2 boundary list fully covered', () => {
    const remainingP2Rows = appsMatrixDoc.split('\n').filter(line => line.includes('剩余 P2'))
    expect(remainingP2Rows).toEqual([])
  })

  test('maps every P2 boundary contract to a real browser test file', () => {
    for (const [app, contract] of Object.entries(p2BoundaryCoverage)) {
      expect(Object.keys(browserCoverage), `${app} must stay in current apps coverage`).toContain(app)
      expect(contract.boundaries.length, `${app} must declare at least one P2 boundary`).toBeGreaterThan(0)

      const registeredFiles = browserTestFilesByApp.get(app) ?? []
      for (const file of contract.files) {
        expect(registeredFiles, `${app} P2 boundary must be registered in root browser targets`).toContain(file)
      }
    }
  })
})
