# Static Index Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `emp static` 增加多 index 文件候选和美化目录首页，让本地 CDN 静态服务直接访问目录时有清晰可读的资源列表。

**Architecture:** 在 `packages/cli/src/server/static/createStaticServer.ts` 内扩展静态文件解析：目录请求优先按多个 index 候选返回文件，全部不存在时渲染目录 listing HTML。CLI 层新增 `--index <files...>` 入参并传入 `StaticServeOptions`，中心化 CDN 服务保持默认候选即可。

**Tech Stack:** Node.js `^20.19.0 || >=22.12.0`、`pnpm@10.33.0`、TypeScript、`@rstest/core`、现有 `@empjs/cli` 静态 server。

## Global Constraints

- 默认中文沟通；最终回复必须说明真实验证命令和结果。
- 只修改 `emp static` server、CLI 参数、对应测试和计划文件。
- 代码发现优先使用 `codebase-memory-mcp`；字符串或 package 脚本验证可用 `rg`。
- 新行为先写真实 HTTP 验收测试，再实现。
- 不新增依赖，不引入第二套测试 runner。
- 不修改 `packages/cdn-*`、`packages/lib-*` 的版本号、发布配置、依赖线。
- 不创建 `docs/superpowers/`。

---

### Task 1: 多 Index 候选和目录 Listing

**Files:**
- Modify: `packages/cli/test/static-server.test.ts`
- Modify: `packages/cli/src/server/static/types.ts`
- Modify: `packages/cli/src/server/static/createStaticServer.ts`

**Interfaces:**
- Produces: `StaticServeOptions.index?: string[]`
- Produces: directory request behavior:
  - `/nested/` first tries configured index candidates under that directory.
  - fallback renders HTML listing with file name, type, size, and modified time.

- [x] **Step 1: Write failing HTTP tests**

Add tests that create nested fixture files, then verify:
- `startStaticServer({index: ['home.html', 'index.html']})` returns `home.html` for `/docs/`.
- `startStaticServer({index: ['missing.html']})` returns a styled HTML listing for `/assets/`.

- [x] **Step 2: Verify RED**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test:real -- static-server.test.ts
```

Expected: fail because `StaticServeOptions.index` and directory listing behavior do not exist.

- [x] **Step 3: Implement minimal server behavior**

Add `index?: string[]` to `StaticServeOptions`, introduce default candidates `['index.html']`, resolve directory requests with safe path normalization, and render an escaped HTML directory listing when no candidate exists.

- [x] **Step 4: Verify GREEN**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test:real -- static-server.test.ts
```

Expected: all static-server tests pass.

### Task 2: CLI 参数和 Help 覆盖

**Files:**
- Modify: `packages/cli/src/script/static.ts`
- Modify: `packages/cli/src/script/index.ts`
- Modify: `packages/cli/test/cli-help.test.mjs`

**Interfaces:**
- Consumes: `StaticServeOptions.index?: string[]`
- Produces: `emp static --index home.html index.html` support.

- [x] **Step 1: Write failing CLI help test**

Update CLI help assertions to require `--index <files...>`.

- [x] **Step 2: Verify RED**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test
```

Expected: fail because help output does not include `--index`.

- [x] **Step 3: Implement CLI option**

Add `.option('--index <files...>', '目录 index 候选文件，按顺序匹配')` and pass `options.index` through `normalizeStaticOptions`.

- [x] **Step 4: Verify GREEN**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test
```

Expected: CLI tests pass.

### Task 3: Final Verification

**Files:**
- Read-only verification across changed files.

- [x] **Step 1: Run focused real tests**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test:real -- static-server.test.ts
```

- [x] **Step 2: Run repo gates**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm workflow:check
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test
git diff --check
```

- [x] **Step 3: Smoke a CDN directory**

Run a temporary `cdn-react-18` static server and request `/` to confirm it returns a readable HTML directory listing.

- [x] **Step 4: Update plan checklist**

Mark completed items in this file after verification passes.

### Task 4: TypeScript Files And Apple Tile Listing

**Files:**
- Modify: `packages/cli/test/static-server.test.ts`
- Modify: `packages/cli/src/server/static/createStaticServer.ts`

**Interfaces:**
- Produces: `.ts` and `.tsx` static files return `text/plain; charset=utf-8` and file body so browsers open them as readable source files.
- Produces: directory listing HTML uses Apple-like tile/card layout classes:
  - `emp-static-shell`
  - `emp-static-grid`
  - `emp-static-card`

- [x] **Step 1: Write failing HTTP tests**

Add a fixture `assets/source.ts` and assert `/assets/source.ts` returns the source body with `text/plain` content type. Extend directory listing assertions to require Apple-like tile classes and card links.

- [x] **Step 2: Verify RED**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test:real -- static-server.test.ts
```

Expected: fail because `.ts` content type is still `application/octet-stream` and listing still uses the table layout.

- [x] **Step 3: Implement file type and tile UI**

Add `.ts` / `.tsx` to `contentTypes`. Replace directory table markup with a responsive tile grid using the class names above while preserving escaped file names, links, size, type, and modified time.

- [x] **Step 4: Verify GREEN**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test:real -- static-server.test.ts
```

Expected: all static-server tests pass.

### Task 5: Inline SVG Icons And Extension Badges

**Files:**
- Modify: `packages/cli/test/static-server.test.ts`
- Modify: `packages/cli/src/server/static/createStaticServer.ts`

**Interfaces:**
- Produces: directory listing cards include inline SVG icons without adding an icon dependency.
- Produces: directory cards use `emp-static-folder-card`, file cards use `emp-static-file-card`.
- Produces: file cards include an extension badge with class `emp-static-badge`, for example `TS`, `JS`, `CSS`, or `FILE`.

- [x] **Step 1: Write failing HTTP tests**

Extend the directory listing test to require:
- `<svg class="emp-static-svg"`
- `class="emp-static-file-card"`
- `class="emp-static-badge">TS</span>`
- `class="emp-static-badge">JS</span>`

- [x] **Step 2: Verify RED**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test:real -- static-server.test.ts
```

Expected: fail because the listing currently renders text-only icons.

- [x] **Step 3: Implement minimal inline icon helpers**

Add local helper functions that render escaped extension badges and monochrome inline SVG document/folder icons. Keep icons dependency-free and compatible with Apple-inspired styling.

- [x] **Step 4: Verify GREEN**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test:real -- static-server.test.ts
```

Expected: all static-server tests pass.

### Task 6: Subtle File-Type Icon Colors

**Files:**
- Modify: `packages/cli/test/static-server.test.ts`
- Modify: `packages/cli/src/server/static/createStaticServer.ts`

**Interfaces:**
- Produces: file icon wrappers include extension color classes such as `emp-static-kind-js` and `emp-static-kind-ts`.
- Produces: low-saturation CSS color rules scoped to icon and badge surfaces only.

- [x] **Step 1: Write failing color-class HTTP test**

Extend the directory listing test to require `emp-static-kind-js` and `emp-static-kind-ts`.

- [x] **Step 2: Verify RED**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test:real -- static-server.test.ts
```

Expected: fail because type color classes do not exist.

- [x] **Step 3: Implement subtle color classes**

Add `extensionColorClass()` and scoped CSS for JS, TS/TSX, CSS, HTML, JSON, and Vue.

- [x] **Step 4: Verify GREEN**

Run:

```bash
PATH=/tmp/emp-corepack-bin:$PATH pnpm --filter @empjs/cli test:real -- static-server.test.ts
```

Expected: all static-server tests pass.
