import assert from 'node:assert/strict'
import Chain from '../dist/index.js'

class ReusedPlugin {
  apply() {}
}

const chain = new Chain()
const plugin = new ReusedPlugin()

chain.plugin('first').use(plugin)
chain.plugin('second').use(plugin)

const config = chain.toConfig()

assert.equal(config.plugins.length, 2)
assert.equal(config.plugins[0], plugin)
assert.equal(config.plugins[1], plugin)
