import assert from 'node:assert/strict'
import {mkdtemp, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {createJiti} from 'jiti'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const jiti = createJiti(import.meta.url, {
  alias: {
    src: path.join(repoRoot, 'packages/cli/src'),
  },
})
const loadConfig = jiti(path.join(repoRoot, 'packages/cli/src/helper/loadConfig.ts'))

assert.ok(loadConfig.DEFAULT_CONFIG_FILES.includes('emp-config.ts'))
assert.ok(loadConfig.DEFAULT_CONFIG_FILES.includes('emp.config.cts'))

const makeRoot = () => mkdtemp(path.join(tmpdir(), 'emp-config-discovery-'))

// 候选路径顺序：两套拼写共用一份列表，连字符版排在前面
{
  const root = await makeRoot()
  await writeFile(path.join(root, 'emp-config.js'), 'export default {}\n')

  const candidates = loadConfig.getEmpConfigCandidatePaths(root)
  assert.equal(candidates[0], path.join(root, 'emp-config.ts'))
  assert.ok(candidates.includes(path.join(root, 'emp-config.js')))
}

// 只存在一种拼写时按候选顺序命中，行为与改造前一致
{
  const dotRoot = await makeRoot()
  await writeFile(path.join(dotRoot, 'emp.config.ts'), 'export default {}\n')
  assert.equal(await loadConfig.findEmpConfigPath(dotRoot), path.join(dotRoot, 'emp.config.ts'))

  const dashRoot = await makeRoot()
  await writeFile(path.join(dashRoot, 'emp-config.ts'), 'export default {}\n')
  assert.equal(await loadConfig.findEmpConfigPath(dashRoot), path.join(dashRoot, 'emp-config.ts'))
}

// 两份都没有 -> undefined（CLI 走空配置默认值）
{
  const root = await makeRoot()
  assert.equal(await loadConfig.findEmpConfigPath(root), undefined)
}

// 两种拼写同时存在 -> 显式报错，并把两份路径都列出来（不再静默取第一份）
{
  const root = await makeRoot()
  await writeFile(path.join(root, 'emp-config.ts'), 'export default {}\n')
  await writeFile(path.join(root, 'emp.config.ts'), 'export default {}\n')

  await assert.rejects(
    () => loadConfig.findEmpConfigPath(root),
    error => {
      assert.match(error.message, /两种拼写/)
      assert.ok(error.message.includes('emp-config.ts'))
      assert.ok(error.message.includes('emp.config.ts'))
      return true
    },
  )
}

// 同一拼写族内的多份文件不报错（本次收口只覆盖跨拼写场景）
{
  const root = await makeRoot()
  await writeFile(path.join(root, 'emp.config.ts'), 'export default {}\n')
  await writeFile(path.join(root, 'emp.config.js'), 'export default {}\n')
  assert.equal(await loadConfig.findEmpConfigPath(root), path.join(root, 'emp.config.ts'))
}
