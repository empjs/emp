import type {GlobalStore} from '@empjs/cli'
import path from 'path'
export default () => {
  return {
    name: '@empjs/plugin-tailwindcss',
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      const tailwindcssPath = require.resolve('tailwindcss/package.json')
      const installDir = path.dirname(tailwindcssPath)
      const postcssPlugins = [
        // 添加 postcss-import 插件支持别名解析
        require('postcss-import')({
          resolve: (id: string) => {
            // console.log('postcss-import', store.resolve, id)
            // 处理 tailwindcss 导入
            if (id === 'tailwindcss') {
              return path.join(installDir, 'index.css')
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
      chain.resolve.alias.set('tailwindcss', installDir)
    },
  }
}
