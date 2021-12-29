const {defineConfig} = require('@efox/emp')
const pluginPolyfill = require('@efox/plugin-polyfill')

module.exports = defineConfig(({mode}) => {
  const target = 'es5'
  return {
    plugins: [
      pluginPolyfill([
        {
          browser: 'IE',
          js: [
            '//static.bdgamelive.com/public/assets/js/babel-polyfill.7.2.5.min.js',
            '//unpkg.bdgamelive.com/webupload/currentScript-polyfill@1.0.0/currentScript.js',
          ],
          polyfills: ['core-js/modules/es.promise', 'core-js/modules/es.array.iterator'],
        },
        {
          browser: 'Android',
          polyfills: ['core-js/modules/es.promise'],
        },
        {
          uaReg: '/Safari/',
          polyfills: ['core-js/modules/es.array.iterator'],
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
  }
})
