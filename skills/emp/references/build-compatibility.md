# Build And Compatibility

Use this reference for every `build` field, browser compatibility contract, output format, polyfill, or Rspack 2 build extension.

## Contents

- [Target model](#target-model)
- [Complete build index](#complete-build-index)
- [Polyfill options](#polyfill-options)
- [Rspack 2 options](#rspack-2-options)
- [Compatibility profiles](#compatibility-profiles)
- [Conflicts and legacy migration](#conflicts-and-legacy-migration)
- [Acceptance](#acceptance)

## Target model

Treat compatibility and module delivery as independent axes:

- `build.targets`: Browserslist contract for Rspack runtime, SWC transforms, Lightning CSS, and polyfills.
- `build.format`: browser delivery as ordinary `script` or native `esm`.
- `build.target`: legacy low-level ECMAScript syntax fallback used only when explicit browser targets are absent.
- top-level `target`: raw Rspack platform/runtime escape hatch; do not use it as the normal browser support declaration.

When `build.targets` is absent, preserve the existing `['web', 'es5']` Rspack/SWC baseline. Supplying `build.targets` opts into browser-derived transforms.

## Complete build index

| Field | Type/default | Behavior |
| --- | --- | --- |
| `build.targets` | Browserslist string or string array | Preferred browser compatibility source. |
| `build.format` | `'script' \| 'esm'`; default `script` | Controls `output.module`, HTML `scriptLoading`, tree-shaking defaults, and environment define style. |
| `build.outDir` | string; default `dist` | Build output directory. |
| `build.assetsDir` | string; default `assets` | Asset subdirectory. |
| `build.staticDir` | string; default empty | Optional common parent directory for JS, CSS, and assets. |
| `build.publicDir` | string; default `public` | Static source directory copied/served by EMP. |
| `build.moduleIds` | Rspack module id mode | Defaults to `named` in development and `deterministic` in production. |
| `build.chunkIds` | Rspack chunk id mode | Defaults to `named` in development and `deterministic` in production. |
| `build.sourcemap` | boolean or source-map object | `true` enables JS and CSS maps; object form configures `js`, `css`, and optional `devToolPluginOptions`. |
| `build.devtool` | Rspack devtool | Deprecated alias for `build.sourcemap.js`. |
| `build.minify` | boolean; production true | Enables EMP JS and CSS minimizers. |
| `build.minOptions` | SWC JS minimizer options | Configures `SwcJsMinimizerRspackPlugin`. |
| `build.cssminOptions` | CSS minimizer options | Configures the available SWC or Lightning CSS minimizer. |
| `build.incremental` | Rspack incremental mode; default `advance-silent` | Controls incremental compilation. |
| `build.lazyCompilation` | Rspack lazy compilation; development true | Defers compilation of eligible modules/entries in development. |
| `build.target` | `es3` through `es2022`; default `es5` | Low-level syntax fallback; do not combine with `build.targets`. |
| `build.useESM` | boolean | Deprecated alias for `build.format`. |
| `build.polyfill` | object | Runtime API compatibility; see below. |
| `build.swcConfig` | SWC subset | Controls `transform.useDefineForClassFields` and `preserveAllComments`. |
| `build.rspack` | object | Curated Rspack 2 extensions; see below. |

`build.format: 'esm'` does not create a library and does not enable `preserveModules`. Configure `output.library` explicitly when publishing a library.

## Polyfill options

| Field | Behavior |
| --- | --- |
| `build.polyfill.mode` | `entry` injects the selected core-js entry; `usage` lets SWC inject detected features. Prefer `entry` for Module Federation entry consistency. |
| `build.polyfill.entryCdn` | Load a prebuilt polyfill script before application entries instead of bundling the entry. |
| `build.polyfill.splitChunks` | Extract bundled entry polyfills to the `coreJs` cache group. |
| `build.polyfill.include` | Force SWC usage-mode transforms/polyfills that static analysis may miss. |
| `build.polyfill.coreJsFeatures` | Select `full`, `actual`, `stable`, or `es`; default `stable`. |
| `build.polyfill.externalHelpers` | Resolve helpers through `@swc/helpers` instead of inlining them. |
| `build.polyfill.browserslist` | Deprecated alias for `build.targets`. |

Polyfills repair runtime APIs; they do not select HTML module format. A browser may need `format: 'script'` even when its syntax target is modern enough for many ES2015 features.

## Rspack 2 options

| Field | Behavior |
| --- | --- |
| `build.rspack.experiments` | Curated `pureFunctions`, `deferImport`, `runtimeMode`, and `sourceImport` switches. Keep them project-owned. |
| `build.rspack.splitChunks` | Rspack splitChunks passthrough, including `enforceSizeThreshold`. |
| `build.rspack.parser` | Curated JavaScript and CSS parser options listed below. |
| `build.rspack.parser.javascript.createRequire` | Control parser handling of `createRequire`. |
| `build.rspack.parser.javascript.pureFunctions` | Mark named functions as side-effect free; incorrect values can delete behavior. |
| `build.rspack.parser.css.resolveImport` | Resolve CSS imports or preserve them for downstream/browser handling. |
| `build.rspack.swc` | Curated builtin SWC loader extensions listed below. |
| `build.rspack.swc.detectSyntax` | Let builtin SWC infer parser syntax from file extensions. |
| `build.rspack.swc.transformImport` | Configure Rspack builtin transform-import behavior. |

## Compatibility profiles

Chrome 60-compatible script delivery:

```ts
build: {
  targets: ['Chrome >= 60'],
  format: 'script',
  polyfill: {mode: 'entry', splitChunks: true},
}
```

Native ESM delivery:

```ts
build: {
  targets: ['Chrome >= 80', 'Edge >= 80', 'Firefox >= 80', 'Safari >= 14'],
  format: 'esm',
}
```

Mobile compatibility:

```ts
export default defineConfig(store => ({
  build: {
    targets: store.browserslistOptions.h5,
    format: 'script',
    polyfill: {mode: 'entry'},
  },
}))
```

## Conflicts and legacy migration

- Reject simultaneous `build.targets` and `build.target`; choose browser-derived or explicit syntax targeting.
- Reject conflicting `build.targets` and `build.polyfill.browserslist`.
- Reject conflicting `build.format` and `build.useESM`.
- Keep explicit `output.environment`, raw top-level `target`, and custom loader options as advanced escape hatches; verify that they do not contradict the compatibility contract.
- Migrate aliases before the next major removes them.
- Use `legacy-compatibility.md` and `apps/legacy-config-compat` when a migration must prove the old and canonical semantics are equivalent.

## Acceptance

For compatibility-sensitive changes, verify:

1. Resolved Rspack target and SWC `env.targets`.
2. Lightning CSS target inheritance when the plugin is enabled.
3. HTML uses `defer` for `script` or `type="module"` for `esm`.
4. Entry polyfill appears before application and Module Federation runtime entries.
5. Production artifacts avoid syntax outside the declared browsers.
6. A real target browser runs the page when the project makes a formal browser-version support claim.
