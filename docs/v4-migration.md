# EMP v4 Migration Guide

This guide is for teams moving to the stable EMP v4 `4.0.0` release.

## Current Stable Release

- Current v4 stable version: `4.0.0`.
- Install matching v4 packages from npm's `latest` dist-tag.
- Keep all core `@empjs/*` packages on the same v4 version line.

```bash
npm view @empjs/cli dist-tags
npm view @empjs/share dist-tags
npm view @empjs/plugin-react dist-tags
```

## Runtime Baseline

- Node.js: `^20.19.0 || >=22.12.0`
- pnpm: `10.x`; this repository is pinned to `pnpm@10.33.0`.
- Rspack: v4 is built on the Rspack 2 toolchain.
- Module Federation: `@empjs/share` uses official Module Federation 2.x packages.

## Install The Stable Line

Install v4 packages from `latest`:

```bash
pnpm add -D @empjs/cli @empjs/plugin-react @empjs/share
```

For Vue projects, use the matching framework plugin:

```bash
pnpm add -D @empjs/cli @empjs/plugin-vue3 @empjs/share
```

Do not move CDN or legacy runtime packages to the unified v4 version line. `@empjs/cdn-*` and `@empjs/lib-*` remain independent package lines, and example or website workspaces under `apps/**` and `website` are not part of the stable publish set.

## Release Scope

`4.0.0` aligns the root workspace and 17 core internal packages:

- `@empjs/adapter-react`
- `@empjs/biome-config`
- `@empjs/bridge-react`
- `@empjs/bridge-vue2`
- `@empjs/bridge-vue3`
- `@empjs/chain`
- `@empjs/cli`
- `@empjs/eslint-config-react`
- `@empjs/plugin-lightningcss`
- `@empjs/plugin-postcss`
- `@empjs/plugin-react`
- `@empjs/plugin-stylus`
- `@empjs/plugin-tailwindcss`
- `@empjs/plugin-vue2`
- `@empjs/plugin-vue3`
- `@empjs/polyfill`
- `@empjs/share`

The release scope is validated by:

```bash
pnpm release:check
```

## Rspack 2 Notes

Keep existing EMP config shape where possible. v4 keeps the familiar `defineConfig(...)` and plugin-based structure, while exposing Rspack 2 options through `build.rspack`.

```ts
import {defineConfig} from '@empjs/cli'

export default defineConfig(() => ({
  build: {
    useESM: true,
    target: 'es2018',
    rspack: {
      experiments: {
        pureFunctions: true,
      },
    },
  },
}))
```

Avoid carrying deprecated Rspack 1-only flags into v4 configs. Keep high-risk Rspack 2 experiments explicit and project-owned.

## Module Federation Notes

Import the Rspack integration from `@empjs/share/rspack`:

```ts
import pluginRspackEmpShare, {externalReact} from '@empjs/share/rspack'
```

Existing `pluginRspackEmpShare(...)` usage remains the supported migration path. v4 moves the underlying runtime to official Module Federation 2.x packages, but does not require business projects to rewrite their federation configuration shape.

When a page can load multiple versions of the same shared runtime, enable version isolation:

```ts
pluginRspackEmpShare({
  name: 'mfHost',
  empRuntime: {
    version: true,
    runtime: {
      lib: 'http://localhost:2100/sdk.js',
    },
    setExternals: externalReact,
  },
})
```

`empRuntime.version: true` derives the actual Module Federation scope from the current package `name` and `version`, also aligning `output.uniqueName` and the default CSS Modules prefix. The option is boolean only; do not pass a custom string version.

## Agent-First Create Flow

`@empjs/cli` includes the P0 agent-first project generator:

```bash
emp create "React 主应用 + Vue 子应用"
```

Useful automation modes:

```bash
emp create "React 主应用 + Vue 子应用" --dry-run --json
emp create "React 主应用 + Vue 子应用" --dir <target-dir>
emp create "React 主应用 + Vue 子应用" --skip-install --skip-dev --json
```

The P0 topology is one React host plus one Vue remote. It writes `emp.intent.yaml`, generated app workspaces, and `emp-report.json`. It is not a general in-place migration command for existing repositories.

## Consumer Validation

After installing the stable line, run the same user-facing checks that CI covers in this repository:

```bash
pnpm build
pnpm emp build
```

For Module Federation projects, also verify manifest and type generation in the host and remote apps. If `empRuntime.version: true` is enabled, consume remotes with the derived scope name shown by the generated config and runtime output.

## Maintainer Evidence

The stable release validation plan uses these repository gates:

```bash
corepack pnpm test:cli
corepack pnpm test:rules
corepack pnpm release:check
corepack pnpm ci:verify
corepack pnpm empbuild
corepack pnpm apps:acceptance
corepack pnpm test:apps:browser
git diff --check
```
