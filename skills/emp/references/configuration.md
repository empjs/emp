# Complete Configuration

Use this reference as the public `EmpOptions` index. Read the linked domain reference before changing a field. Treat `packages/cli/src/types/config.ts` and the installed Rspack types as the executable truth when a passthrough type changes.

## Contents

- [Core rules](#core-rules)
- [Complete top-level index](#complete-top-level-index)
- [Precedence](#precedence)
- [Deprecation and consolidation](#deprecation-and-consolidation)
- [Baseline example](#baseline-example)

## Core rules

- Use `defineConfig(...)` from `@empjs/cli` for type checking.
- Prefer EMP-owned semantic fields over raw Rspack overrides.
- Use `build.targets` for browser compatibility and `build.format` for browser delivery format.
- Keep `output.library` explicit; ESM delivery does not imply a library build.
- Inspect the resolved config with `debug.showRsconfig` when precedence or plugin mutation matters.
- Validate behavior, not only config shape, whenever HTML, runtime loading, CSS, or Module Federation changes.

## Complete top-level index

| Field | Purpose | Read next |
| --- | --- | --- |
| `base` | Public path base; defaults to Rspack `auto` when omitted. | `html-server-css.md` |
| `target` | Raw Rspack target escape hatch. Do not use as the normal browser compatibility field. | `build-compatibility.md` |
| `autoDevBase` | In development, derive `base` from the reachable dev-server address. | `html-server-css.md` |
| `autoPages` | Discover page entries under `pages` or a configured directory. | `html-server-css.md` |
| `appSrc` | Application source directory; default `src`. | `html-server-css.md` |
| `appEntry` | Default application entry; ignored when explicit `entries` own the entry set. | `html-server-css.md` |
| `build` | Build compatibility, format, assets, optimization, source maps, and Rspack 2 options. | `build-compatibility.md` |
| `plugins` | Ordered EMP plugins; each plugin may mutate the Rspack chain. | `plugins.md` |
| `html` | Default HtmlRspackPlugin options plus EMP mount and tag helpers. | `html-server-css.md` |
| `entries` | Named multi-page entries with per-page HTML options. | `html-server-css.md` |
| `server` | Rspack dev-server options plus EMP defaults. | `html-server-css.md` |
| `debug` | Logging, Rsdoctor, resolved-config output, watcher, and CSS chunking controls. | `advanced-configuration.md` |
| `chain` | Final imperative chain customization hook. | `advanced-configuration.md` |
| `css` | Sass, Less, and CSS Modules prefix configuration. | `html-server-css.md` |
| `moduleTransform` | Include/exclude control for source transformation. | `advanced-configuration.md` |
| `cacheDir` | Persistent cache directory; default `node_modules/.emp-cache`. | `advanced-configuration.md` |
| `cache` | Disable cache, use memory cache, persistent cache, or raw Rspack cache options. | `advanced-configuration.md` |
| `define` | Values injected into build-time environment expressions. | `advanced-configuration.md` |
| `defineFix` | Select `process.env`, `import.meta.env`, both, or raw identifiers. | `advanced-configuration.md` |
| `externals` | Rspack externals passthrough. | `advanced-configuration.md` |
| `resolve` | Rspack resolution passthrough. | `advanced-configuration.md` |
| `output` | Rspack output passthrough; explicit values override EMP defaults. | `advanced-configuration.md` |
| `lifeCycle` | EMP lifecycle hooks around config and build stages. | `advanced-configuration.md` |
| `ignoreWarnings` | Rspack warning filters. | `advanced-configuration.md` |
| `tsCheckerRspackPlugin` | Enable or configure `ts-checker-rspack-plugin`. | `advanced-configuration.md` |
| `circularCheckRspackPlugin` | Enable or configure Rspack circular dependency checking. | `advanced-configuration.md` |
| `showLogTitle` | Replace the CLI title callback. | `advanced-configuration.md` |

## Precedence

Apply configuration in this order:

1. EMP defaults.
2. Normalized compatibility aliases.
3. User `emp.config.ts` values.
4. Plugin `rsConfig` mutations in plugin order.
5. User `chain(...)` and explicit low-level Rspack fields where the owning getter merges them last.

Do not assume every nested value has identical merge semantics. For a disputed value, enable `debug.showRsconfig` and inspect the resolved Rspack config produced by the current package version.

## Deprecation and consolidation

| Legacy field | Preferred field | Current policy |
| --- | --- | --- |
| `build.useESM` | `build.format: 'esm'` | Deprecated compatibility alias; reject conflicting values; remove in the next major. |
| `build.polyfill.browserslist` | `build.targets` | Deprecated compatibility alias; reject conflicting values; remove in the next major. |
| `build.devtool` | `build.sourcemap.js` | Deprecated compatibility alias; remove in the next major. |
| `css.prifixName` | `css.prefixName` | Deprecated spelling alias; both resolve to the canonical value. |
| React `splickChunks` | React `splitChunks` | Deprecated spelling alias; reject conflicting values. |
| `debug.showPerformance` | `debug.rsdoctor` or normal build output | Deprecated and has no active performance-reporting path; remove in the next major. |
| `debug.newTreeshaking` | Rspack 2 defaults | Deprecated compatibility field with no active consumer; remove in the next major. |
| `server.http2` | Dev server native `server` options | Deprecated compatibility mapping to h2; retain until the next major because old configs still execute it. |

For the complete executable alias project, normalized config assertions, artifact contracts, and browser test, read `legacy-compatibility.md` and `apps/legacy-config-compat`.

Keep these fields separate:

- Keep raw top-level `target` as an advanced Rspack platform/runtime escape hatch.
- Keep `build.target` as the legacy low-level JS syntax fallback when `build.targets` is absent.
- Keep `output`, `resolve`, `externals`, and `chain` because they expose distinct Rspack extension layers.
- Keep `defineFix` separate from `build.format`; projects may intentionally inject both environment expression styles.

## Baseline example

```ts
import {defineConfig} from '@empjs/cli'

export default defineConfig({
  appSrc: 'src',
  appEntry: 'index.tsx',
  base: '/',
  build: {
    targets: ['Chrome >= 80', 'Edge >= 80', 'Firefox >= 80', 'Safari >= 14'],
    format: 'script',
    sourcemap: {js: 'source-map', css: false},
  },
  html: {
    title: 'EMP App',
    mountId: 'emp-root',
  },
  server: {
    port: 8000,
    open: false,
  },
})
```
