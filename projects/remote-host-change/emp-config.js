const ExternalTemplateRemotesPlugin = require('./ExternalTemplateRemotesPlugin')
/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  webpackChain(config) {
    config.plugin('ExternalTemplateRemotesPlugin').use(ExternalTemplateRemotesPlugin)
  },
  moduleFederation: {
    remotes: {
      // '@emp/demo1': 'demo1@http://localhost:8001/emp.js',
      '@emp/demo1': 'demo1@[window.demo1Url]/emp.js',
    },
  },
}
