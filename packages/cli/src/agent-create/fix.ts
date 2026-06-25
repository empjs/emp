import fs from 'node:fs/promises'
import path from 'node:path'
import {buildCreateReport} from './report'
import type {CreateProjectPlan, FixResult, VerificationCheck} from './types'

async function writeReportIfMissing(plan: CreateProjectPlan): Promise<boolean> {
  const report = buildCreateReport(plan, [], [])
  const reportPath = path.join(report.rootDir, 'emp-report.json')

  await fs.mkdir(path.dirname(reportPath), {recursive: true})

  try {
    await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, {
      encoding: 'utf8',
      flag: 'wx',
    })
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      return false
    }

    throw error
  }
}

export async function fixGeneratedProject(
  plan: CreateProjectPlan,
  checks: VerificationCheck[],
): Promise<FixResult[]> {
  const shouldFixReport = checks.some(check => check.name === 'report' && check.status === 'failed')

  if (!shouldFixReport) {
    return []
  }

  if (!(await writeReportIfMissing(plan))) {
    return [{name: 'report', status: 'skipped', message: 'emp-report.json 已存在，未覆盖'}]
  }

  return [{name: 'report', status: 'applied', message: '已重新生成 emp-report.json'}]
}
