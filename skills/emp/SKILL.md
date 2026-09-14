---
name: emp
description: Complete EMP v4 Agent-First configuration and usage guide for Codex agents and automation. Use when creating, migrating, configuring, debugging, validating, or releasing EMP v4 projects; choosing build targets and formats; configuring HTML, entries, dev server, CSS, plugins, Module Federation, advanced Rspack hooks, or when official docs point to repository skills for complete usage.
---

# EMP

Use this skill when the user wants an agent-readable EMP v4 usage path instead of a prose-only docs page. This skill lives at `skills/emp` and treats the repository as the canonical manual.

## Task Map

| Task | Read first | Success evidence |
| --- | --- | --- |
| project creation | `references/project-setup.md` | `emp doctor --json`, `emp create --dry-run --json`, generated `emp-report.json` |
| existing project migration | `references/project-setup.md`, then `references/validation-release.md` | package diff, build output, migration notes, validation command results |
| complete config lookup | `references/configuration.md` | every public `EmpOptions` field is classified and the effective config matches intent |
| build compatibility or output format | `references/build-compatibility.md` | Rspack/SWC/CSS targets align; HTML script format and polyfills match the browser contract |
| legacy configuration compatibility | `references/legacy-compatibility.md` | complete project build, normalized config assertions, artifacts, and browser interaction pass |
| HTML, entries, server, CSS | `references/html-server-css.md` | generated pages, dev-server behavior, and styles match config |
| cache, define, output, hooks, debug | `references/advanced-configuration.md` | resolved Rspack config and diagnostics prove the advanced override |
| Module Federation | `references/module-federation.md` | manifest URL, remote entry, host consumption, shared singleton, DTS checks |
| plugin selection | `references/plugins.md` | selected plugin list, config diff, build output, browser evidence when UI/runtime behavior changes |
| app acceptance | `references/validation-release.md` | `corepack pnpm apps:acceptance` and optional browser lane when behavior depends on a page |
| release evidence | `references/validation-release.md` | `corepack pnpm ci:verify`, `corepack pnpm release:acceptance`, release cover, Chinese notes |
| GitHub releases and new content | `references/validation-release.md` | GitHub releases page and GitHub tags page link to the final release surface |

Canonical public links:

- GitHub releases: https://github.com/empjs/emp/releases
- GitHub tags: https://github.com/empjs/emp/tags

## Routing

- For environment setup, installation, `emp create`, `emp doctor --json`, and generated project reports, read `references/project-setup.md`.
- For any `emp.config.ts` field lookup, config migration, precedence, or deprecation decision, read `references/configuration.md`.
- For `build.targets`, `build.format`, syntax target, polyfill, source maps, minimization, or Rspack 2 build options, read `references/build-compatibility.md`.
- For deprecated aliases, their canonical replacements, conflict handling, or the complete compatibility project, read `references/legacy-compatibility.md`.
- For app entry paths, HTML, multiple entries, dev server, Sass, Less, or CSS Modules prefixes, read `references/html-server-css.md`.
- For cache, define, externals, resolve, output, chain, lifecycle, warnings, checkers, and debug options, read `references/advanced-configuration.md`.
- For host, remote, `exposes`, `remotes`, `shared`, manifest, DTS, runtime scope, and `pluginRspackEmpShare`, read `references/module-federation.md`.
- For framework, CSS, quality packages, and plugins configuration, read `references/plugins.md`.
- For repository validation, app acceptance, release dry-run, release acceptance HTML, and evidence collection, read `references/validation-release.md`.

## Workflow

1. Identify whether the task is creation, core configuration, build compatibility, page/server/CSS configuration, advanced override, plugin wiring, federation wiring, or release validation.
2. Load only the reference file needed for that task before editing or answering.
3. Prefer repository examples and validation commands over generic bundler advice.
4. Keep application usage separate from EMP repository release gates. Application teams need build, manifest, type, and browser checks; repository release work needs the full validation gate.
5. When updating official docs, keep detailed usage in this skill and link the docs page back to this repository path.

## Boundaries

- Keep usage examples aligned with EMP v4, Rspack 2, Module Federation 2, TypeScript 7 stable, and pnpm 12.
- Treat `@empjs/cdn-*` and `@empjs/lib-*` as independent package lines unless the user explicitly asks about them.
- Use Tailwind CSS 4 as the current Tailwind line.
- Prefer `build.targets`, `build.format`, `css.prefixName`, and React plugin `splitChunks`; treat documented legacy aliases as migration-only.
- Do not present `apps/**` or `website` as publish package scope; they are examples, acceptance surfaces, or docs.
