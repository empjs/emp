const {defineConfig} = require('@efox/emp')

module.exports = defineConfig(config => {
  return {
    html: {title: 'Https | emp2'},
    server: {
      /* https: true, //新版本弃置
      http2: true, //新版本弃置
      server: {
        type: 'https',
        type: 'spdy',
				options:{}
      }, */
      server: 'spdy', //相当于启动 h2
    },
  }
})
