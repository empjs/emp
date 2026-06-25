import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {fixGeneratedProject} from '../src/agent-create/fix'
import {generateProject} from '../src/agent-create/generator'
import {parseCreateIntent} from '../src/agent-create/intent'
import {createProjectPlan} from '../src/agent-create/planner'
import type {CreateProjectPlan} from '../src/agent-create/types'

const createPlan = (targetDir: string): CreateProjectPlan =>
  createProjectPlan(parseCreateIntent('React 主应用 + Vue 子应用'), {
    targetDir,
    dryRun: false,
    install: false,
    dev: false,
    verify: true,
    json: true,
  })

async function withGeneratedProject<T>(
  callback: (plan: CreateProjectPlan) => Promise<T>,
): Promise<T> {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'emp-agent-fix-'))
  try {
    const plan = createPlan(path.join(tmpRoot, 'demo'))
    await generateProject(plan, {dryRun: false})
    return await callback(plan)
  } finally {
    await fs.rm(tmpRoot, {recursive: true, force: true})
  }
}

describe('fixGeneratedProject', () => {
  test('regenerates a passed emp-report.json when only the report check failed and the report is missing', async () => {
    await withGeneratedProject(async plan => {
      const reportPath = path.join(plan.rootDir, 'emp-report.json')
      await fs.rm(reportPath, {force: true})

      const fixes = await fixGeneratedProject(plan, [
        {name: 'report', status: 'failed', message: 'emp-report.json 缺失'},
      ])

      expect(fixes).toEqual([
        {name: 'report', status: 'applied', message: '已重新生成 emp-report.json'},
      ])

      const reportJson = JSON.parse(await fs.readFile(reportPath, 'utf8'))
      expect(reportJson.status).toBe('passed')
      expect(reportJson.checks).toEqual([])
    })
  })

  test('preserves non-report failed checks when regenerating a missing report', async () => {
    await withGeneratedProject(async plan => {
      const reportPath = path.join(plan.rootDir, 'emp-report.json')
      await fs.rm(reportPath, {force: true})
      const hostConfigCheck = {
        name: 'host-config',
        status: 'failed' as const,
        message: 'host 未配置 user remote',
      }

      const fixes = await fixGeneratedProject(plan, [
        {name: 'report', status: 'failed', message: 'emp-report.json 缺失'},
        hostConfigCheck,
      ])

      expect(fixes).toEqual([
        {name: 'report', status: 'applied', message: '已重新生成 emp-report.json'},
      ])

      const reportJson = JSON.parse(await fs.readFile(reportPath, 'utf8'))
      expect(reportJson.status).toBe('failed')
      expect(reportJson.checks).toEqual([hostConfigCheck])
    })
  })

  test('returns no fixes and does not create a report when report did not fail', async () => {
    await withGeneratedProject(async plan => {
      const reportPath = path.join(plan.rootDir, 'emp-report.json')
      await fs.rm(reportPath, {force: true})

      const fixes = await fixGeneratedProject(plan, [
        {name: 'host-config', status: 'failed', message: 'host 未配置 user remote'},
      ])

      expect(fixes).toEqual([])
      await expect(fs.stat(reportPath)).rejects.toThrow(/ENOENT/)
    })
  })

  test('skips regenerating emp-report.json when the report already exists', async () => {
    await withGeneratedProject(async plan => {
      const reportPath = path.join(plan.rootDir, 'emp-report.json')
      await fs.writeFile(reportPath, 'keep existing report', 'utf8')

      const fixes = await fixGeneratedProject(plan, [
        {name: 'report', status: 'failed', message: 'emp-report.json 缺失'},
      ])

      expect(fixes).toEqual([
        {name: 'report', status: 'skipped', message: 'emp-report.json 已存在，未覆盖'},
      ])
      await expect(fs.readFile(reportPath, 'utf8')).resolves.toBe('keep existing report')
    })
  })
})
