import type {CreateProjectPlan, GeneratedFile} from './types'

type PlannedProject = Omit<CreateProjectPlan, 'files'>

const EMP_VERSION = '^4.0.0-alpha.2'

function stringifyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`
}

function rootPackageJson(plan: PlannedProject): string {
  return stringifyJson({
    name: plan.rootName,
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'pnpm --parallel --filter "./apps/*" dev',
      build: 'pnpm --filter "./apps/*" build',
      verify: 'pnpm --filter "./apps/*" build',
    },
    devDependencies: {
      '@empjs/cli': EMP_VERSION,
      '@empjs/plugin-react': EMP_VERSION,
      '@empjs/plugin-vue3': EMP_VERSION,
      '@empjs/share': EMP_VERSION,
      typescript: '^5.9.2',
    },
  })
}

function workspaceYaml(): string {
  return `packages:
  - apps/*
`
}

function intentYaml(plan: PlannedProject): string {
  return `name: ${plan.rootName}
intent: ${JSON.stringify(plan.intent.raw)}
packageManager: pnpm
apps:
  - name: host
    role: host
    framework: react
    port: 3000
  - name: user
    role: remote
    framework: vue
    port: 3001
shared:
  react: singleton
  react-dom: singleton
`
}

function hostPackageJson(): string {
  return stringifyJson({
    name: 'host',
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'emp dev',
      build: 'emp build',
      start: 'emp serve',
    },
    dependencies: {
      '@empjs/cli': EMP_VERSION,
      '@empjs/plugin-react': EMP_VERSION,
      '@empjs/share': EMP_VERSION,
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
    devDependencies: {
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      typescript: '^5.9.2',
    },
  })
}

function remotePackageJson(): string {
  return stringifyJson({
    name: 'user',
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'emp dev',
      build: 'emp build',
      start: 'emp serve',
    },
    dependencies: {
      '@empjs/cli': EMP_VERSION,
      '@empjs/plugin-vue3': EMP_VERSION,
      '@empjs/share': EMP_VERSION,
      vue: '^3.5.21',
    },
    devDependencies: {
      typescript: '^5.9.2',
    },
  })
}

function hostConfig(): string {
  return `import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig({
  appEntry: 'main.tsx',
  html: {mountId: 'root'},
  server: {port: 3000},
  plugins: [
    pluginReact(),
    pluginRspackEmpShare({
      name: 'host',
      remotes: {
        user: 'user@http://localhost:3001/emp.js',
      },
      shared: {
        react: {singleton: true},
        'react-dom': {singleton: true},
      },
    }),
  ],
})
`
}

function remoteConfig(): string {
  return `import {defineConfig} from '@empjs/cli'
import pluginVue from '@empjs/plugin-vue3'
import {pluginRspackEmpShare} from '@empjs/share/rspack'

export default defineConfig({
  appEntry: 'main.ts',
  html: {mountId: 'app'},
  server: {port: 3001},
  plugins: [
    pluginVue(),
    pluginRspackEmpShare({
      name: 'user',
      exposes: {
        './App': './src/App.vue',
      },
    }),
  ],
})
`
}

function hostRemoteTypes(): string {
  return `declare module 'user/App' {
  import type {ComponentType} from 'react'

  const App: ComponentType
  export default App
}
`
}

function hostMain(): string {
  return `import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)
`
}

function hostApp(): string {
  return `import React from 'react'

const RemoteApp = React.lazy(() => import('user/App'))

export default function App() {
  return (
    <main>
      <h1>EMP Host</h1>
      <React.Suspense fallback={<p>Loading remote...</p>}>
        <RemoteApp />
      </React.Suspense>
    </main>
  )
}
`
}

function remoteMain(): string {
  return `import {createApp} from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
`
}

function remoteApp(): string {
  return `<template>
  <section>
    <h2>EMP Remote</h2>
    <p>Vue remote is running.</p>
  </section>
</template>
`
}

export function createTemplateFiles(plan: PlannedProject): GeneratedFile[] {
  return [
    {path: 'package.json', content: rootPackageJson(plan)},
    {path: 'pnpm-workspace.yaml', content: workspaceYaml()},
    {path: 'emp.intent.yaml', content: intentYaml(plan)},
    {path: 'apps/host/package.json', content: hostPackageJson()},
    {path: 'apps/host/emp.config.ts', content: hostConfig()},
    {path: 'apps/host/src/main.tsx', content: hostMain()},
    {path: 'apps/host/src/App.tsx', content: hostApp()},
    {path: 'apps/host/src/remotes.d.ts', content: hostRemoteTypes()},
    {path: 'apps/user/package.json', content: remotePackageJson()},
    {path: 'apps/user/emp.config.ts', content: remoteConfig()},
    {path: 'apps/user/src/main.ts', content: remoteMain()},
    {path: 'apps/user/src/App.vue', content: remoteApp()},
  ]
}
