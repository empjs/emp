import path from 'node:path'
import {defineConfig} from '@rspress/core'
import {pluginSitemap} from '@rspress/plugin-sitemap'

export default defineConfig({
  base: '/',
  root: path.join(__dirname, 'docs'),
  globalStyles: path.join(__dirname, 'docs/theme.css'),
  title: 'EMP v4',
  logoText: 'EMP',
  description: 'Rspack 2 驱动的联邦前端构建工具，使用 EMP Federation Fox 视觉系统。',
  icon: '/emp-federation-fox-compact.png',
  lang: 'zh',
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
    },
    {
      lang: 'en',
      label: 'English',
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
    localeRedirect: 'never',
    nav: [
      {text: '文档', link: '/guide/index.html'},
      {text: '指南', link: '/guide/quick-start.html'},
      {text: '插件', link: '/plugins/index.html'},
      {text: '示例', link: '/examples/index.html'},
      {text: 'API', link: '/config/index.html'},
      {text: '更新日志', link: '/release/index.html'},
      {text: '博客', link: '/faq/index.html'},
    ],
    locales: [
      {
        lang: 'zh',
        label: '简体中文',
        title: 'EMP v4',
        description: 'Rspack 2 驱动的联邦前端构建工具，使用 EMP Federation Fox 视觉系统。',
        nav: [
          {text: '文档', link: '/guide/index.html'},
          {text: '指南', link: '/guide/quick-start.html'},
          {text: '插件', link: '/plugins/index.html'},
          {text: '示例', link: '/examples/index.html'},
          {text: 'API', link: '/config/index.html'},
          {text: '更新日志', link: '/release/index.html'},
          {text: '博客', link: '/faq/index.html'},
        ],
      },
      {
        lang: 'en',
        label: 'English',
        title: 'EMP v4',
        description: 'Federated Frontend Build powered by Rspack 2 and EMP Federation Fox.',
        nav: [
          {text: 'Docs', link: '/en/guide/index.html'},
          {text: 'Guide', link: '/en/guide/quick-start.html'},
          {text: 'Plugins', link: '/en/plugins/index.html'},
          {text: 'Examples', link: '/en/examples/index.html'},
          {text: 'API', link: '/en/config/index.html'},
          {text: 'Changelog', link: '/en/release/index.html'},
          {text: 'Blog', link: '/en/faq/index.html'},
        ],
      },
    ],
    footer: {
      message: '© 2019-2026 EMP. Released under the MIT License.',
    },
    socialLinks: [{icon: 'github', mode: 'link', content: 'https://github.com/empjs/emp'}],
  },
  plugins: [pluginSitemap({siteUrl: 'https://empjs.dev'})],
})
