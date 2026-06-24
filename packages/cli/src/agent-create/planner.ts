import path from 'node:path'
import type {CreateIntent, CreateOptions, CreateProjectPlan} from './types'
import {createTemplateFiles} from './templates'

export function createProjectPlan(
  intent: CreateIntent,
  options: CreateOptions,
): CreateProjectPlan {
  const rootDir = path.resolve(options.targetDir)
  const rootName = path.basename(rootDir)
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
        name: intent.remotes[0].name,
        role: 'remote',
        framework: intent.remotes[0].framework,
        port: 3001,
      },
    ],
  }

  return {
    ...planWithoutFiles,
    files: createTemplateFiles(planWithoutFiles),
  }
}
