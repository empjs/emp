import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
export default defineConfig(store => {
  return {
    plugins: [pluginReact()],
    html: {
      title: 'proxy demo',
    },
    entries: {
      'pc/index.ts': {
        title: 'pc',
      },
      'mobile/index.ts': {
        title: 'mobile',
      },
    },
    server: {
      https: true,
      proxy: {
        '/': {
          bypass: function (req) {
            if (
              req.headers.accept &&
              req.headers.accept.indexOf('html') !== -1 &&
              (req.url === '/' || req.url.indexOf('.html') !== -1)
            ) {
              let href = req.originalUrl.split('.')[0]
              href = href === '/' ? '/index' : href
              const userAgent = req.headers['user-agent']
              if (userAgent.match(/AppleWebKit.*Mobile.*|ios|android/i)) {
                return `/mobile${href}.html`
              }
              return `/pc${href}.html`
            }
            return req.url
          },
        },
      },
    },
  }
})
