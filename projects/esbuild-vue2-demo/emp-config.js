const Vue2 = require('@efox/emp-vue2')
const Esbuild = require('@efox/emp-esbuild')
const pkg = require('./package.json')
/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  compile: [Vue2, Esbuild],
  webpack() {
    return {
      devServer: {
        port: 8009,
      },
    }
  },
  moduleFederation: {
    name: 'esbuildVue2Base',
    exposes: {
      './Content': './src/components/Content',
    },
    shared: pkg.dependencies,
  },
  webpackChain(config) {
    config.plugin('html').tap(args => {
      args[0] = {
        ...args[0],
        ...{
          title: 'EMP Vue2 ESBUILD Base',
        },
      }
      return args
    })
  },
}
