/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  webpack() {
    return {
      devServer: {
        port: 8002,
      },
    }
  },
  async moduleFederation() {
    return {
      name: 'demo2',
      filename: 'emp.js',
      remotes: {
        '@emp/demo1': 'demo1@http://localhost:8001/emp.js',
      },
      exposes: {
        './components/Hello': 'src/components/Hello',
        './helper': 'src/helper',
      },
      shared: ['react', 'react-dom'],
    }
  },
}
