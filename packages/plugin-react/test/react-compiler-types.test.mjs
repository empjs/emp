import {execFileSync} from 'node:child_process'
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

const repoRoot = new URL('../../..', import.meta.url).pathname
const tempDir = mkdtempSync(join(tmpdir(), 'emp-plugin-react-types-'))

try {
  writeFileSync(
    join(tempDir, 'index.ts'),
    [
      `import type {PluginReactType} from '${repoRoot}/packages/plugin-react/dist/types'`,
      '',
      'const booleanOptions: PluginReactType = {reactCompiler: true}',
      "const objectOptions: PluginReactType = {reactCompiler: {target: '19', runtimeModule: 'react/compiler-runtime'}}",
      'void booleanOptions',
      'void objectOptions',
      '',
    ].join('\n'),
  )
  writeFileSync(
    join(tempDir, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          noEmit: true,
          skipLibCheck: true,
          strict: true,
          target: 'ES2022',
        },
        include: ['index.ts'],
      },
      null,
      2,
    )}\n`,
  )

  execFileSync('corepack', ['pnpm', 'exec', 'tsc', '--pretty', 'false', '--project', join(tempDir, 'tsconfig.json')], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  })
} catch (error) {
  const result = error
  process.stderr.write([result.message, result.stdout, result.stderr].filter(Boolean).join('\n'))
  process.exit(1)
} finally {
  rmSync(tempDir, {force: true, recursive: true})
}
