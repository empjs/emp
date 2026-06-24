import path from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {parseCreateIntent} from '../src/agent-create/intent'
import {createProjectPlan} from '../src/agent-create/planner'
import type {CreateIntent, CreateOptions} from '../src/agent-create/types'

const createOptions = (targetDir: string): CreateOptions => ({
  targetDir,
  dryRun: true,
  install: false,
  dev: false,
  verify: true,
  json: true,
})

describe('createProjectPlan', () => {
  test('plans React host and Vue user remote from parsed intent', () => {
    const intent = parseCreateIntent('React 主应用 + Vue 子应用')
    const targetDir = path.join(process.cwd(), '.tmp/agent-create-demo')
    const plan = createProjectPlan(intent, createOptions(targetDir))

    expect(plan.rootName).toBe('agent-create-demo')
    expect(plan.rootDir).toBe(path.resolve(targetDir))
    expect(plan.packageManager).toBe('pnpm')
    expect(plan.apps).toEqual([
      {name: 'host', role: 'host', framework: 'react', port: 3000},
      {name: 'user', role: 'remote', framework: 'vue', port: 3001},
    ])
    expect(plan.files.map(file => file.path)).toEqual(
      expect.arrayContaining([
        'emp.intent.yaml',
        'apps/host/emp.config.ts',
        'apps/user/emp.config.ts',
      ]),
    )
  })

  test('rejects intents without the P0 single remote', () => {
    const intent = {
      raw: 'React 主应用',
      host: {framework: 'react', name: 'host'},
      remotes: [],
    } as unknown as CreateIntent

    expect(() =>
      createProjectPlan(
        intent,
        createOptions(path.join(process.cwd(), '.tmp/agent-create-invalid')),
      ),
    ).toThrow(/P0 仅支持单 host \+ 单 remote/)
  })
})
