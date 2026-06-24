import fs from 'node:fs/promises'
import path from 'node:path'
import type {CommandResult, CreateProjectPlan, EmpCreateReport, VerificationCheck} from './types'

function overallStatus(checks: VerificationCheck[], commands: CommandResult[]): 'passed' | 'failed' {
  const checksPassed = checks.every(check => check.status === 'passed' || check.status === 'skipped')
  const commandsPassed = commands.every(command => command.status === 'passed' || command.status === 'skipped')
  return checksPassed && commandsPassed ? 'passed' : 'failed'
}

export function buildCreateReport(
  plan: CreateProjectPlan,
  checks: VerificationCheck[],
  commands: CommandResult[],
): EmpCreateReport {
  return {
    status: overallStatus(checks, commands),
    rootDir: plan.rootDir,
    apps: plan.apps.map(app => ({
      name: app.name,
      role: app.role,
      framework: app.framework,
      url: `http://localhost:${app.port}`,
    })),
    checks,
    commands,
  }
}

export async function writeCreateReport(report: EmpCreateReport): Promise<void> {
  await fs.writeFile(
    path.join(report.rootDir, 'emp-report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  )
}
