import path from 'node:path'
import {generateProject} from 'src/agent-create/generator'
import {parseCreateIntent} from 'src/agent-create/intent'
import {createProjectPlan} from 'src/agent-create/planner'
import {buildCreateReport, writeCreateReport} from 'src/agent-create/report'
import type {EmpCreateReport} from 'src/agent-create/types'
import {verifyGeneratedProject} from 'src/agent-create/verify'

export interface CreateCommandOptions {
  dir?: string
  dryRun?: boolean
  skipInstall?: boolean
  skipDev?: boolean
  skipVerify?: boolean
  json?: boolean
}

export function applyCreateReportExitStatus(
  report: EmpCreateReport,
  reportPath: string,
  json: boolean,
): void {
  if (report.status !== 'failed') {
    return
  }

  process.exitCode = 1

  if (json) {
    return
  }

  console.log('EMP 新项目创建失败')
  console.log(`目录: ${report.rootDir}`)
  console.log(`报告: ${reportPath}`)

  for (const check of report.checks.filter(item => item.status === 'failed')) {
    console.log(`失败检查: ${check.name} - ${check.message}`)
  }

  for (const command of report.commands.filter(item => item.status === 'failed')) {
    console.log(`失败命令: ${command.name} - ${command.command}`)
  }
}

export async function runCreateCommand(
  intentText: string,
  options: CreateCommandOptions = {},
): Promise<void> {
  const intent = parseCreateIntent(intentText)
  const targetDir = path.resolve(options.dir ?? 'emp-app')
  const plan = createProjectPlan(intent, {
    targetDir,
    dryRun: Boolean(options.dryRun),
    install: !options.skipInstall,
    dev: !options.skipDev,
    verify: !options.skipVerify,
    json: Boolean(options.json),
  })

  const files = await generateProject(plan, {dryRun: plan.options.dryRun})
  const checks =
    plan.options.verify && !plan.options.dryRun ? await verifyGeneratedProject(plan) : []
  const report = buildCreateReport(plan, checks, [])
  const reportPath = path.join(plan.rootDir, 'emp-report.json')

  if (!plan.options.dryRun) {
    await writeCreateReport(report)
  }

  if (plan.options.json) {
    console.log(
      JSON.stringify(
        {
          plan,
          files: files.map(file => file.path),
          report,
          reportPath,
        },
        null,
        2,
      ),
    )
    applyCreateReportExitStatus(report, reportPath, true)
    return
  }

  applyCreateReportExitStatus(report, reportPath, false)
  if (report.status === 'failed') {
    return
  }

  console.log(plan.options.dryRun ? 'EMP create dry-run 完成' : 'EMP 新项目创建完成')
  console.log(`目录: ${plan.rootDir}`)
  console.log(`文件数: ${files.length}`)
  if (!plan.options.dryRun) {
    console.log(`报告: ${reportPath}`)
  }
}
