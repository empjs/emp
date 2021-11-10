import {ConfigPluginOptions} from '@efox/emp/index'
import path from 'path'
import {vCompare} from './helper'
const PluginBabelReact = async ({wpChain, config}: ConfigPluginOptions) => {
  const projectResolve = (rpath: string) => path.resolve(config.root, rpath)
  const pkg = require(projectResolve('package.json'))
  const reactVersion = pkg.dependencies.react || pkg.devDependencies.react
  const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
  const isReact17 = vCompare(reactVersion, '17')
  const reactRumtime = isReact17 ? {runtime: 'automatic'} : {}
  // remove swc
  wpChain.module.rules.delete('scripts')
  // wpChain.module.rule('scripts').oneOfs.delete('swc')
  // console.log('config.module.rules', wpChain.module.rules)
  // test: /\.(js|jsx|ts|tsx)$/,
  // exclude: /(node_modules|bower_components)/, //不能加 exclude 否则会专程 arrow
  // babel config
  wpChain.module
    .rule('scripts')
    .test(/\.(js|jsx|ts|tsx)$/)
    .exclude.add(projectResolve('node_modules'))
    .add(projectResolve('bower_components'))
    .end()
    .use('babel')
    .loader(require.resolve('babel-loader'))
    .options({
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            useBuiltIns: 'entry',
            // debug: isDev,
            debug: false,
            corejs: 3,
            exclude: ['transform-typeof-symbol'],
            loose: true,
          },
        ],
        require.resolve('@babel/preset-typescript'),
        // [require.resolve('@babel/preset-react'), reactRumtime],
      ].filter(Boolean),
      plugins: [
        [require('@babel/plugin-syntax-top-level-await').default], //观察是否支持 toplvawait 的 es5支持
        [
          require.resolve('@babel/plugin-transform-runtime'),
          {
            corejs: false,
            helpers: true,
            version: require('@babel/runtime/package.json').version,
            regenerator: true,
            useESModules: false,
            // absoluteRuntime: true,
          },
        ],
        [require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
        [require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}],
      ],
    })
  // react config
  wpChain.module
    .rule('scripts')
    .use('babel')
    .tap(o => {
      // react
      o.presets.push([require.resolve('@babel/preset-react'), reactRumtime])
      // fast refresh
      config.mode === 'development' && config.server.hot && o.plugins.unshift(require.resolve('react-refresh/babel'))
      // antd
      isAntd && o.plugins.unshift(['import', {libraryName: 'antd', style: true}])
      return o
    })
  //  react hot reload
  if ((config.mode === 'development', config.server.hot)) {
    wpChain.plugin('reacthotloader').use(require('@pmmmwh/react-refresh-webpack-plugin'))
  }
  // react svgr
  wpChain.module.rule('svg').use('svgr').before('url').loader('@svgr/webpack')
  /* .options({babel: false})
    .end()
    .use('babel')
    .before('svgr')
    .loader(require.resolve('babel-loader'))
    .options({
      presets: [
        [require.resolve('@babel/preset-env')],
        [require.resolve('@babel/preset-typescript')],
        [require.resolve('@babel/preset-react'), reactRumtime],
      ],
    }) */
}

export default PluginBabelReact
