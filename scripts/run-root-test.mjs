#!/usr/bin/env node
import {spawn} from 'node:child_process'
import {existsSync} from 'node:fs'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {ROOT_RSTEST_CONFIG, ROOT_TEST_TARGET_ORDER, ROOT_TEST_TARGETS} from './root-test-targets.mjs'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const [targetName, ...rawExtraArgs] = process.argv.slice(2)
const extraArgs = rawExtraArgs[0] === '--' ? rawExtraArgs.slice(1) : rawExtraArgs

const quote = part => (/[\s"'$]/.test(part) ? JSON.stringify(part) : part)
const commandText = command => command.map(quote).join(' ')

const runCommand = command =>
  new Promise((resolve, reject) => {
    console.log(`$ ${commandText(command)}`)
    const child = spawn(command[0], command.slice(1), {cwd: repoRoot, stdio: 'inherit'})

    child.on('error', reject)
    child.on('exit', code => {
      if (code === 0) resolve()
      else reject(new Error(`Command failed with exit code ${code ?? 1}: ${commandText(command)}`))
    })
  })

const printUsage = () => {
  console.log('Usage: node scripts/run-root-test.mjs <target> [rstest args...]')
  console.log(`Targets: ${Object.keys(ROOT_TEST_TARGETS).join(', ')}`)
}

const validateFiles = (label, files) => {
  const missingFiles = [ROOT_RSTEST_CONFIG, ...files].filter(file => !existsSync(join(repoRoot, file)))

  if (missingFiles.length > 0) {
    console.error(`Root test target "${label}" references missing files:`)
    for (const file of missingFiles) console.error(`- ${file}`)
    return false
  }
  return true
}

const runRstest = (label, files) =>
  new Promise((resolve, reject) => {
    if (!validateFiles(label, files)) {
      reject(new Error(`Root test target "${label}" is invalid`))
      return
    }

    const command = ['corepack', 'pnpm', 'exec', 'rstest', 'run', '--config', ROOT_RSTEST_CONFIG, ...files, ...extraArgs]
    runCommand(command).then(resolve, () => reject(new Error(`Root test target "${label}" failed`)))
  })

const main = async () => {
  if (!targetName || targetName === '--help' || targetName === '-h') {
    printUsage()
    process.exitCode = targetName ? 0 : 1
    return
  }

  if (!ROOT_TEST_TARGETS[targetName]) {
    console.error(`Unknown root test target: ${targetName}`)
    printUsage()
    process.exitCode = 1
    return
  }

  if (targetName === 'all') {
    for (const target of ROOT_TEST_TARGET_ORDER) {
      await runRstest(target, ROOT_TEST_TARGETS[target])
    }
    return
  }

  if (targetName === 'tsconfig') {
    await runCommand(['corepack', 'pnpm', 'test:ts7:prepare'])
  }

  await runRstest(targetName, ROOT_TEST_TARGETS[targetName])
}

main().catch(error => {
  console.error(error.message)
  process.exitCode = 1
})
