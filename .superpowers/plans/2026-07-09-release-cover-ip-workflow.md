# Release Cover IP Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make version-tag release covers a required part of the EMP release workflow, using the EMP Federation Fox project IP in the top-left brand area.

**Architecture:** Add a deterministic release-cover section to the changelog generator so every generated release entry carries the requirement. Add Agent-First release guidance so agents creating GitHub Releases know to upload the cover asset and place it first in the release body. Guard both surfaces with existing Rstest release and skill rules.

**Tech Stack:** Node release scripts, Rstest, EMP Agent-First skill references, GitHub Release Markdown.

## Global Constraints

- Do not use the Rspack mascot or Rspack brand; only use EMP Federation Fox as the project IP.
- The cover layout requirement must reference the Rspack-style top-left brand lockup: project IP mark plus product name in the upper-left corner.
- Release body must be Chinese-first and place the cover image before the release notes.
- Keep generated release cover assets under `docs/assets/` and upload the chosen cover as a GitHub Release asset.
- Preserve unrelated existing website/style dirty changes.
- Do not move existing tags or force-push release tags.

---

### Task 1: Add Release Rules For Cover Guidance

**Files:**
- Modify: `test/release.rules.test.ts`
- Modify: `test/agent-first-skill.rules.test.ts`

**Interfaces:**
- Consumes: `renderChangelogEntry(...)` output and `skills/emp-v4-agent-first/references/validation-release.md`.
- Produces: deterministic assertions that release workflow documents the tag cover requirement.

- [x] **Step 1: Add changelog template assertions**

In `renderChangelogEntry and prependChangelog create a concise release-notes entry`, assert:

```ts
expect(entry).toMatch(/### Release Cover/)
expect(entry).toMatch(/EMP Federation Fox/)
expect(entry).toMatch(/左上角/)
expect(entry).toMatch(/docs\/assets\/emp-v4-readme-logo\.png/)
expect(entry).toMatch(/GitHub Release asset/)
expect(entry).toMatch(/中文 release notes/)
```

- [x] **Step 2: Add Agent-First release reference assertions**

In the validation marker list, assert:

```ts
'版本封面',
'EMP Federation Fox',
'左上角',
'docs/assets/emp-v4-readme-logo.png',
'GitHub Release asset',
'中文 release notes',
```

- [x] **Step 3: Run RED check**

Run:

```bash
corepack pnpm test:rules
```

Expected: FAIL until the release template and Agent-First reference are updated.

### Task 2: Implement Release Cover Workflow Text

**Files:**
- Modify: `scripts/release-core.mjs`
- Modify: `skills/emp-v4-agent-first/references/validation-release.md`

**Interfaces:**
- Produces: generated changelog entries and Agent-First release instructions with the same release cover contract.

- [x] **Step 1: Update generated changelog entry**

Add a `### Release Cover` section before `### What's Changed`:

```md
### Release Cover

- GitHub Release cover must use EMP Federation Fox project IP in the top-left brand lockup, following the Rspack-style layout: project IP mark + `EMP v4` name at the upper-left, version pill at the upper-right, and the release topic in the main visual area.
- Use `docs/assets/emp-v4-readme-logo.png` as the IP source, or generate a version-specific `docs/assets/emp-v4-<version>-release-hero.png` asset with imagegen.
- Upload the selected cover as a GitHub Release asset and place it before the Chinese release notes.
```

- [x] **Step 2: Update Agent-First release guidance**

Add a `## Version Cover` section to `skills/emp-v4-agent-first/references/validation-release.md` with the same requirements plus an example body:

```md
![EMP v4 发布封面](https://github.com/empjs/emp/releases/download/<tag>/<asset>.png)
```

- [x] **Step 3: Validate the skill folder**

Run:

```bash
python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/emp-v4-agent-first
```

Expected: PASS.

### Task 3: Verify And Ship

**Files:**
- All files modified by Tasks 1-2.

**Interfaces:**
- Produces: a scoped release-workflow commit on `v4`.

- [x] **Step 1: Run focused validation**

Run:

```bash
corepack pnpm test:rules
corepack pnpm release:check
git diff --check -- scripts/release-core.mjs test/release.rules.test.ts test/agent-first-skill.rules.test.ts skills/emp-v4-agent-first/references/validation-release.md .superpowers/plans/2026-07-09-release-cover-ip-workflow.md
```

Expected: PASS.

- [x] **Step 2: Commit scoped files**

Stage only the files in this plan, then run:

```bash
git diff --cached --check
git commit -m "docs(release): require project ip release cover"
```

- [x] **Step 3: Push branch**

Run:

```bash
git push origin v4
```
