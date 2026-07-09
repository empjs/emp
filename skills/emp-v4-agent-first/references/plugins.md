# Plugins

Use this reference for EMP v4 plugins and package-level configuration.

## Contents

- [Framework Plugins](#framework-plugins)
- [React Compiler](#react-compiler)
- [CSS Plugins](#css-plugins)
- [Quality Packages](#quality-packages)
- [Current Package Surface](#current-package-surface)
- [Selection Rules](#selection-rules)

## Framework Plugins

React:

```ts
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
})
```

Vue 2:

```ts
import {defineConfig} from '@empjs/cli'
import pluginVue2 from '@empjs/plugin-vue2'

export default defineConfig({
  plugins: [pluginVue2()],
})
```

Vue 3:

```ts
import {defineConfig} from '@empjs/cli'
import pluginVue3 from '@empjs/plugin-vue3'

export default defineConfig({
  plugins: [pluginVue3()],
})
```

## React Compiler

`@empjs/plugin-react` 支持 React Compiler，但 EMP 默认不自动开启。默认策略如下：

- 默认不自动开启 React Compiler。
- Agent 可以建议开启，但最终必须由项目配置显式写入 `reactCompiler`。
- 新 React 19 应用可以在真实构建和浏览器冒烟通过后使用 `reactCompiler: true`。
- React 17 / React 18 应用必须安装 `react-compiler-runtime`，并设置 `target: '17'` 或 `target: '18'`。
- 既有应用、Module Federation 应用、CDN React 应用，或外置 React 的项目，在确认共享 React/runtime 合约前必须保持手动开启。
- 大型应用或已经依赖手写 memo 的应用，优先使用 `compilationMode: 'annotation'` 做渐进式接入。

React 19 显式开启：

```ts
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig({
  plugins: [
    pluginReact({
      reactCompiler: true,
    }),
  ],
})
```

React 18 渐进式开启：

```ts
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig({
  plugins: [
    pluginReact({
      reactCompiler: {
        target: '18',
        compilationMode: 'annotation',
      },
    }),
  ],
})
```

保留配置前必须验证：

```bash
corepack pnpm --filter <app-or-package> build
corepack pnpm apps:acceptance
```

## CSS Plugins

Tailwind CSS 4:

```ts
import {defineConfig} from '@empjs/cli'
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

export default defineConfig({
  plugins: [pluginTailwindcss()],
})
```

PostCSS:

```ts
import {defineConfig} from '@empjs/cli'
import pluginPostcss from '@empjs/plugin-postcss'

export default defineConfig({
  plugins: [pluginPostcss()],
})
```

Lightning CSS:

```ts
import {defineConfig} from '@empjs/cli'
import pluginLightningcss from '@empjs/plugin-lightningcss'

export default defineConfig({
  plugins: [pluginLightningcss()],
})
```

Stylus:

```ts
import {defineConfig} from '@empjs/cli'
import pluginStylus from '@empjs/plugin-stylus'

export default defineConfig({
  plugins: [pluginStylus()],
})
```

## Quality Packages

| Package | Use |
| --- | --- |
| `@empjs/biome-config` | Shared Biome configuration and command baseline |
| `@empjs/eslint-config-react` | React ESLint configuration for EMP projects |

## Current Package Surface

- `@empjs/plugin-react`
- `@empjs/plugin-vue2`
- `@empjs/plugin-vue3`
- `@empjs/plugin-tailwindcss`
- `@empjs/plugin-postcss`
- `@empjs/plugin-lightningcss`
- `@empjs/plugin-stylus`
- `@empjs/biome-config`
- `@empjs/eslint-config-react`

## Selection Rules

- Use exactly one framework plugin per app unless the app intentionally bridges frameworks.
- Put Module Federation wiring in `pluginRspackEmpShare(...)`, not in a framework plugin.
- Use Tailwind CSS 4 as the active Tailwind integration line.
- Keep PostCSS when an existing CSS toolchain depends on PostCSS plugins.
- Use Lightning CSS for modern CSS transform, minification, and px conversion scenarios.
- Use Stylus only for projects that still own `.styl` sources.
