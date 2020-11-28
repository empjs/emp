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
      // contentBase: [public],
      // contentBasePublicPath :'/',//定义静态路径的别名
      // disableHostCheck: true,
      firewall: false,
      historyApiFallback: true,
      // open: open === true,
      hot: hot === true,
      // useLocalIp: true,
      static: [
        {
          directory: public,
          // staticOptions: {},
          // Don't be confused with `dev.publicPath`, it is `publicPath` for static directory
          // Can be:
          // publicPath: ['/static-public-path-one/', '/static-public-path-two/'],
          publicPath: '/',
          // Can be:
          // serveIndex: {} (options for the `serveIndex` option you can find https://github.com/expressjs/serve-index)
          // serveIndex: true,
          // Can be:
          // watch: {} (options for the `watch` option you can find https://github.com/paulmillr/chokidar)
          // watch: true,
        },
      ],
      // overlay: !hot,
      // progress: progress === true,
      // stats: {
      //   colors: true,
      // },
    },
  }
}
