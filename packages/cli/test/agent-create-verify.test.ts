import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {generateProject} from '../src/agent-create/generator'
import {parseCreateIntent} from '../src/agent-create/intent'
import {createProjectPlan} from '../src/agent-create/planner'
import {buildCreateReport, writeCreateReport} from '../src/agent-create/report'
import type {CommandResult, CreateProjectPlan} from '../src/agent-create/types'
import {verifyGeneratedProject} from '../src/agent-create/verify'

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
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'emp-agent-verify-'))
  try {
    const plan = createPlan(path.join(tmpRoot, 'demo'))
    await generateProject(plan, {dryRun: false})
    return await callback(plan)
  } finally {
    await fs.rm(tmpRoot, {recursive: true, force: true})
  }
}

describe('agent-create verification report', () => {
  test('verifies generated React host and Vue remote project and writes a passed report', async () => {
    await withGeneratedProject(async plan => {
      const checks = await verifyGeneratedProject(plan)

      expect(checks.every(check => check.status === 'passed')).toBe(true)
      expect(checks.map(check => check.name)).toEqual([
        'root-package',
        'workspace',
        'intent',
        'host-config',
        'remote-config',
      ])

      const report = buildCreateReport(plan, checks, [])

      expect(report.status).toBe('passed')
      expect(report.apps.map(app => app.url)).toEqual([
        'http://localhost:3000',
        'http://localhost:3001',
      ])
      expect(report.commands).toEqual([])

      await writeCreateReport(report)

      const reportJson = JSON.parse(
        await fs.readFile(path.join(plan.rootDir, 'emp-report.json'), 'utf8'),
      )
      expect(reportJson.status).toBe('passed')
    })
  })

  test('marks host-config failed when generated host config is missing', async () => {
    await withGeneratedProject(async plan => {
      await fs.rm(path.join(plan.rootDir, 'apps/host/emp.config.ts'))

      const checks = await verifyGeneratedProject(plan)

      expect(checks.find(check => check.name === 'host-config')).toMatchObject({
        name: 'host-config',
        status: 'failed',
      })

      const report = buildCreateReport(plan, checks, [])

      expect(report.status).toBe('failed')
    })
  })

  test('marks report failed when a command fails', () => {
    const plan = createPlan(path.join(os.tmpdir(), 'emp-agent-command-failure'))
    const commands: CommandResult[] = [
      {
        name: 'install',
        command: 'pnpm install',
        status: 'failed',
        exitCode: 1,
        stdout: '',
        stderr: 'install failed',
      },
    ]

    const report = buildCreateReport(plan, [], commands)

    expect(report.status).toBe('failed')
  })
})
