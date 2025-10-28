import type {GlobalStore} from '@empjs/cli'
import path from 'path'
import { TailwindcssOptions } from './types.js'
export default (tailwindcssOptions: TailwindcssOptions = {}) => {
  return {
    name: '@empjs/plugin-tailwindcss',
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      const tailwindcssPath = require.resolve('tailwindcss/package.json')
      const installDir = path.dirname(tailwindcssPath)
      const tailwindcssEntry = path.join(installDir, 'index.css')
      // console.log('tailwindcssEntry:', tailwindcssEntry)

      const postcssPlugins = [
        // postcss-import 插件必须第一个加载，支持别名解析
        require('postcss-import')({
          resolve: (id: string) => {
            // console.log('postcss-import resolve:', id, 'installDir:', installDir)
            // 处理 tailwindcss 导入
            if (id === 'tailwindcss') {
              // console.log('Resolving tailwindcss to:', tailwindcssEntry)
              return tailwindcssEntry
            } else if (id.startsWith('tailwindcss/')) {
              const resolvedPath = path.join(installDir, id.replace('tailwindcss/', ''))
              // console.log('Resolving tailwindcss subpath to:', resolvedPath)
              return resolvedPath
            }
            // if (id.startsWith('src/')) {
            //   return path.join(store.appSrc, id.replace('src/', ''))
            // }
            return id
          },
        }),
        ['@tailwindcss/postcss', {}],
      ]
      if (store.empConfig.build.polyfill.browserslist && store.empConfig.build.polyfill.browserslist.length > 0) {
        postcssPlugins.push([
          'postcss-preset-env',
          {
            browsers: store.empConfig.build.polyfill.browserslist, // 针对安卓 7 的 Chrome
            stage: 1, // 启用较新的 CSS 特性并提供 polyfill
            features: {
              'is-pseudo-class': false, // 正确的特性名称
            },
          },
        ])
      }
      if (tailwindcssOptions.pxToRemOptions) {
        postcssPlugins.push([
          'postcss-pxtorem',
          {
            rootValue: 100, 
            unitPrecision: 3, 
            propList: ['*'], 
            selectorBlackList: [], 
            replace: true, 
            mediaQuery: true, 
            minPixelValue: 0, 
            ...tailwindcssOptions.pxToRemOptions,
          },
        ])
      }
      // console.log('postcssPlugins', JSON.stringify(postcssPlugins))
      chain.module
        .rule(store.chainName.rule.css)
        .set('type', 'css')
        .use('postcss')
        .loader(require.resolve('postcss-loader'))
        .options({
          postcssOptions: {
            plugins: postcssPlugins,
          },
        })
      chain.resolve.alias.set('tailwindcss$', tailwindcssEntry)
      chain.resolve.alias.set('tailwindcss', installDir)
    },
  }
}
