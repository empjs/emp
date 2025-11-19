import type {GlobalStore} from '@empjs/cli'
import autoprefixer from 'autoprefixer'
import path from 'path'
import {TailwindcssOptions} from './types.js'
export default (
  tailwindcssOptions: TailwindcssOptions = {},
  autoprefixerOptions?: autoprefixer.Options,
  presetEnvFeature?: Record<string, boolean>,
) => {
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
            // 处理 tailwindcss 顶层与子路径导入
            if (id === 'tailwindcss') {
              return tailwindcssEntry
            }
            if (id.startsWith('tailwindcss/')) {
              return path.join(installDir, id.replace('tailwindcss/', ''))
            }
            return id
          },
        }),
        [require.resolve('@tailwindcss/postcss'), {}],
      ]
      if (store.empConfig.build.polyfill.browserslist && store.empConfig.build.polyfill.browserslist.length > 0) {
        postcssPlugins.push([
          'postcss-preset-env',
          {
            browsers: store.empConfig.build.polyfill.browserslist, // 针对安卓 7 的 Chrome
            stage: 1, // 启用较新的 CSS 特性并提供 polyfill
            features: presetEnvFeature,
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

      postcssPlugins.push(autoprefixer(autoprefixerOptions))
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
      // 交由 @tailwindcss/postcss 解析 CSS 导入，不在打包层设置 alias
      // chain.resolve.alias.set('tailwindcss$', tailwindcssEntry)
      // chain.resolve.alias.set('tailwindcss', installDir)
    },
  }
}
