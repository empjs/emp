# Validation And Release

Use this reference when an agent must prove an EMP v4 change, app integration, or formal release.

## Inputs to collect

- Change scope: application integration, package source, website/docs, release automation, or GitHub release content.
- Required validation lane: app build, browser behavior, repository gate, release dry-run, or release acceptance HTML.
- Release target version and whether the output is a formal release.
- GitHub Release asset requirements, especially the EMP Federation Fox version cover.

## Files to inspect

- `package.json`
- `pnpm-workspace.yaml`
- `.github/workflows/ci.yml`
- `scripts/**`
- `apps/**/test/browser/*.browser.ts`
- `.release/acceptance/index.html`
- `docs/assets/emp-v4-readme-logo.png`

## Success evidence

- Validation command output is captured with pass/fail status.
- Apps acceptance covers package build, app contracts, and library output smoke checks.
- Browser tests are included when behavior depends on host/remote rendering, routing, proxy, runtime SDK, or CSS output.
- Release dry-run excludes `apps/**` and `website` from publish packages.
- Release acceptance HTML is generated as a version credential.
- GitHub Releases and GitHub Tags contain the final public release and tag surface.

## GitHub Releases

- Release page: https://github.com/empjs/emp/releases
- New release and blog-like launch notes should live on GitHub Releases, not as separate website blog navigation.

## GitHub Tags

- Tags page: https://github.com/empjs/emp/tags
- Use tags as the canonical history for version snapshots and changelog comparisons.

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

## Version Cover

Every GitHub tag release needs a 版本封面 before publishing the release body.

- Use EMP Federation Fox as the project IP. Do not use the Rspack mascot or another project's brand.
- Follow the Rspack-style composition from the reference: project IP mark and `EMP v4` brand lockup in the 左上角, version pill in the upper-right, and the version feature topic in the main visual area.
- Use `docs/assets/emp-v4-readme-logo.png` as the IP source, or generate a version-specific `docs/assets/emp-v4-<version>-release-hero.png` with imagegen.
- Upload the selected cover as a GitHub Release asset.
- Put the image before the 中文 release notes so the release page opens with the cover.

Release body image example:

```md
![EMP v4 发布封面](https://github.com/empjs/emp/releases/download/<tag>/<asset>.png)
```

## Final Git Checks

Before commit or push:

```bash
git status --short --branch
git diff --check
git diff --cached --check
```

Stage only files owned by the current task. Preserve unrelated dirty files.
