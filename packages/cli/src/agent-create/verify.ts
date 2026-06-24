import fs from 'node:fs/promises'
import path from 'node:path'
import type {CreateProjectPlan, VerificationCheck} from './types'

async function fileIncludes(rootDir: string, relativePath: string, pattern: RegExp): Promise<boolean> {
  try {
    const content = await fs.readFile(path.join(rootDir, relativePath), 'utf8')
    return pattern.test(content)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false
    }
    throw error
  }
}

function passed(name: string, message: string): VerificationCheck {
  return {name, status: 'passed', message}
}

function failed(name: string, message: string): VerificationCheck {
  return {name, status: 'failed', message}
}

export async function verifyGeneratedProject(plan: CreateProjectPlan): Promise<VerificationCheck[]> {
  const checks: VerificationCheck[] = []

  try {
    JSON.parse(await fs.readFile(path.join(plan.rootDir, 'package.json'), 'utf8'))
    checks.push(passed('root-package', '根 package.json 可解析'))
  } catch {
    checks.push(failed('root-package', '根 package.json 不存在或不可解析'))
  }

  checks.push(
    (await fileIncludes(plan.rootDir, 'pnpm-workspace.yaml', /apps\/\*/))
      ? passed('workspace', 'pnpm workspace 已包含 apps/*')
      : failed('workspace', 'pnpm workspace 未包含 apps/*'),
  )

  checks.push(
    (await fileIncludes(plan.rootDir, 'emp.intent.yaml', /role: host/)) &&
      (await fileIncludes(plan.rootDir, 'emp.intent.yaml', /role: remote/))
      ? passed('intent', 'emp.intent.yaml 已记录 host/remote 意图')
      : failed('intent', 'emp.intent.yaml 缺少 host/remote 意图'),
  )

  checks.push(
    (await fileIncludes(plan.rootDir, 'apps/host/emp.config.ts', /user@http:\/\/localhost:3001\/emp\.js/))
      ? passed('host-config', 'host 已配置 user remote')
      : failed('host-config', 'host 未配置 user remote'),
  )

  checks.push(
    (await fileIncludes(plan.rootDir, 'apps/user/emp.config.ts', /'\.\/App': '\.\/src\/App\.vue'/))
      ? passed('remote-config', 'remote 已暴露 ./App')
      : failed('remote-config', 'remote 未暴露 ./App'),
  )

  return checks
}
