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
    const options = createOptions(targetDir)
    const plan = createProjectPlan(intent, options)

    expect(plan.rootName).toBe('agent-create-demo')
    expect(plan.rootDir).toBe(path.resolve(targetDir))
    expect(plan.options).toEqual(options)
    expect(plan.packageManager).toBe('pnpm')
    expect(plan.apps).toEqual([
      {name: 'host', role: 'host', framework: 'react', port: 3000},
      {name: 'user', role: 'remote', framework: 'vue', port: 3001},
    ])

    const fileContent = (filePath: string) => {
      const file = plan.files.find(item => item.path === filePath)
      expect(file, `${filePath} should be generated`).toBeDefined()
      return file?.content ?? ''
    }

    expect(plan.files.map(file => file.path).sort()).toEqual([
      'apps/host/emp.config.ts',
      'apps/host/package.json',
      'apps/host/src/App.tsx',
      'apps/host/src/main.tsx',
      'apps/host/src/remotes.d.ts',
      'apps/user/emp.config.ts',
      'apps/user/package.json',
      'apps/user/src/App.vue',
      'apps/user/src/main.ts',
      'emp.intent.yaml',
      'package.json',
      'pnpm-workspace.yaml',
    ])

    const hostConfig = fileContent('apps/host/emp.config.ts')
    expect(hostConfig).toMatch(/remotes/)
    expect(hostConfig).toMatch(/user@http:\/\/localhost:3001\/emp\.js/)
    expect(hostConfig).toMatch(/shared/)
    expect(hostConfig).toMatch(/react/)
    expect(hostConfig).toMatch(/react-dom/)

    const remoteConfig = fileContent('apps/user/emp.config.ts')
    expect(remoteConfig).toMatch(/exposes/)
    expect(remoteConfig).toMatch(/'\.\/App': '\.\/src\/App\.vue'/)

    const rootPackageJson = JSON.parse(fileContent('package.json'))
    expect(rootPackageJson.scripts).toMatchObject({
      dev: expect.any(String),
      build: expect.any(String),
      verify: expect.any(String),
    })
    expect(rootPackageJson.packageManager).toBe('pnpm@10.33.0')
    expect(rootPackageJson.engines).toEqual({
      node: '^20.19.0 || >=22.12.0',
      pnpm: '10.x',
    })

    const hostPackageJson = JSON.parse(fileContent('apps/host/package.json'))
    expect(hostPackageJson.dependencies).toMatchObject({
      '@empjs/bridge-react': expect.any(String),
      '@empjs/bridge-vue3': expect.any(String),
      vue: expect.any(String),
    })

    const hostApp = fileContent('apps/host/src/App.tsx')
    expect(hostApp).toContain('createRemoteAppComponent')
    expect(hostApp).toContain('createBridgeComponent')
    expect(hostApp).toContain("@empjs/bridge-react")
    expect(hostApp).toContain("@empjs/bridge-vue3")
    expect(hostApp).toContain("import * as Vue from 'vue'")

    const remoteTypes = fileContent('apps/host/src/remotes.d.ts')
    expect(remoteTypes).not.toContain('ComponentType')

    expect(fileContent('pnpm-workspace.yaml')).toContain('- apps/*')

    const intentYaml = fileContent('emp.intent.yaml')
    expect(intentYaml).toContain('name: host')
    expect(intentYaml).toContain('role: host')
    expect(intentYaml).toContain('port: 3000')
    expect(intentYaml).toContain('name: user')
    expect(intentYaml).toContain('role: remote')
    expect(intentYaml).toContain('port: 3001')
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
