import assert from 'node:assert/strict'

process.env.EMP_LEGACY_HTTP2 = 'true'
process.env.NODE_ENV = ''
process.env.ENV = ''

const {store} = await import('@empjs/cli')
await store.setup('build', {})

assert.equal(store.empConfig.build.format, 'script')
assert.deepEqual(store.empConfig.build.targets, ['Chrome >= 60'])
assert.equal(store.empConfig.css.prefixName, 'legacy')
assert.equal(store.empConfig.debug.showPerformance, false)
assert.equal(store.empConfig.debug.newTreeshaking, false)
assert.equal(store.rsConfig.target, 'browserslist:Chrome >= 60')
assert.equal(store.rsConfig.output.module, false)
assert.equal(store.rsConfig.optimization.splitChunks.cacheGroups.react.name, 'common-react')
assert.equal(store.server.httpsType, 'h2')
