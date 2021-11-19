import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import store from 'src/helper/store'
import wpChain from 'src/helper/wpChain'
//
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/
//
class WPCSSOptions {
  splitCss: boolean
  isDev: boolean
  localIdentName: string
  isModules = false
  publicPath: string
  constructor({splitCss, isDev, publicPath}: any) {
    this.splitCss = splitCss
    this.isDev = isDev
    this.publicPath = publicPath
    this.localIdentName = isDev ? '[path][name]-[local]-[hash:base64:5]' : '[local]-[hash:base64:5]'
  }
  get isStyleLoader() {
    const {splitCss, isDev} = this
    if (!splitCss) return true
    if (isDev) return true
    return false
  }
  get isMiniCss() {
    const {splitCss, isDev} = this
    if (splitCss && !isDev) return true
    return false
  }
  get style() {
    const {publicPath} = this
    return this.isStyleLoader
      ? {
          loader: require.resolve('style-loader'),
          options: {},
        }
      : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath, //修复css 绝对路径的问题
          },
        }
  }
  get css() {
    const {localIdentName, isModules} = this
    return {
      loader: require.resolve('css-loader'),
      options: {
        modules: isModules ? {localIdentName} : isModules,
      },
    }
  }
  get sass() {
    const {isDev} = this
    return {
      loader: require.resolve('sass-loader'),
      options: {
        implementation: require('sass'),
        sourceMap: isDev,
      },
    }
  }
  get less() {
    const {isModules} = this
    return isModules
      ? {loader: require.resolve('less-loader')}
      : {
          loader: require.resolve('less-loader'),
          options: {
            lessOptions: {javascriptEnabled: true},
          },
        }
  }
  get postcss() {
    return {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          hideNothingWarning: true,
        },
      },
    }
  }
  loaders(isModules = false, parser?: 'sass' | 'less') {
    this.isModules = isModules
    const {style, css, postcss, sass, less} = this
    const opt: any = {
      style,
      css,
      postcss,
    }
    if (parser && parser === 'sass') {
      opt.sass = sass
    } else if (parser && parser === 'less') {
      opt.less = less
    }
    return opt
  }
}
//
export const wpCSS = () => {
  const isDev = store.wpo.mode === 'development'
  const {splitCss} = store.config
  const wpCssOptions = new WPCSSOptions({isDev, splitCss, publicPath: store.config.base})
  //
  const config = {
    module: {
      rule: {
        css: {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: wpCssOptions.loaders(),
        },
        cssModule: {
          test: cssModuleRegex,
          use: wpCssOptions.loaders(true),
        },
        sassModule: {
          test: sassModuleRegex,
          use: wpCssOptions.loaders(true, 'sass'),
        },
        sass: {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: wpCssOptions.loaders(false, 'sass'),
        },
        less: {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: wpCssOptions.loaders(false, 'less'),
        },
        lessModule: {
          test: lessModuleRegex,
          use: wpCssOptions.loaders(true, 'less'),
        },
      },
    },
  }
  //[css minify]
  if (wpCssOptions.isMiniCss) {
    if (store.config.build.minify === true) {
      wpChain.optimization.minimizer('CssMinimizerPlugin').use(CssMinimizerPlugin, [
        {
          parallel: true,
          // sourceMap: false,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: {removeAll: true},
              },
            ],
          },
        },
      ])
    }
    wpChain.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
      {
        ignoreOrder: true,
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        /**
            experimentalUseImportModule
            https://github.com/webpack-contrib/mini-css-extract-plugin#experimentalUseImportModule
            Use an experimental webpack API to execute modules instead of child compilers.
            This improves performance and memory usage a lot, but isn't as stable as the normal approach.
            When combined with experiments.layers, this adds a layer option to the loader options to specify the layer of the css execution.
            You need to have at least webpack 5.33.2.
           */
        // experimentalUseImportModule: true,
      },
    ])
  }
  wpChain.merge(config)
}
