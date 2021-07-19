/**
 * @type {import('@efox/emp-cli').EMPConfig}
 */
module.exports = {
  webpack() {
    return {
      devServer: {
        port: 8801,
      },
    }
  },
}
