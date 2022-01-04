const {defineConfig} = require('@efox/emp')
const pluginPolyfill = require('@efox/plugin-polyfill')

module.exports = defineConfig(({mode}) => {
  const target = 'es5'
  return {
    plugins: [
      pluginPolyfill([
        {
          browser: 'IE',
          js: ['//static.bdgamelive.com/public/assets/js/babel-polyfill.7.2.5.min.js'],
        },
      ]),
    ],
    build: {
      target,
    },
    server: {
      port: 8001,
    },
    html: {
      title: 'Polyfill-demo',
      files: {
        js: ['//static.bdgamelive.com/public/assets/js/hm.js'],
      },
    },
    base: '/usercenter/',
    empShare: {
      name: 'bdgameliveDownload',
      remotes: {
        '@bdgamelive_home_base':
          'bdgamelive_home_base@https://unpkg.bdgamelive.com/@gfe/bdgamelive_home_base@1.0.9/dist/emp.js',
      },
      shareLib: {
        'react-router-dom': `ReactRouterDOM@https://unpkg.bdgamelive.com/webupload/gfe/react-router-dom@5.3.0/umd/react-router-dom.min.js`,
      },
    },
  }
})
