# codebase-memory-mcp Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch the EMP workflow from repo-local `.codegraph` data to the shared `codebase-memory-mcp` graph service.

**Architecture:** Keep repository guidance in `AGENTS.md`, store no CodeGraph database in git, and rely on `codebase-memory-mcp` MCP tools for code discovery. Use the local `codebase-memory-mcp` CLI only for indexing and status checks; use `rg` and `find` only for config, docs, and literal-string checks.

**Tech Stack:** Codex MCP, `codebase-memory-mcp 0.8.1`, Markdown workflow docs, git ignore rules.

## Global Constraints

- 默认使用中文沟通，先给结果再给必要依据。
- 开始前确认 live checkout：当前分支、`git status --short --branch`、`AGENTS.md`、`.codex/config.toml`、MCP 索引状态。
- 不覆盖用户已有改动；相关改动基于当前文件继续。
- 代码发现优先使用 `codebase-memory-mcp`，配置、文档、字符串引用可退回本地命令。
- `.codegraph/` 不再作为仓库工作流入口或可提交数据来源。

---

### Task 1: Establish codebase-memory-mcp as the active graph source

**Files:**
- Modify: `AGENTS.md`
- Modify: `.gitignore`
- Delete: `.codegraph/.gitignore`
- Delete: `.codegraph/codegraph.db`

**Interfaces:**
- Consumes: `codebase-memory-mcp cli index_repository '{"repo_path":"/Users/Bigo/Desktop/develop/fontend-workspace/emp"}'`
- Produces: MCP project `Users-Bigo-Desktop-develop-fontend-workspace-emp` with `index_status.status = ready`

- [x] **Step 1: Verify the old workflow is present**

Run: `rg -n "\.codegraph|codegraph|CodeGraph" -S --hidden -g '!node_modules' -g '!.git'`

Expected before migration: finds `.codegraph` or CodeGraph references in repository guidance or tracked data.

- [x] **Step 2: Index the repository through codebase-memory-mcp**

Run: `/Users/Bigo/.local/bin/codebase-memory-mcp cli index_repository '{"repo_path":"/Users/Bigo/Desktop/develop/fontend-workspace/emp","project":"emp"}'`

Expected: JSON output with `"status":"indexed"` and project name `Users-Bigo-Desktop-develop-fontend-workspace-emp`.

- [x] **Step 3: Verify MCP project status**

Run through MCP: `list_projects`, then `index_status(project="Users-Bigo-Desktop-develop-fontend-workspace-emp")`

Expected: project exists and status is `ready`.

- [x] **Step 4: Update workflow guidance**

Change `AGENTS.md` so live checkout checks use `codebase-memory-mcp` project status instead of `codegraph status .`, and rename the graph priority section to `codebase-memory-mcp`.

- [x] **Step 5: Remove repo-local CodeGraph data**

Delete `.codegraph/.gitignore` and `.codegraph/codegraph.db`, then add `.codegraph/` to the root `.gitignore`.

- [x] **Step 6: Verify migration**

Run:

```bash
codex mcp list
/Users/Bigo/.local/bin/codebase-memory-mcp cli list_projects
/Users/Bigo/.local/bin/codebase-memory-mcp cli index_status '{"project":"Users-Bigo-Desktop-develop-fontend-workspace-emp"}'
rg -n "codegraph status|CodeGraph" AGENTS.md
rg -n "^\\.codegraph/$" .gitignore
git status --short --branch
git diff --check
```

Expected: MCP server enabled, project ready, no workflow instruction points back to `codegraph status .`, root `.gitignore` ignores `.codegraph/`, and the git diff is whitespace-clean.
