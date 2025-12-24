import {defineConfig} from '@empjs/cli'
import pluginlightningcss, {postcss} from '@empjs/plugin-lightningcss'
import pluginReact from '@empjs/plugin-react'

// import pluginShare from '@empjs/share'
const port = 8000
export default defineConfig(store => {
  return {
    // autoDevBase: true,
    server: {
      // server: {
      //   type: 'https',
      //   options: {
      //     key: fs.readFileSync(path.join(__dirname, 'resource/emp.key')),
      //     cert: fs.readFileSync(path.join(__dirname, 'resource/emp.cert')),
      //   },
      // },
      port,
      open: false,
      // https: true,
    },
    html: {
      template: 'src/index.html',
      favicon: '',
    },
    // output: {
    //   publicPath: `http://dev-test.yy.com:8000/`,
    // },
    chain: config => {
      // const swcReactCompiler = require('@swc/react-compiler')
      // console.log('swcReactCompiler', swcReactCompiler)
      // config.plugin('swc-react-compiler').use(swcReactCompiler, [{}])
      config.optimization.splitChunks({
        cacheGroups: {
          // 完全自定义的规则
          react: {
            test: /node_modules[\\/](react|react-dom)/,
            name: 'lib-react',
            priority: 20,
          },
          antd: {
            test: /node_modules[\\/](antd|@ant-design)/,
            name: 'lib-antd',
            priority: 15,
          },
          common: {
            test: /node_modules/,
            name: 'lib-common',
            priority: 5,
          },
        },
      })
    },
    plugins: [
      pluginReact(),
      pluginlightningcss({
        transform: {
          visitor: getCssLoader('rem'),
        },
      }),
      // pluginShare(),
    ],
    debug: {
      // showPerformance: true,
      // showRsconfig: 'wp.json',
      // loggerLevel: 'debug',
      clearLog: false,
      // progress: false,
      // infrastructureLogging: {
      //   level: 'verbose', // 或 'log'，verbose 会输出更详细的日志
      //   colors: true, // 启用彩色日志，便于区分
      //   appendOnly: true, // 追加日志而不是覆盖，适合持续观察
      // },
      // cssChunkingPlugin: true,
    },
    build: {
      // polyfill: 'entry',
      polyfill: {
        entryCdn: `https://unpkg.com/@empjs/polyfill@0.0.1/dist/es.js`,
      },
      // browserslist: store.browserslistOptions.h5,
      sourcemap: true,
      // target: 'es2017',
      // minify: false,
    },
    entries: {
      'info.ts': {
        title: 'Info Page',
      },
      'work/index.ts': {
        title: 'work Page',
        template: 'src/work/index.html',
      },
    },
    resolve: {
      alias: {
        '~': store.resolve('src'),
      },
    },
    define: {
      buildhash: '1146428e',
    },
    css: {
      prifixName: 'v1',
    },
    // tsCheckerRspackPlugin: true,
    // cache: false,
  }
})
//
function getCssLoader(transformUnitFomat: 'rem' | 'vw') {
  return transformUnitFomat === 'rem'
    ? postcss.px_to_rem({
        rootValue: 10,
        excludeSelectors: [{type: 'class', name: 'cssModule'}],
      })
    : postcss.px_to_viewport({
        designWidth: 375,
      })
}
