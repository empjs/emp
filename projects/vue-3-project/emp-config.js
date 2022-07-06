const PluginVue3 = require('@efox/plugin-vue-3')
const {defineConfig} = require('@efox/emp')
const Components = require('unplugin-vue-components/webpack')
const {AntDesignVueResolver} = require('unplugin-vue-components/resolvers')

module.exports = defineConfig(({mode, env}) => {
  const target = 'es5'
  return {
    plugins: [PluginVue3],
    appEntry: 'main.ts',
    server: {port: 9002},
    html: {title: 'EMP Vue3 Project'},
    build: {target},
    empShare: {
      name: 'vue3Project',
      remotes: {
        '@vue3Base': 'vue3Base@http://localhost:9001/emp.js',
      },
      shareLib: {
        vue: 'Vue@https://cdn.jsdelivr.net/npm/vue@3.2.30/dist/vue.global.js',
        dayjs: 'dayjs@https://cdn.jsdelivr.net/npm/dayjs@1.10.7/dayjs.min.js',
        'ant-design-vue': 'antd@https://cdn.jsdelivr.net/npm/ant-design-vue@3.0.0-beta.9/dist/antd.min.js',
      },
    },
    webpackChain(chain) {
      chain.plugin('components').use(
        Components({
          resolvers: [
            AntDesignVueResolver({
              resolveIcons: true,
              importStyle: 'less',
            }),
          ],
        }),
      )
    },
  }
})
