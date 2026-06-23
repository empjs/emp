# Changelog

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
