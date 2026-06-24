import path from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {parseCreateIntent} from '../src/agent-create/intent'
import {createProjectPlan} from '../src/agent-create/planner'

describe('createProjectPlan', () => {
  test('plans React host and Vue user remote from parsed intent', () => {
    const intent = parseCreateIntent('React 主应用 + Vue 子应用')
    const plan = createProjectPlan(intent, {
      targetDir: path.join(process.cwd(), '.tmp/agent-create-demo'),
      dryRun: true,
      install: false,
      dev: false,
      verify: true,
      json: true,
    })

    expect(plan.rootName).toBe('agent-create-demo')
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
})
