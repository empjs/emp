import store from 'src/helper/store'
import path from 'path'
import wpChain from 'src/helper/wpChain'
import fs from 'fs-extra'
type ReactRuntimeType = 'automatic' | 'classic'
class WPModule {
  reactRuntime?: ReactRuntimeType
  constructor() {}
  async setup() {
    this.setConfig()
    this.setScriptReactLoader()
  }
  private setConfig() {
    const config = {
      module: {
        // mini-css-extract-plugin 编译不过！
        /* generator: {
          asset: {
            publicPath: store.config.base,//:TODO 验证 publicPath auto 需要设置 '/' or ''
          },
        }, */
        rule: {
          // 解决 mjs 加载失败问题
          mjs: {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
          //
          scripts: {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /(node_modules|bower_components)/, //不能加 exclude 否则会专程 arrow
            use: {
              // 有 tsconfig.json 才执行 d.ts 生成
              // dts: fs.existsSync(store.resolve('tsconfig.json'))
              //   ? {
              //       loader: store.empResolve(path.resolve(store.empSource, 'webpack/loader/dts')),
              //       options: {
              //         name: store.empShare.moduleFederation.name,
              //         exposes: store.empShare.moduleFederation.exposes,
              //         typesOutputDir: path.resolve('dist', store.typesOutputDir),
              //         lib: !!store.config.build.lib,
              //         libName: store.config.build.lib?.name,
              //       },
              //     }
              //   : {},
              swc: {
                loader: store.empResolve(path.resolve(store.empSource, 'webpack/loader/swc')),
                options: store.config.build,
              },
            },
          },
        },
      },
    }
    wpChain.merge(config)
    //
    /* if (
      fs.existsSync(store.resolve('tsconfig.json'))
      //&&
      // store.empShare.moduleFederation.exposes &&
      // Object.keys(store.empShare.moduleFederation.exposes).length > 0
    ) {
      wpChain.module
        .rule('empShareTypes')
        .after('scripts')
        .test(/\.(ts|tsx)$/)
        .use('dts')
        .loader(store.empResolve(path.resolve(store.empSource, 'webpack/loader/dts')))
        .options({
          build: store.config.build,
          moduleFederation: store.config.moduleFederation,
          // name: store.empShare.moduleFederation.name,
          // exposes: store.empShare.moduleFederation.exposes,
          // typesOutputDir: store.config.build.typesOutDir,
          // lib: !!store.config.build.lib,
          // libName: store.config.build.lib?.name,
        })
    } */
  }

  private setScriptReactLoader() {
    const isDev = store.config.mode === 'development'
    //const isAntd = pkg.dependencies.antd || pkg.devDependencies.antd ? true : false
    // 增加插件支持
    if (isDev && store.config.server.hot && !!store.config.reactRuntime)
      wpChain.plugin('reactRefresh').use(require('@pmmmwh/react-refresh-webpack-plugin'))
  }
}
export default WPModule
