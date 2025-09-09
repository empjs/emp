import type {GlobalStore} from '@empjs/cli'
import path from 'path'
export default () => {
  return {
    name: '@empjs/plugin-tailwindcss',
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      const tailwindcssPath = require.resolve('tailwindcss/package.json')
      const installDir = path.dirname(tailwindcssPath)
      const tailwindcssEntry = path.join(installDir, 'index.css')

      const postcssPlugins = [
        // postcss-import 插件必须第一个加载，支持别名解析
        require('postcss-import')({
          resolve: (id: string) => {
            // console.log('postcss-import resolve:', id, 'installDir:', installDir)
            // 处理 tailwindcss 导入 - 根据 package.json exports 配置
            if (id === 'tailwindcss') {
              // console.log('Resolving tailwindcss to:', tailwindcssEntry)
              return tailwindcssEntry
            } else if (id.startsWith('tailwindcss/')) {
              const subPath = id.replace('tailwindcss/', '')
              const resolvedPath = path.join(installDir, subPath)
              // console.log('Resolving tailwindcss subpath:', id, 'to:', resolvedPath)
              return resolvedPath
            }
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
      // 设置 webpack alias 指向 tailwindcss 模块目录，而不是 CSS 文件
      chain.resolve.alias.set('tailwindcss', installDir)
    },
  }
}
