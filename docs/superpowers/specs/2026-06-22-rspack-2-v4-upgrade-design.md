# EMP v4 Rspack 2 Upgrade Design

## Summary

EMP v4 upgrades the core build stack to Node 22, pnpm 10, Rspack 2, and Module Federation 2.x. The release removes the historical `@empjs/share` dependency on the `@empjs/module-federation-rspack` fork and moves the implementation toward the official Module Federation Rspack integration.

This is an ESM-first major release, not an ESM-only release. CJS exports and CJS build artifacts remain available in v4 to keep existing users and plugin packages compatible while the Rspack 2 migration lands.

## Goals

- Ship the Rspack 2 migration as the EMP v4 major line.
- Require Node `>=22.12.0` and pnpm `10.x` for development and published package engines.
- Upgrade the CLI build stack to Rspack 2-compatible packages.
- Remove the `@empjs/module-federation-rspack` fork from `@empjs/share`.
- Keep the existing `pluginRspackEmpShare(...)` user-facing API stable.
- Preserve CJS compatibility exports in v4.
- Add a verification matrix that catches package declaration, lockfile, and installed-tree drift.

## Non-Goals

- Do not make the full monorepo ESM-only in v4.
- Do not require business projects to rewrite existing `emp.config.ts` calls to `pluginRspackEmpShare(...)`.
- Do not redesign the whole `@empjs/chain` API or remove `require`-based plugin serialization in this release.
- Do not keep publishing or depending on the historical Module Federation fork as the long-term fix.

## Current Context

The workspace root, `@empjs/cli`, and `@empjs/share` already declare `"type": "module"`, but the published package surface still exposes CJS entries and many packages build both ESM and CJS. This is intentional compatibility surface and should not be removed as part of the Rspack 2 migration.

The current key packages are:

- `@empjs/cli`: depends on `@rspack/core@1.7.4` and `@rspack/dev-server@1.2.1`.
- `@empjs/plugin-react`: depends on `@rspack/plugin-react-refresh@1.6.0`.
- `@empjs/share`: declares `@empjs/module-federation-rspack@0.22.5`, `@module-federation/runtime@0.23.0`, and `@module-federation/sdk@0.23.0`.

The installed tree has previously shown drift from declarations, so implementation must verify both `package.json` and `pnpm list` results after dependency changes.

## Version Strategy

EMP v4 is the major line for this migration.

- Root workspace: add or update `packageManager` to pnpm 10, such as `pnpm@10.33.0`.
- Published packages: update public package versions to `4.0.0` where they are part of the EMP v4 release surface.
- Engines: set Node to `>=22.12.0` for the root and published packages.
- pnpm: set the root engine to `10.x`.

The v4 breaking changes are:

- Node 22 baseline.
- pnpm 10 baseline.
- Rspack 2 runtime and config compatibility.
- Official Module Federation 2.x Rspack integration for `@empjs/share`.

## Dependency Strategy

`@empjs/cli` should move to Rspack 2-compatible packages:

- `@rspack/core`: `^2.0.0`
- `@rspack/dev-server`: compatible `2.x`
- `@rspack/plugin-react-refresh`: compatible `2.x`, in `@empjs/plugin-react`

`@empjs/share` should remove:

- `@empjs/module-federation-rspack`

`@empjs/share` should use official Module Federation 2.x packages:

- Prefer `@module-federation/rspack` for the Rspack plugin.
- Use `@module-federation/runtime` and `@module-federation/sdk` on the same 2.x line.
- Use `@module-federation/enhanced/rspack` only if the final API check shows it is required for current `dts`, `manifest`, or runtime plugin behavior.

The implementation should not pin every package to the same patch number. Rspack packages have different latest patch lines, so the migration should follow peer compatibility rather than force-matching patch versions.

## `@empjs/share` Federation Design

`@empjs/share` keeps its external plugin API stable:

```ts
pluginRspackEmpShare({
  name,
  remotes,
  exposes,
  shared,
  dts,
  manifest,
  empRuntime,
  forceRemotes,
})
```

Internally, `packages/emp-share/src/helper/rspack.ts` should stop exporting `ModuleFederationPlugin` from `@empjs/module-federation-rspack`. It should import from the official Module Federation Rspack integration.

If the official plugin options do not exactly match the current EMP option shape, add a thin local adapter that normalizes options before constructing the official plugin. The adapter should be small and local to `@empjs/share`; it should not become a new fork.

The historical fork patch should be replaced by these rules:

- EMP remains the user-facing SDK facade through `@empjs/share/sdk`.
- Type sync should continue to work through the official Module Federation 2.x DTS capabilities.
- EMP-specific compatibility logic belongs in `@empjs/share`, not in a renamed external fork.

## Runtime Plugin Resolution

Several code paths currently rely on `require.resolve(...)` from ESM output. v4 can keep this behavior where it remains safe, but Rspack 2 and pure ESM dependencies make package resolution more sensitive.

For `@empjs/share`, move runtime plugin path resolution into a helper, for example:

```ts
resolvePackageExport('@empjs/share/forceRemote')
```

The helper can use Node 22-compatible ESM resolution, such as `import.meta.resolve(...)`, and normalize `file://` URLs for Rspack plugin options when needed.

This keeps `forceRemotes` behavior stable while avoiding scattered `require.resolve(...)` calls in the federation plugin code.

## Rspack 2 Compatibility Notes

Rspack 2 is pure ESM and requires Node `^20.19.0 || >=22.12.0`. EMP v4 selects the Node 22 side of that range.

Config areas that need direct audit during implementation:

- `experiments.rspackFuture`
- `experiments.cache`
- `experiments.incremental`
- `experiments.parallelLoader`
- `lazyCompilation`
- `resolve.tsConfig`
- CSS minimizer plugin availability
- `rspack.experiments.EsmLibraryPlugin`
- dev server construction and WebSocket behavior
- React refresh plugin path and peer dependency

The existing `isOldRspack` compatibility branch can stay if it remains harmless, but Rspack 2 behavior should be the primary path for v4.

## ESM-Only Decision

EMP v4 should be ESM-first, not ESM-only.

Reasons:

- Many public packages still expose `exports.require`.
- Several packages still build `.cjs` and `.d.cts` artifacts.
- `@empjs/chain` supports string plugin paths and currently resolves them with `require(pluginPath)`.
- Many plugins and bridge packages still use CJS output as part of their public compatibility surface.
- Combining Rspack 2, Module Federation 2.x, and full ESM-only in one release would multiply migration risk.

Recommended release path:

- `v4.0.0`: Node 22, pnpm 10, Rspack 2, Module Federation 2.x, ESM-first, CJS-compatible.
- `v4.x`: replace internal `require.resolve(...)` and `require(...)` hotspots where the replacement is low risk.
- `v5` candidate: consider true ESM-only after downstream plugins, examples, docs, and package consumers pass an ESM-only test matrix.

## Verification Matrix

Toolchain checks:

```bash
node -v
pnpm -v
```

Expected:

- Node is `>=22.12.0`.
- pnpm is `10.x`.

Dependency checks:

```bash
pnpm list @rspack/core @rspack/dev-server @rspack/plugin-react-refresh --depth 0 --filter @empjs/cli --filter @empjs/plugin-react
pnpm list @module-federation/rspack @module-federation/runtime @module-federation/sdk @empjs/module-federation-rspack --depth 0 --filter @empjs/share
```

Expected:

- `@rspack/core` is `2.x`.
- `@rspack/dev-server` is compatible `2.x`.
- `@rspack/plugin-react-refresh` is compatible `2.x`.
- `@empjs/share` no longer depends on `@empjs/module-federation-rspack`.
- Module Federation packages are on the official `2.x` line.

Build checks:

```bash
pnpm --filter @empjs/chain build
pnpm --filter @empjs/cli build
pnpm --filter @empjs/share build
pnpm --filter @empjs/plugin-react build
```

Example checks:

```bash
pnpm --filter mf-host build
pnpm --filter mf-app build
pnpm --filter rtHost build
pnpm --filter rtProvider build
```

The example checks cover:

- Module Federation manifest generation.
- DTS generation and consumption.
- Runtime plugin registration.
- `forceRemotes`.
- External runtime injection.
- React HMR plugin compatibility.

Compatibility checks:

```bash
node -e "import('@empjs/cli').then(m => console.log(Boolean(m.runScript)))"
node -e "console.log(Boolean(require('./packages/cli/dist/index.cjs')))"
```

Expected:

- ESM import works.
- CJS require compatibility remains available after build.

## Rollback Strategy

The dependency migration should be scoped to package manifests, lockfile updates, and minimal adapter code. If Rspack 2 or official Module Federation 2.x breaks a critical path, rollback should be possible by reverting those dependency and adapter changes without touching unrelated plugin APIs.

Do not remove CJS exports in the same change. Keeping CJS compatibility reduces rollback risk.

## Implementation Checks Before Editing

Before implementation edits, verify these package-level facts and apply the stated fallback:

- Start with `@module-federation/rspack`; switch the adapter to `@module-federation/enhanced/rspack` only if `manifest`, `dts`, or runtime plugin checks fail with the direct Rspack package.
- Keep `rspack.experiments.EsmLibraryPlugin` only if Rspack 2 still exports and runs it; otherwise remove or replace that optional `isESM` branch without changing the public `build.useESM` option.
- Keep `ts-checker-rspack-plugin@1.1.6` only if it supports Rspack 2 in practice; otherwise upgrade it, replace it, or keep the checker disabled behind the existing `tsCheckerRspackPlugin` option.
- Keep `html-webpack-plugin`, `sass-loader`, and `less-loader` if builds pass with acceptable peer warnings; otherwise update the affected package versions in the same dependency migration.
