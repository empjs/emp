const {getPaths} = require('../../helpers/paths')
const {public, dist} = getPaths()
module.exports = (env, {hot, open, progress}) => {
  return {
    devServer: {
      bonjour: true,
      //   contentBase: path.join(__dirname, 'dist'),
      //   compress: true,
      //   host: '0.0.0.0',
      // host: 'localhost',
      host: 'local-ip',
      port: 8000,
      // contentBase: [public],
      // contentBasePublicPath :'/',//定义静态路径的别名
      // disableHostCheck: true,
      firewall: false,
      historyApiFallback: true,
      open: false,
      hot: hot === true,
      // useLocalIp: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
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
        {
          directory: dist,
          publicPath: '/',
          staticOptions: {
            setHeaders: function (res, path) {
              if (path.toString().endsWith('.d.ts')) res.set('Content-Type', 'application/javascript; charset=utf-8')
            },
          },
        },
      ],
      client: {
        overlay: true,
      },
      // overlay: !hot,
      // liveReload: !hot,
      // progress: progress === true,
      // stats: {
      //   colors: true,
      // },
    },
  }
}
