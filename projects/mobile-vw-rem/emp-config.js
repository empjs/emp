import {defineConfig} from '@empjs/cli'
import lightningcssPlugin, {postcss} from '@empjs/plugin-lightningcss'
import pluginPostcss, {postcss as postcssPlugins} from '@empjs/plugin-postcss'
import pluginReact from '@empjs/plugin-react'
const cssSelector = {
  lightningcss: true,
  vw: false,
}
console.log(`use ${cssSelector.lightningcss ? `lightningcss` : `postcss`}`)
export default defineConfig(store => {
  //
  const visitor = !cssSelector.vw ? postcss.pxtorem() : postcss.pxtovw()
  const postcssunit = () => (!cssSelector.vw ? postcssPlugins.pxtorem() : postcssPlugins.pxtovw())
  //
  const plugins = [pluginReact()]
  //
  if (cssSelector.lightningcss) {
    plugins.push(
      lightningcssPlugin({
        transform: {
          visitor,
        },
      }),
    )
  } else {
    plugins.push(
      pluginPostcss({
        postcssOptions: {
          plugins: [postcssPlugins.autoprefixer(), postcssunit()],
        },
      }),
    )
  }
  //
  return {
    css: {
      sass: {
        mode: 'modern',
      },
    },
    html: {
      title: 'mobile-vw',
    },
    server: {
      // port: 2222,
    },
    debug: {
      clearLog: false,
      showRsconfig: false,
    },
    plugins,
  }
})
