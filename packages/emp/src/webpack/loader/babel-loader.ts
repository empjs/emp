import path from 'path'
import store from 'src/helper/store'
const root = process.cwd()
const projectResolve = (rpath: string) => path.resolve(root, rpath)
const pkg = require(projectResolve('package.json'))
pkg.dependencies = pkg.dependencies || {}
pkg.devDependencies = pkg.devDependencies || {}
const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
//
const absoluteRuntimePath = path.dirname(require.resolve('@babel/runtime/package.json'))
const babelRuntimeVersion = require('@babel/runtime/package.json').version
//
type BabelLoaderTypes = {
  loader: any
  options: {
    presets: any[]
    plugins: any[]
  }
}
const babelLoader = () => {
  // console.log(`store.config.reactRuntime`, store.config.reactRuntime)
  const config = store.config
  const o: BabelLoaderTypes = {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            // useBuiltIns: 'entry',
            // useBuiltIns: 'usage',
            // debug: true,
            useBuiltIns: store.config.moduleTransform.useBuiltIns,
            corejs: 3,
            exclude: ['transform-typeof-symbol'],
            loose: true,
          },
        ],
        require.resolve('@babel/preset-typescript'),
        // [require.resolve('@babel/preset-react'), reactRumtime],
      ],
      plugins: [
        [require('@babel/plugin-syntax-top-level-await').default], //观察是否支持 toplvawait 的 es5支持
        [
          require.resolve('@babel/plugin-transform-runtime'),
          {
            corejs: false,
            helpers: true,
            version: babelRuntimeVersion,
            regenerator: true,
            absoluteRuntime: absoluteRuntimePath,
          },
        ],
        /**
         * This option enables support for the "legacy" decorator proposal.
         * You can enable it in Babel using the @babel/plugin-proposal-decorators plugin,
         * but please be aware, there are some minor differences.
         */
        [require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
        // 'loose' mode configuration must be the same for
        // * @babel/plugin-proposal-class-properties
        // * @babel/plugin-proposal-private-methods
        // * @babel/plugin-proposal-private-property-in-object
        // (when they are enabled)
        [require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}],
        [require.resolve('@babel/plugin-proposal-private-methods'), {loose: true}],
        [require.resolve('@babel/plugin-proposal-private-property-in-object'), {loose: true}],
        /**
         * When set to true, the transform will only remove type-only imports (introduced in TypeScript 3.8).
         * This should only be used if you are using TypeScript >= 3.8.
         */
        [require.resolve('@babel/plugin-transform-typescript'), {onlyRemoveTypeImports: true}],
      ],
    },
  }
  // react
  if (store.config.reactRuntime) {
    const reactPersets: any = {
      runtime: store.config.reactRuntime,
      development: config.mode === 'development',
    }
    if (store.config.reactRuntime !== 'automatic') {
      reactPersets.useBuiltIns = true
    }
    o.options.presets.push([require.resolve('@babel/preset-react'), reactPersets])
    // fast refresh
    config.mode === 'development' &&
      config.server.hot &&
      o.options.plugins.unshift(require.resolve('react-refresh/babel'))
  }
  // antd
  if (isAntd && store.config.moduleTransform.antdTransformImport)
    o.options.plugins.unshift([require.resolve('babel-plugin-import'), {libraryName: 'antd', style: true}])
  return o
}

export default babelLoader
export const compileType = 'babel'
export const loader = babelLoader
