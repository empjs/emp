//vite.config.ts
import {SearchPlugin} from 'vitepress-plugin-search'
import {defineConfig} from 'vite'

const options = {}

export default defineConfig({
  plugins: [SearchPlugin(options)],
})
