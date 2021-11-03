const ESbuild = require('@efox/emp-esbuild')
const pkg = require('./package.json')
/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  compile: [ESbuild],
  moduleFederation: {
    name: 'esbuildReactDemo',
    remotes: {},
    exposes: {
      './App': './src/App.tsx',
    },
    shared: pkg.dependencies,
  },
}
