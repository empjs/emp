// const path = require('path')
const {resolveApp} = require('../../helpers/paths')
const packageJson = require(resolveApp('package.json')) || {}
const {versionStringCompare} = require('./helper')
packageJson.dependencies = packageJson.dependencies || {}
packageJson.devDependencies = packageJson.devDependencies || {}
const reactVersion = packageJson.dependencies.react || packageJson.devDependencies.react
const isAntd = packageJson.dependencies.antd || packageJson.devDependencies.antd ? true : false
const isReact17 = versionStringCompare(reactVersion, '17')
const reactNewJsx = isReact17 ? {runtime: 'automatic'} : {}
module.exports = fn => ec => {
  const {config, env, hot} = ec
  const isDev = env === 'development'
  config.module
    .rule('scripts')
    .use('babel')
    .tap(o => {
      // react
      o.presets.push([require.resolve('@babel/preset-react'), reactNewJsx])
      // fast refresh
      isDev && hot && o.plugins.unshift(require.resolve('react-refresh/babel'))
      // antd :TODO 增加 是否依赖 antd 判断
      isAntd && o.plugins.unshift(['import', {libraryName: 'antd', style: true}])
      return o
    })

  config.module
    .rule('svg')
    .use('svgr')
    .before('url')
    .loader(require.resolve('@svgr/webpack'))
    .options({babel: false})
    .end()
    .use('babel')
    .before('svgr')
    .loader(require.resolve('babel-loader'))
    .options({
      presets: [
        require.resolve('@babel/preset-env'),
        require.resolve('@babel/preset-typescript'),
        [require.resolve('@babel/preset-react'), reactNewJsx],
      ],
    })

  if (hot && isDev) {
    config.plugin('reacthotloader').use(require('@pmmmwh/react-refresh-webpack-plugin'))
  }

  return fn && fn(ec)
}
