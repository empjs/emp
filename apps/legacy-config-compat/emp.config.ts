import {defineConfig} from '@empjs/cli'
import pluginPostcss, {postcss} from '@empjs/plugin-postcss'
import pluginReact from '@empjs/plugin-react'

export default defineConfig({
  appSrc: 'src',
  appEntry: 'index.tsx',
  html: {
    title: 'EMP legacy configuration compatibility',
    template: 'src/index.html',
    favicon: '',
  },
  server: {
    port: 8105,
    open: false,
    ...(process.env.EMP_LEGACY_HTTP2 === 'true' ? {http2: true} : {}),
  },
  build: {
    useESM: false,
    devtool: 'source-map',
    polyfill: {
      mode: 'entry',
      splitChunks: true,
      browserslist: ['Chrome >= 60'],
    },
  },
  css: {
    prifixName: 'legacy',
  },
  debug: {
    clearLog: false,
    showPerformance: false,
    newTreeshaking: false,
  },
  plugins: [
    pluginReact({
      splickChunks: true,
    }),
    // 本项目是全仓唯一真实消费 @empjs/plugin-postcss 的地方：其他 CSS 应用都走
    // @empjs/plugin-lightningcss，那条链路按设计不会挂 postcss-loader（见
    // test/plugin-config-shape.test.ts）。没有这个消费者，postcss-loader 在真实构建里
    // 的执行路径就完全没有回归网，只剩链式形状断言。
    pluginPostcss({
      postcssOptions: {
        plugins: [postcss.pxtorem({rootValue: 16})],
      },
    }),
  ],
})
