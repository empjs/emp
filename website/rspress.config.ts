import path from 'node:path'
import {defineConfig} from '@rspress/core'
import {pluginSitemap} from '@rspress/plugin-sitemap'

const homepageDesignPlugin = () => ({
  name: 'emp-homepage-design',
  globalStyles: path.join(__dirname, 'docs/styles/home.css'),
})

export default defineConfig({
  base: '/',
  root: path.join(__dirname, 'docs'),
  title: 'EMP v4',
  description: 'Rspack 2 驱动的微前端构建工具，保留熟悉的 EMP 配置。',
  icon: '/emp-v4-logo.png',
  lang: 'zh',
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
      title: 'EMP v4',
      description: 'Rspack 2 驱动的微前端构建工具，保留熟悉的 EMP 配置。',
    },
  ],
  logo: {
    light: '/emp-v4-logo.png',
    dark: '/emp-v4-logo.png',
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
  plugins: [pluginSitemap({siteUrl: 'https://empjs.dev'}), homepageDesignPlugin()],
})
