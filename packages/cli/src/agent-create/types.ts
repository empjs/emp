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
  options: CreateOptions
  packageManager: 'pnpm'
  apps: CreateAppPlan[]
  files: GeneratedFile[]
}

export interface VerificationCheck {
  name: string
  status: CheckStatus
  message: string
}

export interface CommandResult {
  name: string
  command: string
  status: CheckStatus
  exitCode: number | null
  stdout: string
  stderr: string
}

export interface EmpCreateReport {
  status: CheckStatus
  rootDir: string
  apps: Array<{name: string; role: AppRole; framework: Framework; url: string}>
  checks: VerificationCheck[]
  commands: CommandResult[]
}
