export type Framework = 'react' | 'vue'
export type AppRole = 'host' | 'remote'
export type CheckStatus = 'passed' | 'failed' | 'skipped'

export interface CreateIntent {
  raw: string
  host: {framework: 'react'; name: 'host'}
  remotes: [{framework: 'vue'; name: 'user'}]
}

export interface CreateOptions {
  targetDir: string
  dryRun: boolean
  install: boolean
  dev: boolean
  verify: boolean
  json: boolean
}

export interface CreateAppPlan {
  name: string
  role: AppRole
  framework: Framework
  port: number
}

export interface GeneratedFile {
  path: string
  content: string
}

export interface CreateProjectPlan {
  rootName: string
  rootDir: string
  intent: CreateIntent
  packageManager: 'pnpm'
  apps: CreateAppPlan[]
  files: GeneratedFile[]
}
