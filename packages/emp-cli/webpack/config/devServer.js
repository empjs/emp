const {getPaths} = require('../../helpers/paths')
const {public} = getPaths()
module.exports = (env, {hot, open, progress}) => {
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
      progress: progress === true,
      stats: {
        colors: true,
      },
    },
  }
}
