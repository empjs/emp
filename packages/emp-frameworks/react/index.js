// const path = require('path')
const {resolveApp} = require('@efox/emp-cli/helpers/paths')
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
      o.presets.push(['@babel/preset-react', reactNewJsx])
      // fast refresh
      isDev && hot && o.plugins.unshift(require.resolve('react-refresh/babel'))
      // antd :TODO 增加 是否依赖 antd 判断
      isAntd && o.plugins.unshift(['import', {libraryName: 'antd', style: true}])
      // 只在 tsx 里面 触发 svg 不适用内置 babel
      /* o.plugins.unshift([
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: {
              ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
            },
          },
        },
      ]) */
      return o
    })

  config.module
    .rule('svg')
    .use('svgr')
    .before('url')
    .loader('@svgr/webpack')
    .options({babel: false})
    .end()
    .use('babel')
    .before('svgr')
    .loader('babel-loader')
    .options({presets: ['@babel/preset-env', '@babel/preset-typescript', ['@babel/preset-react', reactNewJsx]]})

  if (hot && isDev) {
    config.plugin('reacthotloader').use(require('@pmmmwh/react-refresh-webpack-plugin'))
  }

  return fn && fn(ec)
}
