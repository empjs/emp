import type {GlobalStore} from '@empjs/cli'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
export type TailwindConfig = Parameters<typeof tailwindcss>[0]
export default (tailwindConfig?: TailwindConfig, options?: autoprefixer.Options) => {
  return {
    name: '@empjs/plugin-tailwindcss3',
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      const tailwindConfigDefault = {
        content: [`${store.appSrc}/**/*.{html,js,ts,jsx,tsx}`],
      }
      const resolvedTailwindConfig = Object.assign({}, tailwindConfigDefault, tailwindConfig)
      // console.log('tailwindConfig', tailwindConfig)
      //
      chain.module
        .rule(store.chainName.rule.css)
        .set('type', 'css')
        .use('postcss')
        .loader(require.resolve('postcss-loader'))
        .options({
          postcssOptions: {
            plugins: [tailwindcss(resolvedTailwindConfig), autoprefixer(options)],
          },
          sourceMap: store.isDev,
        })
    },
  }
}
