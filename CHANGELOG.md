# Changelog

## 4.0.0-alpha.3 - 2026-06-25

### Highlights

- Add the agent-first `emp create` flow in `@empjs/cli`, including intent parsing, project generation, command execution, verification, JSON reports, fixer support, dynamic ports, dev readiness probes, and atomic failed-report writes.
- Add `empRuntime.version: true` in `@empjs/share` to isolate same-page multi-version Module Federation scopes and CSS Modules prefixes.
- Ship Tailwind 4.3.1 alignment for `@empjs/plugin-tailwindcss` and keep the release scope limited to the 19 core internal packages.
- Add consumer migration guidance in `docs/v4-alpha-migration.md`, including the alpha install path, package scope, Rspack 2 notes, Module Federation behavior, and validation commands.

### What's Changed

#### New Features

- feat(cli): add agent-first project creation, verification, report, and fixer flows.
- feat(share): add opt-in `empRuntime.version` isolation for shared runtime packages.
- feat(workflow): add repo-local workflow gates, PR review assets, and CI verification entrypoints.

#### Build

- chore(release): align root workspace and 19 core `@empjs/*` packages to `4.0.0-alpha.3`.
- chore(ci): make `pnpm test:cli` build `@empjs/chain` before CLI tests so clean GitHub runners do not depend on stale local `dist/`.
- chore(release): keep `apps/**`, `website`, `@empjs/cdn-*`, and `@empjs/lib-*` out of the unified release set.

#### Tests

- test(cli): cover agent create planning, generation, command execution, failed reports, fixer behavior, and real CLI flows with Rstest.
- test(share): cover legacy and versioned `empRuntime.version` behavior, including CSS Modules prefix preservation and package metadata fallback.

#### Full Changelog

- Pending GitHub release compare for `4.0.0-alpha.3`.

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
- chore(release): exclude `apps/**`, `website`, `@empjs/cdn-*`, and `@empjs/lib-*` from the unified release set.

#### Full Changelog

- Pending GitHub release compare for `4.0.0-alpha.1`.
