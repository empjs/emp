# Legacy Configuration Compatibility

Use this reference only when an existing EMP project still carries v3/v4 compatibility aliases. Do not copy these fields into a new project; use the canonical replacements in `configuration.md` and `build-compatibility.md`.

## Contents

- [Support policy](#support-policy)
- [Complete project](#complete-project)
- [What the project proves](#what-the-project-proves)
- [Migration sequence](#migration-sequence)
- [Validation](#validation)

## Support policy

Keep an alias only when all four conditions hold:

1. The public TypeScript type marks it `@deprecated` and names the replacement.
2. Runtime normalization maps it to one canonical internal value.
3. Conflicting legacy and canonical values in the same schema fail immediately.
4. A project or package acceptance test proves the old value still works.

Do not silently preserve a field with no consumer. `debug.showPerformance` and `debug.newTreeshaking` remain readable during the compatibility window but have no Rspack 2 behavior; migrate them instead of depending on them.

## Complete project

Use `apps/legacy-config-compat` as the executable compatibility project. Its config intentionally uses every supported migration alias:

```ts
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig({
  appSrc: 'src',
  appEntry: 'index.tsx',
  server: {
    port: 8105,
    open: false,
    ...(process.env.EMP_LEGACY_HTTP2 === 'true' ? {http2: true} : {}),
  },
  build: {
    useESM: false,
    devtool: 'source-map',
    polyfill: {
      mode: 'entry',
      splitChunks: true,
      browserslist: ['Chrome >= 60'],
    },
  },
  css: {prifixName: 'legacy'},
  debug: {
    showPerformance: false,
    newTreeshaking: false,
  },
  plugins: [pluginReact({splickChunks: true})],
})
```

Read the complete source and tests in:

- `apps/legacy-config-compat/emp.config.ts`
- `apps/legacy-config-compat/src/index.tsx`
- `apps/legacy-config-compat/test/config-shape.mjs`
- `apps/legacy-config-compat/test/browser/compatibility.browser.ts`

## What the project proves

| Legacy field | Canonical result | Evidence |
| --- | --- | --- |
| `build.useESM: false` | `build.format: 'script'` | Resolved config and non-module HTML script. |
| `build.polyfill.browserslist` | `build.targets` | Rspack target is `browserslist:Chrome >= 60`; a `coreJs` chunk is emitted. |
| `build.devtool` | `build.sourcemap.js` | JavaScript source maps are emitted. |
| `css.prifixName` | `css.prefixName` | Browser DOM contains a CSS Modules class beginning with `legacy-`. |
| React `splickChunks` | React `splitChunks` | Resolved cache group is named `common-react`. |
| `server.http2` | internal h2 server mode | `EMP_LEGACY_HTTP2=true` resolves `store.server.httpsType` to `h2`. |
| `debug.showPerformance` | no active replacement behavior | Value remains readable; use normal stats or `debug.rsdoctor`. |
| `debug.newTreeshaking` | Rspack 2 defaults | Value remains readable but is not consumed. |

Conflict tests live in the owning package suites. They reject contradictory pairs for `build.format`/`build.useESM`, `build.targets`/legacy browserslist, `build.sourcemap.js`/`build.devtool`, `css.prefixName`/`css.prifixName`, and React `splitChunks`/`splickChunks`.

## Migration sequence

Change one semantic axis at a time:

1. Replace `build.polyfill.browserslist` with `build.targets` and keep the same query.
2. Replace `build.useESM` with `build.format` without changing the delivery format.
3. Replace `build.devtool` with `build.sourcemap.js`.
4. Rename `css.prifixName` and React `splickChunks` without changing their values.
5. Replace `server.http2` with the supported dev-server `server` configuration for the installed version.
6. Remove `debug.showPerformance` and `debug.newTreeshaking`; use `debug.rsdoctor` only when a report is required.
7. Run the same build, config-shape, and browser assertions before deleting the aliases.

## Validation

Run the project directly:

```bash
corepack pnpm --filter legacy-config-compat build
corepack pnpm --filter legacy-config-compat test:config
APPS_BROWSER_SERVICE_FILTER=legacy-config-compat corepack pnpm exec rstest run \
  --config rstest.config.ts \
  apps/legacy-config-compat/test/browser/compatibility.browser.ts \
  --browser --browser.name chromium
```

For repository acceptance, run `corepack pnpm test:apps:single`, `corepack pnpm test:rules`, and the normal package/build gates required by the changed surface.
