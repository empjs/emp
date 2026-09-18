import assert from 'node:assert/strict'

process.env.EMP_LEGACY_HTTP2 = 'true'
process.env.NODE_ENV = ''
process.env.ENV = ''

// 弃置字段的告警走 logger.warn -> console.warn，在 setup 前挂上收集器
const warnings = []
const originalWarn = console.warn
console.warn = (...args) => {
  warnings.push(args.join(' '))
}

const {store} = await import('@empjs/cli')
await store.setup('build', {})

console.warn = originalWarn

assert.equal(store.empConfig.build.format, 'script')
assert.deepEqual(store.empConfig.build.targets, ['Chrome >= 60'])
assert.equal(store.empConfig.css.prefixName, 'legacy')
assert.equal(store.empConfig.debug.showPerformance, false)
assert.equal(store.empConfig.debug.newTreeshaking, false)
assert.equal(store.rsConfig.target, 'browserslist:Chrome >= 60')
assert.equal(store.rsConfig.output.module, false)
assert.equal(store.rsConfig.optimization.splitChunks.cacheGroups.react.name, 'common-react')

// @empjs/plugin-postcss 是全仓唯一把 postcss-loader 挂进真实构建的消费者
//（plugin-lightningcss 链路按设计不挂，见 test/plugin-config-shape.test.ts）。
// 断言插件确实写进了已解析的 rspack 配置，并且 postcssOptions 原样透传。
const moduleConfig = JSON.stringify(store.rsConfig.module)
assert.ok(moduleConfig.includes('postcss-loader'), 'postcss-loader 未进入已解析的 rspack 配置')
assert.ok(moduleConfig.includes('postcss-pxtorem'), 'postcssOptions 未透传到已解析的 rspack 配置')

// server.http2 在 rspack 迁移后已无消费方（https/http2 由 dev server 的 server.type 决定）。
// 它仍然被接受——上面的 setup 不报错就是证据——但不得泄漏进 dev-server 配置，
// 也不再有只写的 store.server.httpsType 死后端字段。
assert.equal('httpsType' in store.server, false, 'store.server.httpsType 是只写的死后端字段，应已删除')
assert.equal(store.empConfig.server.http2, undefined, 'server.http2 不应泄漏进 dev-server 配置')
assert.equal(store.empConfig.server.port, 8105, 'server 的其余配置必须原样保留')
assert.ok(
  warnings.some(warning => warning.includes('server.http2')),
  `未发出 server.http2 弃置告警，实际捕获: ${JSON.stringify(warnings)}`,
)

// 显式写成 false 的弃置字段不应触发告警：用户要求的「不启用」本就被满足，喊叫只会成为噪声
assert.equal(
  warnings.some(warning => warning.includes('showPerformance') || warning.includes('newTreeshaking')),
  false,
  `取值为 false 时不应告警，实际捕获: ${JSON.stringify(warnings)}`,
)
