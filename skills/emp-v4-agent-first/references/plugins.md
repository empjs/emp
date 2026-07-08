# Plugins

Use this reference for EMP v4 plugins and package-level configuration.

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
