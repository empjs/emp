import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {generateProject} from '../src/agent-create/generator'
import {parseCreateIntent} from '../src/agent-create/intent'
import {createProjectPlan} from '../src/agent-create/planner'
import {buildCreateReport, writeCreateReport} from '../src/agent-create/report'
import {createTemplateFiles} from '../src/agent-create/templates'
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

  test('writes emp-report.json through a temporary file before rename', async () => {
    await withGeneratedProject(async plan => {
      const checks = await verifyGeneratedProject(plan)
      const report = buildCreateReport(plan, checks, [])
      const patchedFs = fs as unknown as {
        writeFile: typeof fs.writeFile
        rename: typeof fs.rename
      }
      const originalWriteFile = patchedFs.writeFile
      const originalRename = patchedFs.rename
      const writeTargets: string[] = []
      const renameTargets: Array<[string, string]> = []

      patchedFs.writeFile = (async (...args: Parameters<typeof fs.writeFile>) => {
        writeTargets.push(String(args[0]))
        return originalWriteFile(...args)
      }) as typeof fs.writeFile
      patchedFs.rename = (async (...args: Parameters<typeof fs.rename>) => {
        renameTargets.push([String(args[0]), String(args[1])])
        return originalRename(...args)
      }) as typeof fs.rename

      try {
        await writeCreateReport(report)
      } finally {
        patchedFs.writeFile = originalWriteFile
        patchedFs.rename = originalRename
      }

      expect(writeTargets.some(filePath => /emp-report\.json\.\d+\.\d+\.tmp$/.test(filePath))).toBe(
        true,
      )
      expect(
        renameTargets.some(
          ([from, to]) =>
            /emp-report\.json\.\d+\.\d+\.tmp$/.test(from) && to.endsWith('emp-report.json'),
        ),
      ).toBe(true)
      await expect(fs.readFile(path.join(plan.rootDir, 'emp-report.json'), 'utf8')).resolves.toMatch(
        /"status": "passed"/,
      )
    })
  })

  test('verifies host config against the planned remote name and port', async () => {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'emp-agent-verify-'))
    try {
      const basePlan = createPlan(path.join(tmpRoot, 'demo'))
      const apps = basePlan.apps.map(app => {
        if (app.role === 'host') {
          return {...app, port: 4300}
        }

        if (app.role === 'remote') {
          return {...app, name: 'profile', port: 4301}
        }

        return app
      })
      const planWithoutFiles: Omit<CreateProjectPlan, 'files'> = {
        rootName: basePlan.rootName,
        rootDir: basePlan.rootDir,
        intent: basePlan.intent,
        options: basePlan.options,
        packageManager: basePlan.packageManager,
        apps,
      }
      const plan: CreateProjectPlan = {
        ...planWithoutFiles,
        files: createTemplateFiles(planWithoutFiles),
      }

      await generateProject(plan, {dryRun: false})

      const checks = await verifyGeneratedProject(plan)
      const hostConfig = await fs.readFile(path.join(plan.rootDir, 'apps/host/emp.config.ts'), 'utf8')

      expect(hostConfig).toContain('profile@http://localhost:4301/emp.js')
      expect(hostConfig).not.toContain('user@http://localhost:3001/emp.js')
      expect(checks.find(check => check.name === 'host-config')).toMatchObject({
        name: 'host-config',
        status: 'passed',
      })
      expect(checks.every(check => check.status === 'passed')).toBe(true)
    } finally {
      await fs.rm(tmpRoot, {recursive: true, force: true})
    }
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
