const {getPaths} = require('../../helpers/paths')
const {public} = getPaths()
// console.log('public', public)
module.exports = (env, {hot, open}) => {
  const openBrowser = require('react-dev-utils/openBrowser')
  return {
    devServer: {
      //   contentBase: path.join(__dirname, 'dist'),
      //   compress: true,
      //   host: '0.0.0.0',
      // host: 'localhost',
      port: 8000,
      contentBase: [public],
      // contentBasePublicPath :'/',//定义静态路径的别名
      // disableHostCheck: true,
      historyApiFallback: true,
      // open: open === true,
      hot: hot === true,
      after() {
        if (open === true) {
          let url = this.host || 'localhost'
          if (this.port != 80) url += ':' + this.port
          const protocol = this.https ? 'https' : 'http'
          openBrowser(`${protocol}://${url}`)
        }
      },
      stats: {
        colors: true,
      },
    },
  }
}
