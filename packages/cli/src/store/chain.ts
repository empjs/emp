import Chain from 'webpack-chain'
export {Chain}
export const chainName = {
  rule: {
    mjs: 'mjs',
    typescript: 'typescript',
    javascript: 'javascript',
    sourceMap: 'sourceMapLoader',
    inline: 'inline',
    raw: 'raw',
    svg: 'svg',
    image: 'image',
    font: 'fonts',
    svga: 'svga',
    sass: 'sass',
    less: 'less',
    css: 'css',
  },
  use: {
    swc: 'swc',
    sourceMap: 'sourceMapLoader',
    sass: 'sassLoader',
    less: 'lessLoader',
  },
  plugin: {
    tsCheckerRspackPlugin: 'TsCheckerRspackPlugin',
    bundleAnalyzer: 'bundleAnalyzerPlugin',
    define: 'definePlugin',
    copy: 'copyRspackPlugin',
    progress: 'progressPlugin',
    html: {
      prefix: 'html-plugin-',
    },
    rsdoctor: 'rsdoctor',
    sourceMapDevTool: 'sourceMapDevTool',
  },
  minimizer: {
    minJs: 'minJs',
    minCss: 'minCss',
  },
}
