const fs = require('fs')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')

module.exports =
  (fn, {creatorPort = 7456, empJs = []}) =>
  ec => {
    const {config, env} = ec
    // creator服务
    const creatorServerUrl = `http://localhost:${creatorPort}/`
    // dev
    if (env === 'development') {
      config.merge({
        devServer: {
          // 将游戏资源请求转发回creator服务
          proxy: [
            {
              context: ['/app/**', '/res/**', '/**/**.js', '/**.json', '/socket.io/**'],
              target: creatorServerUrl,
            },
          ],
          // 静态资源设置public
          contentBase: path.resolve('./', 'public'),
        },
      })
    }
    config.plugin('html').tap(args => {
      args[0] = {
        ...args[0],
        ...{
          // 使用模版字符串作为webpack模版
          templateContent: async () => {
            let html
            const jsStr = empJs.map(item => `<script src="${item}"></script>`).join('')
            if (env === 'development') {
              // 通过axios抓取creator服务模版
              html = (await axios.get(creatorServerUrl)).data
            } else {
              // 通过fs读取creator打包后的index.html
              html = fs.readFileSync('./build/web-mobile/index.html')
            }
            let $ = cheerio.load(html)
            // 插入远程emp资源
            $('head').append(jsStr)
            return $.html()
          },
          chunksSortMode: function (chunk1, chunk2) {
            return -1
          },
        },
      }
      return args
    })

    return fn && fn(ec)
  }
