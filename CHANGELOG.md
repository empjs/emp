# Changelog

## 4.0.0-alpha.2 - 2026-06-23

### Highlights

- Optimize `@empjs/cli` defaults for Rspack 2 and remove the deprecated `experiments.css` flag.
- Expose Rspack build toggles for `nativeWatcher`, `incremental`, and `lazyCompilation` so projects can opt out when needed.
- Align Module Federation runtime dependencies in `@empjs/share` to the `^2.6.0` line.

### What's Changed

#### Build

- chore(cli): upgrade `sass-loader` to `17.0.0` and `ts-checker-rspack-plugin` to `1.4.0` for Rspack 2 peer support.
- chore(share): add `@module-federation/runtime-tools` and keep MF runtime packages on the same minor line.

#### Tests

- test(cli): assert generated Rspack config omits deprecated CSS experiment and respects build/debug overrides.
- test(share): assert Module Federation dependency versions stay aligned.

#### Verification

- `pnpm release:publish:dry`
- `pnpm release:check`
- `node --test scripts/release.test.mjs`

## 4.0.0-alpha.1 - 2026-06-23

### Highlights

- Publish EMP v4 alpha packages to npm with dist-tag `alpha`.
- Align the root workspace and 19 core `@empjs/*` packages to `4.0.0-alpha.1`.
- Keep CDN and legacy runtime package lines independent for framework-specific runtime delivery.

### What's Changed

#### New Features

- feat(release): add unified alpha release automation for core `@empjs/*` packages.
- feat(release): generate guarded npm publish commands with dry-run by default.

#### Build

- chore(release): publish with pnpm 10 workspace filters and dist-tag `alpha`.
- chore(release): exclude `projects/**`, `website`, `@empjs/cdn-*`, and `@empjs/lib-*` from the unified release set.

#### Full Changelog

- Pending GitHub release compare for `4.0.0-alpha.1`.
