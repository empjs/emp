// const path = require('path')
module.exports = fn => ec => {
  const {config, env, hot} = ec
  const isDev = env === 'development'
  config.module
    .rule('scripts')
    .use('babel')
    .tap(o => {
      // react
      o.presets.push(require('@babel/preset-react').default)
      // fast refresh
      isDev && hot && o.plugins.unshift(require.resolve('react-refresh/babel'))
      // antd :TODO 增加 是否依赖 antd 判断
      o.plugins.unshift(['import', {libraryName: 'antd', style: true}])
      // 只在 tsx 里面 触发 svg 不适用内置 babel
      o.plugins.unshift([
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: {
              ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
            },
          },
        },
      ])
      return o
    })

  if (hot && isDev) {
    config.plugin('reacthotloader').use(require('@pmmmwh/react-refresh-webpack-plugin'))
  }

  return fn && fn(ec)
}
