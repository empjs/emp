import path from 'node:path'
import type {CreateIntent, CreateOptions, CreateProjectPlan} from './types'
import {createTemplateFiles} from './templates'

function assertP0Intent(remotes: readonly unknown[]): void {
  if (remotes.length !== 1) {
    throw new Error('P0 仅支持单 host + 单 remote')
  }
}

export function createProjectPlan(
  intent: CreateIntent,
  options: CreateOptions,
): CreateProjectPlan {
  assertP0Intent(intent.remotes)

  const rootDir = path.resolve(options.targetDir)
  const rootName = path.basename(rootDir)
  const [remote] = intent.remotes
  const planWithoutFiles: Omit<CreateProjectPlan, 'files'> = {
    rootName,
    rootDir,
    intent,
    packageManager: 'pnpm',
    apps: [
      {
        name: intent.host.name,
        role: 'host',
        framework: intent.host.framework,
        port: 3000,
      },
      {
        name: remote.name,
        role: 'remote',
        framework: remote.framework,
        port: 3001,
      },
    ],
  }

  return {
    ...planWithoutFiles,
    files: createTemplateFiles(planWithoutFiles),
  }
}
