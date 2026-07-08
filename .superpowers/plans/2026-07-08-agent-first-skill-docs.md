# EMP v4 Agent-First Skill Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 EMP v4 的完整 Agent-First 使用方法收敛到仓库根目录 `skills/`，官网只提供入口和仓库路径引导。

**Architecture:** 新增项目级 Skill `skills/emp-v4-agent-first/`，`SKILL.md` 只保留执行入口和引用导航，详细使用方法拆到 `references/`。官网新增一个简短 Agent-First 页面，指向仓库 Skill 和 references，不复制完整插件/联邦配置。

**Tech Stack:** Codex Skill、Rspress v2、Markdown、Rstest、skill-creator。

## Global Constraints

- 新 Skill 必须使用 `skill-creator` 初始化到根目录 `skills/`。
- `SKILL.md` frontmatter 只保留 `name` 和 `description`。
- 详细使用方法必须放到 `skills/emp-v4-agent-first/references/`。
- 官网只做 Agent-First 入口和仓库路径引导，不复制完整配置手册。
- 当前 v4 插件线只覆盖 React、Vue 2、Vue 3、Tailwind CSS 4、PostCSS、Lightning CSS、Stylus、Biome、ESLint React。
- 不恢复 Tailwind 3 示例或文档。
- 不触碰当前 release acceptance 报告相关脏改。

---

### Task 1: 用规则测试锁定 Agent-First Skill 和官网引导

**Files:**
- Create: `test/agent-first-skill.rules.test.ts`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `test/website.rules.test.ts`

**Interfaces:**
- Consumes: `skills/emp-v4-agent-first/**`, `website/docs/zh/guide/agent-first.md`, `website/docs/zh/guide/_meta.json`, `website/docs/zh/index.mdx`
- Produces: `test:rules` 中的 Agent-First Skill 结构和官网引导规则

- [x] **Step 1: Write the failing test**

Create `test/agent-first-skill.rules.test.ts` with assertions that `skills/emp-v4-agent-first/SKILL.md`, `agents/openai.yaml`, and four reference files exist; assert plugin, federation, setup, and validation references contain the required package names and commands.

- [x] **Step 2: Register the test in root rules**

Add `test/agent-first-skill.rules.test.ts` to the `rules` target in `scripts/root-test-targets.mjs`.

- [x] **Step 3: Update website count assertion**

Change the homepage marker in `test/website.rules.test.ts` from `26 篇中文文档` to `27 篇中文文档`, because the new Agent-First page becomes part of the Chinese docs tree.

- [x] **Step 4: Run red test**

Run: `corepack pnpm test:rules`

Expected: FAIL because `skills/emp-v4-agent-first/` and `website/docs/zh/guide/agent-first.md` do not exist yet.

### Task 2: 创建仓库级 EMP v4 Agent-First Skill

**Files:**
- Create: `skills/emp-v4-agent-first/SKILL.md`
- Create: `skills/emp-v4-agent-first/agents/openai.yaml`
- Create: `skills/emp-v4-agent-first/references/project-setup.md`
- Create: `skills/emp-v4-agent-first/references/module-federation.md`
- Create: `skills/emp-v4-agent-first/references/plugins.md`
- Create: `skills/emp-v4-agent-first/references/validation-release.md`

**Interfaces:**
- Consumes: Task 1 test expectations and current EMP v4 package/plugin surface.
- Produces: Agent-readable usage contract for creating, configuring, validating, and releasing EMP v4 projects.

- [x] **Step 1: Initialize the skill**

Run:

```bash
python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/init_skill.py emp-v4-agent-first --path skills --resources references --interface display_name="EMP v4 Agent-First" --interface short_description="EMP v4 usage guide for agents" --interface default_prompt='Use $emp-v4-agent-first to configure an EMP v4 project with plugins, federation, and validation gates.'
```

- [x] **Step 2: Replace generated placeholder content**

Write `SKILL.md` as a concise routing guide and move detailed commands/configuration into the four reference files.

- [x] **Step 3: Validate the skill**

Run:

```bash
python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/emp-v4-agent-first
```

Expected: PASS.

### Task 3: 让官网成为 Agent-First 仓库入口

**Files:**
- Create: `website/docs/zh/guide/agent-first.md`
- Modify: `website/docs/zh/guide/_meta.json`
- Modify: `website/docs/zh/guide/index.md`
- Modify: `website/docs/zh/plugins/index.md`
- Modify: `website/docs/zh/index.mdx`

**Interfaces:**
- Consumes: `skills/emp-v4-agent-first/**`
- Produces: Rspress 官网里的 Agent-First 入口页和首页 feature 引导。

- [x] **Step 1: Add the Agent-First guide page**

Create a short page that links to `skills/emp-v4-agent-first/SKILL.md` and each reference file in the GitHub repository path.

- [x] **Step 2: Register the page**

Add `agent-first` to `website/docs/zh/guide/_meta.json`.

- [x] **Step 3: Update existing docs entry points**

Update guide index, plugin index, and homepage feature copy so users see the Agent-First repo skill as the canonical complete usage surface.

### Task 4: Verify, preview, and close

**Files:**
- Verify only, except commit metadata.

**Interfaces:**
- Consumes: Task 1-3 deliverables.
- Produces: verified local and remote branch state.

- [x] **Step 1: Run targeted and root checks**

Run:

```bash
corepack pnpm exec rstest run --config rstest.config.ts test/agent-first-skill.rules.test.ts test/website.rules.test.ts
corepack pnpm test:rules
corepack pnpm workflow:check
git diff --check
```

Expected: PASS.

- [x] **Step 2: Build website**

Run: `corepack pnpm website:build`

Expected: PASS and sitemap includes 27 pages.

- [x] **Step 3: Run CI gate**

Run: `corepack pnpm ci:verify`

Expected: PASS.

- [x] **Step 4: Refresh preview**

Verify `http://127.0.0.1:4174/` returns 200 after website build.

- [x] **Step 5: Commit and push scoped files**

Stage only the Agent-First Skill, website docs, rules tests, plan file, and root test target updates. Commit and push to `v4-rsbuild`.
