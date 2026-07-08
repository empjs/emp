---
name: emp-v4-agent-first
description: EMP v4 Agent-First usage guide for Codex agents and automation. Use when creating or configuring EMP v4 projects, plugins, Module Federation host/remote/shared/manifest work, validation gates, release evidence, or when official docs point to repository skills for complete usage.
---

# EMP v4 Agent-First

Use this skill when the user wants an agent-readable EMP v4 usage path instead of a prose-only docs page. This skill lives at `skills/emp-v4-agent-first` and treats the repository as the canonical manual.

## Routing

- For environment setup, installation, `emp create`, `emp doctor --json`, and generated project reports, read `references/project-setup.md`.
- For host, remote, `exposes`, `remotes`, `shared`, manifest, DTS, runtime scope, and `pluginRspackEmpShare`, read `references/module-federation.md`.
- For framework, CSS, quality packages, and plugins configuration, read `references/plugins.md`.
- For repository validation, app acceptance, release dry-run, release acceptance HTML, and evidence collection, read `references/validation-release.md`.

## Workflow

1. Identify whether the task is new project creation, existing project configuration, plugin wiring, federation wiring, or release validation.
2. Load only the reference file needed for that task before editing or answering.
3. Prefer repository examples and validation commands over generic bundler advice.
4. Keep application usage separate from EMP repository release gates. Application teams need build, manifest, type, and browser checks; repository release work needs the full validation gate.
5. When updating official docs, keep detailed usage in this skill and link the docs page back to this repository path.

## Boundaries

- Keep usage examples aligned with EMP v4, Rspack 2, Module Federation 2, TypeScript 7 rc, and pnpm 10.
- Treat `@empjs/cdn-*` and `@empjs/lib-*` as independent package lines unless the user explicitly asks about them.
- Use Tailwind CSS 4 as the current Tailwind line.
- Do not present `apps/**` or `website` as publish package scope; they are examples, acceptance surfaces, or docs.
