import path from 'node:path'
import {generateProject} from 'src/agent-create/generator'
import {parseCreateIntent} from 'src/agent-create/intent'
import {createProjectPlan} from 'src/agent-create/planner'
import {buildCreateReport, writeCreateReport} from 'src/agent-create/report'
import {verifyGeneratedProject} from 'src/agent-create/verify'

export interface CreateCommandOptions {
  dir?: string
  dryRun?: boolean
  skipInstall?: boolean
  skipDev?: boolean
  skipVerify?: boolean
  json?: boolean
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

  const files = await generateProject(plan, {dryRun: Boolean(options.dryRun)})
  const checks = options.skipVerify || options.dryRun ? [] : await verifyGeneratedProject(plan)
  const report = buildCreateReport(plan, checks, [])
  const reportPath = path.join(plan.rootDir, 'emp-report.json')

  if (!options.dryRun) {
    await writeCreateReport(report)
  }

  if (options.json) {
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
    return
  }

  console.log(options.dryRun ? 'EMP create dry-run 完成' : 'EMP 新项目创建完成')
  console.log(`目录: ${plan.rootDir}`)
  console.log(`文件数: ${files.length}`)
  if (!options.dryRun) {
    console.log(`报告: ${reportPath}`)
  }
}
