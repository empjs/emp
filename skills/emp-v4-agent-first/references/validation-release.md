# Validation And Release

Use this reference when an agent must prove an EMP v4 change, app integration, or release candidate.

## Application-Level Validation

For a consuming app, minimum validation should include:

```bash
pnpm emp build
```

Then inspect:

- generated manifest.
- remote exposed files.
- host `remotes` URL.
- generated DTS artifacts when types are expected.
- browser console and network requests for host-to-remote loading.

## Repository Gates

For this EMP repository, use:

```bash
corepack pnpm workflow:check
corepack pnpm ci:verify
corepack pnpm empbuild
corepack pnpm apps:acceptance
```

`corepack pnpm ci:verify` runs workflow, toolchain, tsconfig, TypeScript 7 package checks, CLI tests, package tests, rules, release check, and Rslib preset checks.

## Apps Acceptance

```bash
corepack pnpm apps:acceptance
```

This covers TypeScript config, package builds, apps catalog checks, app single-target acceptance, and library output smoke checks.

Browser coverage stays separate:

```bash
corepack pnpm test:apps:browser
```

Use browser tests when the changed behavior depends on actual host/remote rendering, routing refresh, proxy diagnostics, runtime SDK behavior, or CSS output visible in a page.

## Release Dry Run

```bash
corepack pnpm release:publish:dry -- --skip-build
```

Dry run must stay scoped to package publishing logic and must not include `apps/**` or `website` as publish packages.

## Release Acceptance Evidence

```bash
corepack pnpm release:acceptance
corepack pnpm release:acceptance -- --include-browser
```

The command writes `.release/acceptance/index.html` as a release credential. Use it as evidence for command status, coverage, release boundaries, and skipped optional lanes.

## Final Git Checks

Before commit or push:

```bash
git status --short --branch
git diff --check
git diff --cached --check
```

Stage only files owned by the current task. Preserve unrelated dirty files.
