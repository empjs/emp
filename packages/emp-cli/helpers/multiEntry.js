const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const globby = require('globby')
const fs = require('fs-extra')
const {resolveApp} = require('./paths')
const {logger} = require('./logger')
const entryConfig = function (config, paths, cwd, src, srcKey, op, isMinify) {
  const entryName = src.split('.')[0].replace(/\//gi, '_')
  const chunks = srcKey.replace(/\//gi, '_')
  const filename = `${srcKey}.html`
  config.entry(chunks).add(path.join(paths.appRoot, src)).end()
  const htmlOption = {
    title: '',
    template: paths.template,
    favicon: paths.favicon,
    files: {},
    filename,
    chunks: [chunks],
    minify: getMinifyOp(isMinify),
    ...op,
  }
  config.plugin(`html_${entryName}`).use(HtmlWebpackPlugin, [htmlOption])
}
const multiEntriesByConfig = function (config, paths, {root, router}, isMinify) {
  const cwd = root || 'src/pages'
  const pathsrcs = globby.sync(cwd)
  pathsrcs.map(src => {
    const srcKey = src.replace(`${cwd}/`, '').split('.')[0]
    const op = router ? router[srcKey] : {}
    entryConfig(config, paths, cwd, src, srcKey, op, isMinify)
    // logger.info(`多入口生成 ${src}`)
  })
}
const getMinifyOp = function (isMinify) {
  return isMinify
    ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    : false
}
module.exports = {multiEntriesByConfig, getMinifyOp}
