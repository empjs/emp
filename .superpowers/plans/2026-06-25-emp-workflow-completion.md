# EMP Workflow Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 补齐 EMP 当前 workflow 缺口：repo-local Skill、重复检查自动化、Git/PR/Review 闭环、目录边界和验证矩阵。

**Architecture:** 以 `AGENTS.md` 作为人工/代理协作总入口；以 `skills/emp-workflow/` 承载可复用流程；以 `scripts/emp-workflow-check.mjs` 和 `pnpm workflow:check` 提供可重复检查，并接入 `pnpm ci:verify`；以 GitHub PR 资产固化 Review 闭环。

**Tech Stack:** Markdown, Node.js ESM, pnpm 10.33.0, GitHub Actions, skill-creator.

## Global Constraints

- 默认使用中文沟通；说明、进度同步、评审意见与问题反馈均优先中文。
- 开始任务前确认 live checkout，不沿用历史 workflow 假设。
- 不覆盖用户已有改动；只修改 workflow 补齐相关文件。
- EMP 项目级 Skill 统一放在 `skills/<skill-name>/`，新建或更新必须遵循 `skill-creator`。
- CI workflow 只做验证，不配置 npm publish 权限或 token。
- 修改 GitHub Actions、AGENTS 或自动化脚本时，至少运行 `git diff --check`，并确认 CI workflow 没有误引入 `NODE_AUTH_TOKEN`、`npm publish` 或 `release:publish`。

---

### Task 1: Create Repo Skill

**Files:**
- Create: `skills/emp-workflow/SKILL.md`
- Create: `skills/emp-workflow/agents/openai.yaml`
- Create: `skills/emp-workflow/references/change-matrix.md`

**Interfaces:**
- Produces: repo-local skill entrypoint `$emp-workflow`.

- [x] **Step 1: Initialize the skill**

Run:
```bash
python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/init_skill.py emp-workflow --path skills --resources references --interface display_name="EMP Workflow" --interface short_description="EMP repo workflow and validation guide" --interface default_prompt="Use $emp-workflow to plan and validate an EMP repository change."
```

Expected: `skills/emp-workflow/` exists with `SKILL.md`, `agents/openai.yaml`, and `references/`.

- [x] **Step 2: Replace template content**

Write `SKILL.md` with concise EMP workflow instructions and put detailed directory/test/review matrix in `references/change-matrix.md`.

- [x] **Step 3: Validate the skill**

Run:
```bash
python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/emp-workflow
```

Expected: validation passes.

### Task 2: Add Workflow Automation

**Files:**
- Create: `scripts/emp-workflow-check.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `pnpm workflow:check`.
- Updates: `pnpm ci:verify` includes `pnpm workflow:check`.

- [x] **Step 1: Add the check script first and observe current failures**

Create `scripts/emp-workflow-check.mjs` to check required workflow assets, skill shape, AGENTS sections, package scripts, and CI publish-safety patterns.

Run:
```bash
node scripts/emp-workflow-check.mjs
```

Expected before all assets are present: fail with explicit missing-file or missing-section output.

- [x] **Step 2: Add package scripts**

Update `package.json` with:
```json
"workflow:check": "node scripts/emp-workflow-check.mjs"
```

Update `ci:verify` so it starts with `pnpm workflow:check`.

- [x] **Step 3: Re-run the check**

Run:
```bash
pnpm workflow:check
```

Expected after all assets are present: pass.

### Task 3: Add Git/PR/Review Closure

**Files:**
- Create: `.github/CODEOWNERS`
- Create: `.github/pull_request_template.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Produces: PR checklist and review ownership hints.

- [x] **Step 1: Add GitHub review assets**

Create `CODEOWNERS` and PR template that require scope, directory boundary, test evidence, review gate, and publish-safety checks.

- [x] **Step 2: Update AGENTS**

Add sections for directory boundaries and Git / PR / Review closure. Keep the text concrete and command-backed.

- [x] **Step 3: Run workflow check**

Run:
```bash
pnpm workflow:check
```

Expected: pass.

### Task 4: Final Verification

**Files:**
- Read: all changed workflow files.

**Interfaces:**
- Produces: verified final status.

- [x] **Step 1: Run skill validation**

Run:
```bash
python3 /Users/Bigo/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/emp-workflow
```

Expected: pass.

- [x] **Step 2: Run workflow and release checks**

Run:
```bash
pnpm workflow:check
pnpm test:rules
pnpm release:check
git diff --check
```

Expected: all pass; `release:check` keeps publish scope under `packages/**`.

- [x] **Step 3: Confirm CI publish-safety**

Run:
```bash
rg -n "NODE_AUTH_TOKEN|npm publish|release:publish" .github/workflows/ci.yml
```

Expected: exit code 1 with no matches.
