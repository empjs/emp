import wpChain from 'src/helper/wpChain'
import webpack from 'webpack'
// import FederatedStatsPlugin from 'webpack-federated-stats-plugin'
// import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import store from 'src/helper/store'
// import HtmlWebpackPlugin from 'html-webpack-plugin'
import Dotenv from 'dotenv-webpack'
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
// import ESLintPlugin from 'eslint-webpack-plugin'
import path from 'path'
import fs from 'fs-extra'
import {modeType} from 'src/types'
import DTSPlugin from './plugin/dts'
class WPPlugin {
  isDev = true
  constructor() {}
  private get dotenv() {
    const env = store.config.env || store.config.mode
    const options = {
      path: store.resolve(`.env${env ? '.' + env : ''}`),
      // path: './some.other.env', // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false, // load '.env.defaults' as the default values if empty.
    }
    return {
      plugin: Dotenv,
      args: [options],
    }
  }
  private get define() {
    type optionsType = {[key: string]: string | number | boolean | modeType}
    // 合并 mode env 参数
    let dlist: optionsType = {mode: store.config.mode, env: store.config.env || ''}
    // 合并 store.config.define
    if (store.config.define) {
      dlist = {...dlist, ...store.config.define}
    }
    //
    const options: optionsType = {}
    Object.keys(dlist).map(key => {
      if (store.isESM && store.config.useImportMeta) {
        options[`import.meta.env.${key}`] = JSON.stringify(dlist[key])
      } else {
        options[`process.env.${key}`] = JSON.stringify(dlist[key])
      }
    })
    // return defines
    return {
      plugin: webpack.DefinePlugin,
      args: [options],
    }
  }
  //
  async setup() {
    const isDev = store.config.mode === 'development'
    this.isDev = isDev
    const {define, dotenv} = this
    const config: any = {
      plugin: {
        define,
        dotenv,
      },
    }
    if (Object.keys(store.empShare.moduleFederation).length > 0) {
      config.plugin.mf = {
        plugin: webpack.container.ModuleFederationPlugin,
        args: [store.empShare.moduleFederation],
      }
      config.plugin.mfStats = {
        plugin: require('webpack-federated-stats-plugin'),
        args: [{filename: 'emp.json'}],
      }
    }
    // progress
    if (store.config.debug.progress !== false) {
      const options: any = {name: `[EMP]`}
      if (store.config.debug.profile) {
        options.reporters = ['fancy', 'profile']
        options.profile = true
      }
      config.plugin.progress = {
        plugin: require.resolve('webpackbar'),
        args: [options],
      }
    }
    //analyzer
    if (store.config.build.analyze) {
      config.plugin.analyzer = {
        plugin: require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
        args: [
          {
            // analyzerMode: 'static',
            reportFilename: 'report.html',
            openAnalyzer: true,
          },
        ],
      }
    }
    //
    const tsconfigJsonPath = store.resolve('tsconfig.json')
    const isTS = fs.existsSync(tsconfigJsonPath)
    // dts
    if (isTS && store.config.build.createTs) {
      config.plugin.dts = {
        plugin: DTSPlugin,
        args: [{build: store.config.build, mf: store.config.moduleFederation}],
      }
    }
    if (store.config.jsCheck) {
      // ts check
      if (isTS) {
        config.plugin.tsCheck = {
          plugin: require.resolve('fork-ts-checker-webpack-plugin'),
          args: [
            {
              async: isDev, // true dev环境下部分错误验证通过
              eslint: {
                enabled: true,
                files: `${store.appSrc}/**/*.{ts,tsx,js,jsx}`,
              },
              typescript: {
                configFile: tsconfigJsonPath,
                profile: false,
                typescriptPath: 'typescript',
                // configOverwrite: {
                //   compilerOptions: {skipLibCheck: true},
                // },
              },
              // logger: {issues: 'console'},
            },
          ],
        }
      } else {
        config.plugin.eslint = {
          plugin: require.resolve('eslint-webpack-plugin'),
          args: [
            {
              extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
              context: store.root,
              // overrideConfigFile: resolveApp('.eslintrc.js'),
              files: ['src/**/*.{ts,tsx,js,jsx}'],
              // eslintPath: require.resolve('eslint'),
              cache: true,
              cacheLocation: path.resolve(store.config.cacheDir, 'eslint'),
              fix: true,
              threads: true,
              lintDirtyModulesOnly: false,
            },
          ],
        }
      }
    }

    // if (store.config.build.emptyOutDir && !isDev) {
    //   const {CleanWebpackPlugin} = require('clean-webpack-plugin')
    //   config.plugin.clean = {
    //     plugin: CleanWebpackPlugin,
    //     args: [{cleanOnceBeforeBuildPatterns: [`!${store.typesOutputDir}/**`]}],
    //   }
    // }
    wpChain.merge(config)
  }
}
export default WPPlugin
