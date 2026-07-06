import {describe, expect, test} from '@rstest/core'
import {mkdtemp, readFile, rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {pathToFileURL} from 'node:url'
import {ROOT_BROWSER_TEST_TARGETS, ROOT_TEST_TARGETS} from '../scripts/root-test-targets.mjs'
import {repoRoot} from './helpers/repo-root'

type ReportModule = typeof import('../scripts/release-acceptance-report.mjs')

const loadReportModule = async () =>
  (await import(pathToFileURL(join(repoRoot, 'scripts/release-acceptance-report.mjs')).href)) as ReportModule

const passedResult = {
  id: 'workflow-check',
  label: 'workflow:check',
  command: 'corepack pnpm workflow:check',
  status: 'passed' as const,
  required: true,
  exitCode: 0,
  durationMs: 1280,
  startedAt: '2026-07-06T08:00:00.000Z',
  endedAt: '2026-07-06T08:00:01.280Z',
  output: 'EMP workflow check passed.',
}

describe('release acceptance report', () => {
  test('builds the release credential model from current root and browser test targets', async () => {
    const {buildAcceptanceReportModel} = await loadReportModule()

    const model = buildAcceptanceReportModel({
      repoRoot,
      generatedAt: '2026-07-06T08:00:00.000Z',
      commandResults: [
        passedResult,
        {
          id: 'apps-browser',
          label: 'test:apps:browser',
          command: 'corepack pnpm test:apps:browser',
          status: 'skipped',
          required: false,
          exitCode: null,
          durationMs: 0,
          startedAt: '2026-07-06T08:00:01.280Z',
          endedAt: '2026-07-06T08:00:01.280Z',
          output: 'use --include-browser to run this optional lane',
        },
      ],
    })

    expect(model.overallStatus).toBe('passed')
    expect(model.commandSummary).toEqual({passed: 1, failed: 0, skipped: 1, total: 2})
    expect(model.rootTargets.find(target => target.id === 'rules')?.fileCount).toBe(ROOT_TEST_TARGETS.rules.length)
    expect(model.browserTargets.find(target => target.id === 'apps-browser')?.fileCount).toBe(
      ROOT_BROWSER_TEST_TARGETS['apps-browser'].length,
    )
    expect(model.coverageSummary.rootTestFiles).toBe(ROOT_TEST_TARGETS.all.length)
    expect(model.coverageSummary.browserTestFiles).toBe(ROOT_BROWSER_TEST_TARGETS['browser-all'].length)
  })

  test('renders a self-contained Chinese HTML credential with command status and coverage sections', async () => {
    const {buildAcceptanceReportModel, renderAcceptanceReportHtml} = await loadReportModule()
    const model = buildAcceptanceReportModel({
      repoRoot,
      generatedAt: '2026-07-06T08:00:00.000Z',
      commandResults: [
        passedResult,
        {
          ...passedResult,
          id: 'ci-verify',
          label: 'ci:verify',
          command: 'corepack pnpm ci:verify',
          status: 'failed',
          exitCode: 1,
          output: '1 test failed',
        },
      ],
    })

    const html = renderAcceptanceReportHtml(model)

    expect(model.overallStatus).toBe('failed')
    expect(html).toContain('EMP v4 发布验收凭证')
    expect(html).toContain('class="brand-lockup"')
    expect(html).toContain('aria-label="EMP v4"')
    expect(html).toContain('EMP V4')
    expect(html).toContain('REPORT')
    expect(html).toContain('Geist')
    expect(html).not.toContain('font-family: Inter')
    expect(html).toContain('总体状态')
    expect(html).toContain('阻塞')
    expect(html).toContain('验证命令')
    expect(html).toContain('测试矩阵')
    expect(html).toContain('新增覆盖')
    expect(html).toContain('未覆盖边界')
    expect(html).toContain('ci:verify')
    expect(html).toContain('1 test failed')
    expect(html).toContain('test/release-acceptance-report.test.ts')
    expect(html).not.toContain('<script')
  })

  test('CLI dry-run accepts pnpm argument separator and writes the HTML credential', async () => {
    const {runAcceptanceReportCli} = await loadReportModule()
    const tempDir = await mkdtemp(join(tmpdir(), 'emp-release-acceptance-'))
    const outFile = join(tempDir, 'acceptance.html')

    try {
      const result = await runAcceptanceReportCli({
        repoRoot,
        argv: ['--', '--dry-run', '--out', outFile],
      })
      const html = await readFile(outFile, 'utf8')

      expect(result.exitCode).toBe(0)
      expect(html).toContain('EMP v4 发布验收凭证')
      expect(html).toContain('未执行')
      expect(html).toContain('dry-run: command was not executed')
    } finally {
      await rm(tempDir, {recursive: true, force: true})
    }
  })
})
