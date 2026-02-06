#!/usr/bin/env node
/**
 * EMP React 19 Startkit 脚手架脚本
 * 用法: node create-emp-react19.js <项目名> [目标目录]
 * 示例: node create-emp-react19.js my-app
 *       node create-emp-react19.js my-app ./projects
 */
import fs from 'node:fs'
import path from 'node:path'

const projectName = process.argv[2]
const targetDir = process.argv[3] || '.'

if (!projectName) {
  console.error('用法: node create-emp-react19.js <项目名> [目标目录]')
  process.exit(1)
}

const root = path.resolve(targetDir, projectName)

function write(filePath, content) {
  const full = path.join(root, filePath)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content.trim() + '\n', 'utf8')
}

const pkgName = projectName.replace(/[^a-z0-9-]/gi, '-').toLowerCase()

write('package.json', JSON.stringify({
  name: pkgName,
  version: '1.0.0',
  type: 'module',
  scripts: {
    dev: 'emp dev',
    build: 'emp build',
    start: 'emp serve',
    stat: 'emp build --analyze',
    emp: 'emp',
  },
  devDependencies: {
    '@empjs/cli': '^3.12.0',
    '@empjs/plugin-react': '^3.12.0',
    '@types/react': '^19',
    '@types/react-dom': '^19',
  },
  dependencies: {
    react: '^19',
    'react-dom': '^19',
  },
}, null, 2))

write('emp.config.ts', `import { defineConfig } from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => ({
  plugins: [pluginReact()],
  appSrc: 'src',
  appEntry: 'index.tsx',
  server: { port: 8000, open: true },
  html: { template: 'src/index.html', title: '${pkgName}' },
  build: {
    target: 'es2017',
    polyfill: {
      entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
    },
  },
  resolve: { alias: { '@': store.resolve('src') } },
}))`)

write('tsconfig.json', JSON.stringify({
  extends: '@empjs/cli/tsconfig/react',
  compilerOptions: { baseUrl: './' },
  include: ['src'],
  exclude: ['dist', 'node_modules'],
}, null, 2))

write('src/index.html', `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pkgName}</title>
</head>
<body>
  <div id="emp-root"></div>
</body>
</html>`)

write('src/index.tsx', `import './style.css'
import('./bootstrap')`)

write('src/style.css', `/* 可选：添加 Tailwind v4
@import "tailwindcss";
*/`)

write('src/bootstrap.tsx', `import { createRoot } from 'react-dom/client'
import App from './App'

const dom = document.getElementById('emp-root')!
const root = createRoot(dom)
root.render(<App />)`)

write('src/App.tsx', `export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>EMP React 19</h1>
      <p>项目已就绪，运行 <code>pnpm dev</code> 启动开发服务器。</p>
    </div>
  )
}`)

write('src/global.d.ts', `/// <reference types="@empjs/cli/client" />`)

console.log(`✓ EMP React 19 项目已创建: ${root}`)
console.log('  下一步:')
console.log(`    cd ${projectName}`)
console.log('    pnpm install')
console.log('    pnpm dev')
