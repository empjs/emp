import type {GlobalStore} from '@empjs/cli'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
export type TailwindConfig = Parameters<typeof tailwindcss>[0]
export default (tailwindConfig?: TailwindConfig, options?: autoprefixer.Options) => {
  return {
    name: '@empjs/plugin-tailwindcss2',
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      const tailwindConfigDefault = {
        // content: [`${store.appSrc}/**/*.{html,js,ts,jsx,tsx}`],
        purge: [`${store.appSrc}/**/*.{html,js,ts,jsx,tsx}`],
        darkMode: false, // or 'media' or 'class'
        theme: {
          extend: {},
        },
        variants: {
          extend: {},
        },
        plugins: [],
      }
      tailwindConfig = store.deepAssign<TailwindConfig>(tailwindConfigDefault, tailwindConfig)
      // console.log('tailwindConfig', tailwindConfig)
      //
      chain.module
        .rule(store.chainName.rule.css)
        .set('type', 'css')
        .use('postcss')
        .loader(require.resolve('postcss-loader'))
        .options({
          postcssOptions: {
            plugins: [tailwindcss(tailwindConfig), autoprefixer(options)],
          },
          sourceMap: store.isDev,
        })
    },
  }
}
