# Plugins

Use this reference for EMP v4 plugins and package-level configuration.

## Inputs to collect

- Framework and version: React, Vue 2, Vue 3, or cross-framework bridge.
- CSS toolchain: Tailwind CSS 4, PostCSS, Lightning CSS, Stylus, or existing mixed setup.
- Quality tooling requirements such as Biome or React ESLint config.
- Whether React Compiler should stay disabled, be suggested, or be explicitly enabled by project config.

## Files to inspect

- `emp.config.ts`
- `package.json`
- CSS entry files and PostCSS/Tailwind config files
- framework source entry such as `src/App.tsx`, `src/main.ts`, or Vue single-file components
- browser tests when plugin behavior affects runtime output

## Success evidence

- Selected plugins match the current package surface and do not restore retired legacy Tailwind flows.
- Config diff keeps Module Federation wiring in `pluginRspackEmpShare(...)`.
- Build output exists for the selected framework and CSS path.
- Browser or acceptance evidence exists when the plugin changes visible runtime behavior.

## Contents

- [Framework Plugins](#framework-plugins)
- [React Plugin Options](#react-plugin-options)
- [React Compiler](#react-compiler)
- [CSS Plugins](#css-plugins)
- [CSS Plugin Options](#css-plugin-options)
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

Vue 2, Vue 3, and Stylus plugins currently expose no public options. Configure their surrounding build, server, and CSS behavior through the owning EMP fields rather than passing undocumented objects.

## React Plugin Options

| Field | Default/behavior |
| --- | --- |
| `hmr` | `true`; coordinates React Refresh with `server.hot`. |
| `svgrQuery` | `react`; SVG resource query that selects SVGR component handling. |
| `reactRuntime` | Auto-detected `automatic` or `classic` JSX runtime override. |
| `splitChunks` | `false`; creates React and React Router cache groups. |
| `splickChunks` | Deprecated spelling alias for `splitChunks`. |
| `version` | React major/version hint when React is external and cannot be read from package dependencies. |
| `import.src` | External React script URL injected into HTML. |
| `import.externals` | Rspack externals installed with the injected script. |
| `reactCompiler` | Boolean enablement or React Compiler options described below. |

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

## CSS Plugin Options

Tailwind CSS:

| Field | Default/behavior |
| --- | --- |
| `base` | Project root used by `@tailwindcss/webpack`. |
| `optimize` | Enabled outside development; accepts boolean or `{minify}`. |

PostCSS:

| Field | Behavior |
| --- | --- |
| `postcssOptions` | Passed to `postcss-loader` for CSS, Sass, and Less rules. |

Lightning CSS:

| Field | Default/behavior |
| --- | --- |
| `transform` | `false`; boolean enablement or Lightning CSS transform options. Targets default from normalized `build.targets`. |
| `minify` | Enabled automatically when transform is enabled unless explicitly set; accepts boolean or minimizer options. |
| `implementation` | Custom Lightning CSS implementation. |
| `enablePostcss` | `false`; retain PostCSS only when an existing plugin chain requires it. |

`@empjs/plugin-lightningcss` also exports `composeVisitors`, `postcss`, `PxToRemOptions`, and `PxToVwOptions` for explicit unit-transform composition. Keep visitor configuration in plugin code and verify generated CSS values.

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
