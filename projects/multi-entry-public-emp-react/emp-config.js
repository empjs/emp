const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {getPaths} = require('@efox/emp-cli/helpers/paths')
const paths = getPaths()
/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  webpackChain(config) {
    config.plugin('html-app').use(HtmlWebpackPlugin, [
      {
        title: 'app - demo',
        chunks: ['app'],
        filename: 'app/index.html',
        template: paths.template,
        favicon: path.favicon,
        files: {
          css: [],
          js: [],
        },
      },
    ])
    config.entry('app').add('src/index.ts').end()
  },
  moduleGenerator({webpackEnv}) {},
  async moduleFederation({webpackEnv}) {},
}
