#!/usr/bin/env node
import {spawn} from 'node:child_process'
import {fileURLToPath} from 'node:url'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const extraArgs = process.argv.slice(2)
const watchHeaded = extraArgs.includes('--watch-headed')
const forwardedArgs = extraArgs.filter(arg => arg !== '--watch-headed')
const browserTestGlob = 'test/apps/browser/**/*.browser.ts'

function run(cmd, args) {
  console.log(`$ ${[cmd, ...args].join(' ')}`)
  const child = spawn(cmd, args, {
    cwd: repoRoot,
    env: {...process.env, FORCE_COLOR: '0', EMP_BROWSER_SCOPE: 'apps'},
    stdio: 'inherit',
  })

  const forwardSignal = signal => {
    if (child.exitCode === null) child.kill(signal)
  }
  process.once('SIGINT', () => forwardSignal('SIGINT'))
  process.once('SIGTERM', () => forwardSignal('SIGTERM'))

  child.on('exit', code => {
    process.exit(code ?? 1)
  })
  child.on('error', error => {
    console.error(error)
    process.exit(1)
  })
}

if (watchHeaded) {
  run('corepack', ['pnpm', 'exec', 'rstest', 'watch', '--browser', '--browser.name', 'chromium', '--browser.headless=false', ...forwardedArgs])
} else {
  // Rstest treats positional args as test-name filters in browser mode; app-only include comes from EMP_BROWSER_SCOPE.
  void browserTestGlob
  run('corepack', [
    'pnpm',
    'exec',
    'rstest',
    'run',
    '--config',
    'rstest.config.ts',
    '--browser',
    '--browser.name',
    'chromium',
    '--browser.headless=false',
    ...forwardedArgs,
  ])
}
