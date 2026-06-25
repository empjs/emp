import path from 'node:path'
import {getPorts} from '../helper/getPort'
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
  const planOptions: CreateOptions = {...options}
  const [remote] = intent.remotes
  const planWithoutFiles: Omit<CreateProjectPlan, 'files'> = {
    rootName,
    rootDir,
    intent,
    options: planOptions,
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

export async function assignAvailableCreatePorts(plan: CreateProjectPlan): Promise<CreateProjectPlan> {
  if (plan.options.dryRun || !plan.options.dev) {
    return plan
  }

  const hostApp = plan.apps.find(app => app.role === 'host')
  const remoteApp = plan.apps.find(app => app.role === 'remote')

  if (!hostApp || !remoteApp) {
    return plan
  }

  const hostPort = await getPorts(hostApp.port)
  const remotePort = await getPorts(Math.max(remoteApp.port, hostPort + 1))
  const apps = plan.apps.map(app => {
    if (app.role === 'host') {
      return {...app, port: hostPort}
    }

    if (app.role === 'remote') {
      return {...app, port: remotePort}
    }

    return app
  })
  const planWithoutFiles: Omit<CreateProjectPlan, 'files'> = {
    rootName: plan.rootName,
    rootDir: plan.rootDir,
    intent: plan.intent,
    options: plan.options,
    packageManager: plan.packageManager,
    apps,
  }

  return {
    ...planWithoutFiles,
    files: createTemplateFiles(planWithoutFiles),
  }
}
