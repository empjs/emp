import {spawnSync} from 'node:child_process'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const websiteDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageManager = process.env.npm_execpath
if (!packageManager) {
  throw new Error('请通过 pnpm --filter @empjs/offical build 构建官网。')
}

function run(args) {
  const result = spawnSync(process.execPath, [packageManager, ...args], {
    cwd: resolve(websiteDir, '..'),
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status || 1)
}

// 全新安装的 workspace 尚未生成本地包入口，按依赖顺序构建。
run(['--filter', '@empjs/chain', 'build'])
run(['--filter', '@empjs/cli', 'build'])
run(['--filter', '@empjs/plugin-react', '--filter', '@empjs/share', '--filter', '@empjs/bridge-*', 'build'])
run([
  '--filter',
  'adapter-app',
  'build',
  '-ev',
  'base=/examples/bridge/',
  '-ev',
  `outDir=${resolve(websiteDir, 'docs/public/examples/bridge')}`,
])
