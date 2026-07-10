import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [pluginReact(), pluginTailwindcss()],
  html: {
    title: 'EMP - AGENT-FIRST',
    mountId: 'emp-root',
    lang: 'zh-CN',
  },
  build: {
    sourcemap: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
    cssFilename: 'assets/css/[name].[contenthash:8].css',
    jsFilename: 'assets/js/[name].[contenthash:8].js',
    chunkFilename: 'assets/js/[name].[contenthash:8].js',
  },
  server: {
    host: '0.0.0.0',
    port: 4175,
    open: false,
  },
})
