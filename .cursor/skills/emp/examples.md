# EMP React 配置示例

## 最少配置

```typescript
import { defineConfig } from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => ({
  plugins: [pluginReact()],
  server: { port: 8000 },
}))
```

## 标准 React 项目

```typescript
import { defineConfig } from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => ({
  plugins: [pluginReact()],
  appSrc: 'src',
  appEntry: 'index.tsx',
  server: {
    port: 8000,
    open: true,
    hot: true,
  },
  html: {
    template: 'src/index.html',
    title: '我的应用',
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2017',
    polyfill: {
      entryCdn: 'https://unpkg.com/@empjs/polyfill@0.0.2/dist/es.js',
    },
  },
  resolve: {
    alias: { '@': store.resolve('src') },
  },
}))
```

## 多入口

```typescript
export default defineConfig(store => ({
  plugins: [pluginReact()],
  entries: {
    'index.tsx': { title: '首页' },
    'about.tsx': { title: '关于', template: 'src/about.html' },
  },
  server: { port: 8000 },
}))
```

## 带代理

```typescript
export default defineConfig(store => ({
  plugins: [pluginReact()],
  server: {
    port: 8000,
    proxy: [
      { context: ['/api'], target: 'http://localhost:3001', changeOrigin: true },
    ],
  },
}))
```

## 带 Tailwind v4

```typescript
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

plugins: [pluginReact(), pluginTailwindcss()]
```

## 微前端 Host

```typescript
import { externalReact, pluginRspackEmpShare } from '@empjs/share'

pluginRspackEmpShare({
  name: 'mfHost',
  manifest: true,
  exposes: { './App': './src/App' },
  empRuntime: {
    framework: {
      global: 'EMP_ADAPTER_REACT',
      libs: [`https://unpkg.com/@empjs/cdn-react@0.18.0/dist/reactRouter.${store.mode}.umd.js`],
    },
    runtime: { lib: `https://unpkg.com/@empjs/share@3.11.4/output/sdk.js` },
    setExternals: externalReact,
  },
})
```

## 微前端 Remote

```typescript
pluginRspackEmpShare({
  name: 'mfApp',
  remotes: {
    mfHost: `mfHost@http://${store.server.ip}:6001/emp.json`,
  },
  empRuntime: { /* 与 Host 一致 */ },
  dts: { consumeTypes: true },
})
```
