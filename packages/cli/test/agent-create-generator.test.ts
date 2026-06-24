import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {parseCreateIntent} from '../src/agent-create/intent'
import {createProjectPlan} from '../src/agent-create/planner'
import type {CreateProjectPlan} from '../src/agent-create/types'
import {generateProject} from '../src/agent-create/generator'

const createPlan = (targetDir: string): CreateProjectPlan =>
  createProjectPlan(parseCreateIntent('React 主应用 + Vue 子应用'), {
    targetDir,
    dryRun: false,
    install: false,
    dev: false,
    verify: true,
    json: true,
  })

async function withTempDir<T>(callback: (tmpRoot: string) => Promise<T>): Promise<T> {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'emp-agent-create-'))
  try {
    return await callback(tmpRoot)
  } finally {
    await fs.rm(tmpRoot, {recursive: true, force: true})
  }
}

describe('generateProject', () => {
  test('returns planned files in dry-run mode without creating targetDir', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'demo')
      const plan = createPlan(targetDir)

      const files = await generateProject(plan, {dryRun: true})

      expect(files).toEqual(plan.files)
      await expect(fs.stat(targetDir)).rejects.toThrow(/ENOENT/)
    })
  })

  test('rejects dry-run generated file paths that escape rootDir', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'demo')
      const plan = createPlan(targetDir)
      const unsafePlan: CreateProjectPlan = {
        ...plan,
        files: [{path: '../escaped.txt', content: 'escape'}],
      }

      await expect(generateProject(unsafePlan, {dryRun: true})).rejects.toThrow(
        /文件路径不能逃逸目标目录/,
      )
    })
  })

  test('rejects dry-run absolute generated file paths', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'demo')
      const plan = createPlan(targetDir)
      const unsafePlan: CreateProjectPlan = {
        ...plan,
        files: [{path: path.join(tmpRoot, 'absolute.txt'), content: 'escape'}],
      }

      await expect(generateProject(unsafePlan, {dryRun: true})).rejects.toThrow(
        /文件路径必须是相对路径/,
      )
    })
  })

  test('writes planned project files in write mode', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'demo')
      const plan = createPlan(targetDir)

      await generateProject(plan, {dryRun: false})

      await expect(fs.readFile(path.join(targetDir, 'emp.intent.yaml'), 'utf8')).resolves.toMatch(
        /React|host/,
      )
      await expect(
        fs.readFile(path.join(targetDir, 'apps/host/emp.config.ts'), 'utf8'),
      ).resolves.toMatch(/remotes/)
      await expect(
        fs.readFile(path.join(targetDir, 'apps/user/emp.config.ts'), 'utf8'),
      ).resolves.toMatch(/exposes/)
    })
  })

  test('rejects generation into an existing non-empty targetDir', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'demo')
      const plan = createPlan(targetDir)

      await fs.mkdir(targetDir, {recursive: true})
      await fs.writeFile(path.join(targetDir, 'existing.txt'), 'keep', 'utf8')

      await expect(generateProject(plan, {dryRun: false})).rejects.toThrow(/目标目录已存在且非空/)
    })
  })

  test('rejects generated file paths that escape rootDir', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'demo')
      const plan = createPlan(targetDir)
      const unsafePlan: CreateProjectPlan = {
        ...plan,
        files: [{path: '../escaped.txt', content: 'escape'}],
      }

      await expect(generateProject(unsafePlan, {dryRun: false})).rejects.toThrow(
        /文件路径不能逃逸目标目录/,
      )
    })
  })

  test('rejects absolute generated file paths', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'demo')
      const plan = createPlan(targetDir)
      const unsafePlan: CreateProjectPlan = {
        ...plan,
        files: [{path: path.join(tmpRoot, 'absolute.txt'), content: 'escape'}],
      }

      await expect(generateProject(unsafePlan, {dryRun: false})).rejects.toThrow(
        /文件路径必须是相对路径/,
      )
    })
  })

  test('does not create earlier safe files when a later generated path is unsafe', async () => {
    await withTempDir(async tmpRoot => {
      const targetDir = path.join(tmpRoot, 'demo')
      const plan = createPlan(targetDir)
      const unsafePlan: CreateProjectPlan = {
        ...plan,
        files: [
          {path: 'safe.txt', content: 'safe'},
          {path: '../escaped.txt', content: 'escape'},
        ],
      }

      await expect(generateProject(unsafePlan, {dryRun: false})).rejects.toThrow(
        /文件路径不能逃逸目标目录/,
      )
      await expect(fs.stat(path.join(targetDir, 'safe.txt'))).rejects.toThrow(/ENOENT/)
    })
  })
})
