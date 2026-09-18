# EMP v4 Migration Guide

This guide is for teams moving to the stable EMP v4 `4.0.1` release.

## Current Stable Release

- Current v4 stable version: `4.0.1`.
- Install matching v4 packages from npm's `latest` dist-tag.
- Keep all core `@empjs/*` packages on the same v4 version line.

```bash
npm view @empjs/cli dist-tags
npm view @empjs/share dist-tags
npm view @empjs/plugin-react dist-tags
```

## Runtime Baseline

- Node.js: `^20.19.0 || >=22.12.0`
- pnpm: `12.x`; this repository is pinned to `pnpm@12.2.1`.
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

`4.0.1` aligns the root workspace and 17 core internal packages:

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
    targets: ['Chrome >= 80', 'Edge >= 80', 'Firefox >= 80', 'Safari >= 14'],
    format: 'esm',
    rspack: {
      experiments: {
        pureFunctions: true,
      },
    },
  },
}))
```

Avoid carrying deprecated Rspack 1-only flags into v4 configs. Keep high-risk Rspack 2 experiments explicit and project-owned.

Use `build.targets` as the single Browserslist compatibility source and `build.format` for browser delivery format. Migrate `build.useESM: true` to `build.format: 'esm'`; migrate `build.polyfill.browserslist` to `build.targets`. `format: 'esm'` does not implicitly enable `output.library` or `preserveModules`.

### Removed Config Fields

These fields were declared but had no consumer on the v4 (Rspack 2) line. They are removed rather than kept as silently-ignored options, so a config that still sets one now fails TypeScript instead of quietly doing nothing:

| Removed field | Use instead | Why it was removed |
| --- | --- | --- |
| `build.preset` | `build.targets` + `build.format` + `build.polyfill` | Replaced by the explicit compatibility fields above. |
| `debug.progress` | — | Its only read site was commented out; progress output is fixed to "off in dev, on in production". |
| `moduleTransform` / `moduleTransform.exclude` / `.include` / `.defaultExclude` | `chain` (adjust `module.rules[].exclude`), or a first-party plugin | The resolved exclude rule was never attached to any loader rule. |

Deleting these fields never changes build output — verify with the same build before and after if a project relied on them.

## Pnpm 12 Workspace Settings

pnpm 12 reads **only authorization and registry settings** from `.npmrc`. Every other setting belongs in `pnpm-workspace.yaml` (or the global `config.yaml`); written into `.npmrc` it is **silently ignored** — no warning, no error:

```sh
printf 'node-linker=bogus\n' > .npmrc
pnpm install   # succeeds: the value is never read
```

The same value in `pnpm-workspace.yaml` fails the install outright with ``unknown variant `bogus` ``, so a misplaced setting looks active while doing nothing.

v4 deletes the root `.npmrc`, whose four settings had no effect:

| Dropped `.npmrc` setting | pnpm 12 reality |
| --- | --- |
| `link-workspace-packages=true` | Ignored, and unnecessary: every internal dependency uses the `workspace:` protocol, so there is never a bare range for it to link. Guarded by `test/release.rules.test.ts`. |
| `prefer-workspace-packages=true` | Ignored, same reasoning. |
| `save-workspace-protocol=true` | Ignored; the effective default is `rolling`, which writes `workspace:^` on `pnpm add`. Declare it in `pnpm-workspace.yaml` to pin `workspace:*` instead. |
| `shared-workspace-lockfile=true` | Ignored; already the default. A single-document `pnpm-lock.yaml` needs no setting. |

`pnpm-workspace.yaml` keeps `pmOnFail: ignore`, which skips the `packageManager` version check because corepack pins pnpm in CI (`corepack prepare pnpm@12.2.1 --activate`). It has nothing to do with the lockfile shape.

`minimumReleaseAgeExclude` deliberately holds no entries. With `minimumReleaseAgeExcludePrune: true`, pnpm drops every exemption the freshly written lockfile no longer resolves, so an exemption only survives while it is still needed.

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
