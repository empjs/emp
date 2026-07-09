import path from 'node:path'
import {defineConfig} from '@rspress/core'
import {pluginSitemap} from '@rspress/plugin-sitemap'

export default defineConfig({
  base: '/',
  root: path.join(__dirname, 'docs'),
  globalStyles: path.join(__dirname, 'docs/theme.css'),
  title: 'EMP v4',
  description: 'Rspack 2 驱动的微前端联邦构建工具，使用 EMP Federation Fox 视觉系统。',
  icon: '/emp-federation-fox-compact.png',
  lang: 'zh',
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
      title: 'EMP v4',
      description: 'Rspack 2 驱动的微前端联邦构建工具，使用 EMP Federation Fox 视觉系统。',
    },
  ],
  logo: {
    light: '/emp-federation-fox-compact.png',
    dark: '/emp-federation-fox-compact.png',
  },
  llms: true,
  markdown: {
    link: {
      checkDeadLinks: true,
    },
  },
  themeConfig: {
    footer: {
      message: '© 2019-2026 EMP. Released under the MIT License.',
    },
    socialLinks: [{icon: 'github', mode: 'link', content: 'https://github.com/empjs/emp'}],
  },
  plugins: [pluginSitemap({siteUrl: 'https://empjs.dev'})],
})
