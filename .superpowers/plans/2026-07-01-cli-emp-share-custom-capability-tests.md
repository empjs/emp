# CLI And EMP Share Custom Capability Test Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` for parallel implementation. Use `superpowers:test-driven-development` inside each task: write the failing Rstest or browser case first, confirm it fails for the expected reason, implement, then run the targeted green command.

**Goal:** Build the next production-grade test wave for all user-facing customization capabilities exposed by `@empjs/cli` and `@empjs/share`, with real CLI processes, real Rspack/Rslib builds, real Module Federation behavior, real HTTP services, and browser-observable assertions.

**Architecture:** Keep each tested product in its own primary test directory. CLI real tests live under `packages/cli/test/real/` with shared process and fixture helpers in `packages/cli/test/support/`. EMP Share package tests live under `packages/emp-share/test/rspack/`, `packages/emp-share/test/runtime/`, and `packages/emp-share/test/browser/`. Root browser tests continue to use `rstest.config.ts`, and the exact command `pnpm exec rstest watch --browser --browser.headless=false` must include both apps browser cases and EMP Share browser runtime cases.

**Tech Stack:** Rstest `0.10.6`, Rstest Browser Mode, Playwright Chromium provider, Node `^20.19.0 || >=22.12.0`, pnpm `10.33.0`, Rspack `2.1.1`, Rslib `0.23.1`, Module Federation runtime and Rspack packages `^2.6.0`, EMP static service scripts.

## Global Constraints

- Default communication and review notes are Chinese.
- Plans and SDD artifacts live under `.superpowers/`; do not create `docs/superpowers/`.
- Preserve existing user or task changes; do not revert unrelated dirty files.
- Use `corepack pnpm` for scripted verification unless the exact user acceptance command intentionally uses `pnpm`.
- New tests must use Rstest as the organizing runner. Do not add Vitest, Jest, Mocha, Ava, or one-off browser scripts.
- Prefer real acceptance and integration tests over helper-only unit tests. Every behavior claim must include an input fixture, actual command or browser load, observable output, and failure text or DOM/network assertion.
- Keep `apps/**` and `website` outside package release scope. Browser and acceptance fixtures may consume apps, but package publishing metadata must not include them.
- Browser tests must be deterministic in headless and headed modes. Every spawned service or watch process must be closed by the test or runner.
- Shared files such as `rstest.config.ts`, `scripts/root-test-targets.mjs`, `scripts/emp-workflow-check.mjs`, root `package.json`, and root rules tests are integration-owned by the main controller after subagent patches return.
- Do not commit, stage, push, or create a PR during plan execution unless the user explicitly requests it.

## Capability Matrix

| Area | Public customization surface | Current risk | Production test target |
| --- | --- | --- | --- |
| CLI commands | `dev`, `build`, `serve`, `static`, `create`, unsupported `dts/init` | Some checks are source or shape based | Spawn the real `packages/cli/bin/emp.js`, assert exit code, logs, artifacts, HTTP responses, and cleanup |
| CLI options | `--env`, repeated `--env-vars`, `--doctor`, `--ts`, `--profile`, `--clearLog`, `--hot`, `--open`, `--analyze`, `--watch`, `--serve` | Option parsing is partly covered, command behavior is thin | Use real temp projects and assert config/runtime effects |
| CLI config API | `defineConfig`, config discovery, `base`, `target`, `autoDevBase`, `autoPages`, `appSrc`, `appEntry`, `build`, `html`, `entries`, `server`, `debug`, `chain`, `css`, `moduleTransform`, `cache`, `define`, `defineFix`, `externals`, `resolve`, `output`, `tsCheckerRspackPlugin` | Discovery and config shape exist, but fewer artifact assertions | Build fixtures and inspect generated HTML, assets, sourcemaps, externals, env replacement, and Rspack config output |
| CLI lifecycle and plugins | `lifeCycle`, `plugins`, plugin `rsConfig`, `beforeBuild`, `afterBuild`, `beforeDevServe`, `afterDevServe`, `beforeServe`, `afterServe` | Order checks are not fully black-box | Fixture writes lifecycle marks during real commands, then asserts order and user-visible side effects |
| EMP Share package exports | `.`, `runtime`, `mfRuntime`, `forceRemote`, `sdk`, `adapter`, `adapterVue`, `rspack`, `library`, `react`, `vue` | ESM checks exist, adapterVue and forceRemote type mapping need explicit contracts | Import every export from built package and assert type/runtime shape, including `typesVersions` coverage |
| EMP Share Rspack plugin | `pluginRspackEmpShare`, `manifest`, `empRuntime`, `runtimeLib`, `runtime`, `runtimeGlobal`, `framework`, `frameworkLib`, `frameworkGlobal`, `shareLib`, `setExternals`, `version`, `dts.consumeTypes`, `forceRemotes` | Package tests are mostly structural | Run plugin against a mock GlobalStore and against real app builds, assert generated MF options, HTML tags, externals, CSS names, runtime plugins, and manifests |
| EMP Share runtime | `EMPRuntime.init/load/register/preload/loadShare`, SDK facade, `getReactShare`, browser `output/sdk.js` | Browser-global behavior is under-tested | Browser tests load real built files and MF apps, then assert globals, remote registration, remote load, and share loading |
| Apps integration | `mf-host/mf-app`, Vue remote pairs, adapter host, demo proxy | Existing browser lane covers apps, but not all share semantics | Deepen browser assertions for remote registration, SDK calls, runtime injection, `forceRemotes`, and version isolation |

## Parallel Execution Model

- Main controller owns planning, shared root config, final integration, verification, and conflict resolution.
- Subagent A owns CLI real command and real project tests under `packages/cli/test/real/` and `packages/cli/test/support/`.
- Subagent B owns EMP Share Rspack/package contract tests under `packages/emp-share/test/rspack/`, `packages/emp-share/test/runtime/`, and package-local support files.
- Subagent C owns EMP Share browser runtime tests under `packages/emp-share/test/browser/` and any package-local browser fixtures.
- Subagent D owns apps integration deepening under `test/apps/browser/mf-host/`, `test/apps/browser/mf-app/`, and shared browser assertions only after Main assigns the exact shared helper changes.
- Subagents do not edit root scripts or root package scripts in parallel. They return required root changes in their final notes; Main applies those changes once.

## Five Execution Loops

### Loop 1: Test Topology And RED Guards

**Files:**
- Modify: `rstest.config.ts`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `scripts/emp-workflow-check.mjs`
- Modify: `test/toolchain.rules.test.ts`
- Modify: `test/apps.rules.test.ts`
- Modify: `package.json`
- Create: `packages/cli/test/support/real-project.ts`
- Create: `packages/emp-share/test/support/mock-rspack-store.mjs`

**Interfaces:**
- `packages/cli/test/support/real-project.ts` exports temp directory creation, CLI process spawning, port allocation, HTTP polling, artifact cleanup, and process shutdown helpers.
- `packages/emp-share/test/support/mock-rspack-store.mjs` exports a GlobalStore-compatible test double that captures `chain`, `injectTags`, `empConfig`, `pkg`, `mode`, and plugin usage.
- Root browser include supports `test/apps/browser/**/*.browser.ts` and `packages/emp-share/test/browser/**/*.browser.ts`.
- Root scripts expose a single browser-all target used by the exact watch command, while app-only browser runner remains available for apps acceptance.

- [ ] **Step 1: Write RED topology guard**

Add root rules that expect:

```ts
expect(rstestConfig).toContain("packages/emp-share/test/browser/**/*.browser.ts")
expect(rootPackage.scripts?.["test:browser:all"]).toContain("rstest")
expect(rootTestTargets).toContain("packages/emp-share/test/browser/force-remote.browser.ts")
expect(workflowGuard).toContain("packages/emp-share/test/browser")
```

- [ ] **Step 2: Run RED**

Run:

```bash
corepack pnpm exec rstest run --config rstest.config.ts test/toolchain.rules.test.ts test/apps.rules.test.ts --reporter dot
```

Expected: FAIL because root browser topology and target list do not yet include EMP Share runtime browser tests.

- [ ] **Step 3: Implement topology**

Update root browser include, root target discovery, workflow guard, and root script names:

```json
"test:browser:all": "corepack pnpm exec rstest run --config rstest.config.ts --browser",
"test:browser:watch": "pnpm exec rstest watch --browser --browser.headless=false"
```

Keep `test:apps:browser` mapped to the existing app browser runner.

- [ ] **Step 4: Add shared support files**

Create the CLI real-project helper and EMP Share mock store helper with no business assertions inside helpers. Helpers only create fixtures, run commands, poll URLs, read files, and return structured observations.

- [ ] **Step 5: Run GREEN topology guard**

Run:

```bash
corepack pnpm exec rstest run --config rstest.config.ts test/toolchain.rules.test.ts test/apps.rules.test.ts --reporter dot
corepack pnpm workflow:check
```

Expected: PASS.

### Loop 2: CLI Real Command And Config Coverage

**Files:**
- Create: `packages/cli/test/real/cli-config-build.test.ts`
- Create: `packages/cli/test/real/cli-command-runtime.test.ts`
- Create: `packages/cli/test/real/cli-lifecycle-plugin.test.ts`
- Create: `packages/cli/test/real/cli-static-serve.test.ts`
- Modify: `packages/cli/rstest.config.ts`
- Modify: `packages/cli/package.json`

**Interfaces:**
- `packages/cli/rstest.config.ts` includes `test/**/*.test.ts` and `test/real/**/*.test.ts`.
- `@empjs/cli` `test:real` builds the package and runs all Rstest `.test.ts` files, including real command cases.

- [ ] **Step 1: Write RED for real build config**

Add `cli-config-build.test.ts` that creates a minimal React or vanilla fixture with `emp.config.ts` using:

```ts
defineConfig(() => ({
  base: "/cdn/",
  appSrc: "src",
  appEntry: "main.ts",
  build: { outDir: "dist-real", assetsDir: "assets-real", sourcemap: { js: "source-map", css: true } },
  html: { mountId: "custom-root", title: "CLI Real Config" },
  entries: { main: { title: "Main Entry" } },
  define: { __EMP_TEST_ENV__: JSON.stringify("from-define") },
  defineFix: "all",
  externals: { react: "React" },
  resolve: { alias: { "@fixture": pathToSrc } },
  chain(chain) { chain.output.set("uniqueName", "cliRealConfig") },
}))
```

Run:

```bash
corepack pnpm --filter @empjs/cli exec rstest run test/real/cli-config-build.test.ts --reporter dot
```

Expected: FAIL before the test exists or before the config behavior is asserted.

- [ ] **Step 2: Implement build assertions**

The test runs the real binary:

```bash
node packages/cli/bin/emp.js build --env prod --env-vars API_URL=https://api.example.test --clearLog=false
```

Assert `dist-real/index.html`, JS/CSS assets, source map presence, mount id, public path, define replacement, alias import output, and absence of unexpected build errors.

- [ ] **Step 3: Add command runtime tests**

`cli-command-runtime.test.ts` covers:
- `emp dts` and `emp init`: non-zero exit and stderr contains the v4 alpha unsupported message.
- Invalid `--env-vars bad`: non-zero exit and message contains `key=value`.
- `build --analyze`: generated analyzer artifact or explicit analyzer log.
- `build --watch --serve`: first build completes, HTTP endpoint returns 200, process exits on SIGTERM without orphaned listeners.

- [ ] **Step 4: Add lifecycle and plugin black-box tests**

`cli-lifecycle-plugin.test.ts` fixture writes lifecycle marks to a JSONL file from `lifeCycle` hooks and a user plugin `rsConfig`. Run real `build` and assert this order is observable:

```text
afterGetEmpOptions -> beforePlugin -> plugin.rsConfig -> afterPlugin -> beforeEmpPlugin -> afterEmpPlugin -> beforeBuild -> afterBuild
```

Add a second case for real `dev` startup that asserts `beforeDevServe` and `afterDevServe` markers before shutting the process down.

- [ ] **Step 5: Add static and serve tests**

`cli-static-serve.test.ts` covers:
- `emp static <root> --json --cors --headers x-test=ok --spa app.html --index home.html index.html --compression none`
- CORS header, custom header, directory index priority, SPA fallback, missing-root failure, and JSON startup payload.
- `emp serve --env prod` fails before build with `emp serve must be executed after emp build`.
- After a real build, `emp serve` returns HTML and assets through HTTP.

- [ ] **Step 6: Run CLI GREEN**

Run:

```bash
corepack pnpm --filter @empjs/chain build
corepack pnpm --filter @empjs/cli test:real
corepack pnpm test:cli
```

Expected: PASS.

### Loop 3: EMP Share Rspack And Package Contract Coverage

**Files:**
- Create: `packages/emp-share/test/rspack/plugin-share-config.test.mjs`
- Create: `packages/emp-share/test/rspack/force-remotes-config.test.mjs`
- Create: `packages/emp-share/test/runtime/package-exports-runtime.test.mjs`
- Modify: `packages/emp-share/package.json`

**Interfaces:**
- `@empjs/share` `test` still starts with a real package build and then runs contract tests.
- Package contract tests import built files from `packages/emp-share/dist` and `packages/emp-share/output`.

- [ ] **Step 1: Write RED for Rspack plugin configuration**

Add `plugin-share-config.test.mjs` cases using the mock store:
- `runtimeLib` omitted mounts `EmpShareRemoteLibPlugin`.
- `runtimeLib` URL injects a head script and externalizes `@module-federation/runtime` and `@module-federation/sdk`.
- `runtime: { lib, global }` and `runtimeGlobal` select the correct global.
- `framework: "react"` plus `frameworkGlobal` externalizes `react`, `react-dom`, `react-dom/client`, `react/jsx-runtime`, and `react/jsx-dev-runtime`.
- `framework.libs` injects JS and CSS tags in order.
- `shareLib` string, array, and object forms inject resources and externals.
- `setExternals` receives accumulated externals and can add a custom external.
- `empRuntime.version: true` derives MF name from package name and version, sets `output.uniqueName`, and sets CSS module local names for dev and prod.
- `dts.consumeTypes.runtimePkgs` merges `@empjs/share/sdk` without duplicates and respects `consumeTypes: false`.

Run:

```bash
corepack pnpm --filter @empjs/share run build
corepack pnpm --filter @empjs/share exec node test/rspack/plugin-share-config.test.mjs
```

Expected: FAIL before cases and package script are wired.

- [ ] **Step 2: Add forceRemotes config tests**

`force-remotes-config.test.mjs` asserts:
- Non-empty `forceRemotes` injects `window.EMP_FORCE_REMOTES`.
- Module Federation options include `@empjs/share/forceRemote` in `runtimePlugins`.
- Empty `forceRemotes` does not inject HTML.
- `forceRemotes` is removed from final MF plugin options so it is not passed to upstream MF plugin.

- [ ] **Step 3: Add package export runtime tests**

`package-exports-runtime.test.mjs` asserts:
- Every `exports` key can be imported from the built package.
- `typesVersions` includes all type-bearing exports, including `forceRemote`.
- `adapterVue` export shape matches the documented API or the test records the current same-source behavior explicitly.
- `@empjs/share/library` points to `output/sdk.js` and the file contains browser global runtime keys.

- [ ] **Step 4: Wire package script and run GREEN**

Update `packages/emp-share/package.json` `test` script to include the new files after `pnpm run build`.

Run:

```bash
corepack pnpm --filter @empjs/share test
corepack pnpm test:packages
```

Expected: PASS.

### Loop 4: EMP Share Browser Runtime And MF Semantics

**Files:**
- Create: `packages/emp-share/test/browser/force-remote.browser.ts`
- Create: `packages/emp-share/test/browser/library-global.browser.ts`
- Create: `packages/emp-share/test/browser/runtime-sdk.browser.ts`
- Modify: `test/apps/browser/mf-host/mobx.browser.ts`
- Modify: `test/apps/browser/mf-app/remote.browser.ts`
- Modify: `test/apps.browser-coverage.test.ts`

**Interfaces:**
- Browser tests run through root `rstest.config.ts`.
- The exact headed watch command sees these files in the test tree:

```bash
pnpm exec rstest watch --browser --browser.headless=false
```

- [ ] **Step 1: Write RED browser runtime tests**

Add browser tests that initially fail because root browser include and built package artifacts are not yet wired:
- `force-remote.browser.ts` imports built `@empjs/share/forceRemote`, sets `window.EMP_FORCE_REMOTES`, calls `beforeRegisterRemote`, and asserts alias entry override, version URL replacement, `entry/url/manifest` field support, and no-op behavior for unmatched remotes.
- `library-global.browser.ts` injects built `packages/emp-share/output/sdk.js` into the browser page and asserts `window.EMP_SHARE_RUNTIME` exposes `MFRuntime`, `MFSDK`, shared helpers, and adapter/runtime keys.
- `runtime-sdk.browser.ts` loads existing MF app services through the apps browser harness and asserts `@empjs/share/sdk` can register and load a real remote module.

Run:

```bash
corepack pnpm --filter @empjs/share build
corepack pnpm exec rstest run --config rstest.config.ts packages/emp-share/test/browser/force-remote.browser.ts --browser --reporter dot
```

Expected: FAIL until the browser include, build prerequisite, and test implementation are complete.

- [ ] **Step 2: Implement browser runtime tests**

Make browser cases assert observable state only:
- Mutated remote object after runtime plugin hook.
- Real script-loaded global names on `window`.
- Successful remote load result or visible DOM text from the loaded module.
- Error case when required globals are missing from `EMPRuntime.setup`.

- [ ] **Step 3: Deepen MF app browser assertions**

Extend existing MF app tests to assert:
- Host `emp.json` or manifest network response contains expected exposes.
- `mf-app` registers `mfHost` through SDK before calling `loadRemote`.
- Remote count interaction updates visible DOM after remote load.
- Runtime injection script contains `EMPShareGlobalVal`.
- A controlled `forceRemotes` page or fixture shows forced entry/version behavior in the browser.

- [ ] **Step 4: Run browser GREEN**

Run:

```bash
corepack pnpm --filter @empjs/share build
corepack pnpm exec rstest run --config rstest.config.ts packages/emp-share/test/browser/**/*.browser.ts --browser --reporter dot
corepack pnpm test:apps:browser -- test/apps/browser/mf-host/mobx.browser.ts test/apps/browser/mf-app/remote.browser.ts
```

Expected: PASS.

### Loop 5: Generated Project, Full Watch, And Release Gate

**Files:**
- Create: `packages/cli/test/real/cli-create-generated-project.test.ts`
- Modify: `packages/cli/package.json`
- Modify: `package.json`
- Modify: `scripts/root-test-targets.mjs`
- Modify: `scripts/emp-workflow-check.mjs`
- Modify: `test/toolchain.rules.test.ts`

**Interfaces:**
- `cli-create-generated-project.test.ts` owns the expensive generated-project scenario and can be run separately if needed.
- Root scripts expose:
  - `test:browser:all` for all browser tests.
  - `test:runtime:browser` for package/browser runtime tests only if the implementation chooses to split runtime from apps.
  - `release:verify:runtime` or equivalent release gate that runs package, CLI, apps, and browser runtime lanes.

- [ ] **Step 1: Write RED generated-project test**

The test runs:

```bash
node packages/cli/bin/emp.js create "react host with vue remote" --dir <tmp> --skip-dev --json
```

Then runs inside the generated workspace:

```bash
corepack pnpm install --offline=false
corepack pnpm build
```

Expected: FAIL before real generated-project assertions are implemented.

- [ ] **Step 2: Implement generated project assertions**

Assert:
- JSON report contains generated host and remote paths.
- Root `pnpm-workspace.yaml` and package manifests are valid.
- Host and remote `emp.config.ts` use `pluginRspackEmpShare`.
- Build artifacts include host HTML, remote `emp.js` or manifest, and no unresolved workspace references.
- Starting host and remote services returns HTTP 200 and browser-visible host-to-remote content.

- [ ] **Step 3: Add release browser/runtime gate**

Add a root gate that does not hide the browser lane:

```bash
corepack pnpm test:cli
corepack pnpm test:packages
corepack pnpm test:browser:all
corepack pnpm apps:acceptance
```

If CI time is too high, keep it outside `ci:verify` and document it as a release or pre-push acceptance gate in the workflow guard.

- [ ] **Step 4: Run exact user acceptance command**

Run:

```bash
pnpm exec rstest watch --browser --browser.headless=false
```

Expected: The first watch cycle lists apps browser cases and EMP Share browser runtime cases, all pass, then the process waits for changes. Stop the watcher after capturing the passing result.

- [ ] **Step 5: Run final verification**

Run:

```bash
corepack pnpm workflow:check
corepack pnpm test:cli
corepack pnpm test:packages
corepack pnpm test:browser:all
corepack pnpm ci:verify
corepack pnpm empbuild
git diff --check
```

Expected: PASS. If `test:browser:all` or generated-project tests are intentionally excluded from `ci:verify`, final delivery must state that boundary and the exact command that covers it.

## Stop Conditions

- Complete at least five loops above, or stop only when every listed CLI and EMP Share public customization surface has a real test and no additional user-facing behavior remains untested.
- A loop is not complete until its RED failure, targeted GREEN result, and regression command are recorded in the execution notes.
- Do not mark implementation complete while a browser watcher, dev server, static server, or build watch process is still running.
- Do not replace browser/runtime tests with source-string or shape-only checks for behavior that can be observed through CLI, files, HTTP, or DOM.
- Any discovered product bug must be converted into a reproducible failing test before the implementation fix.
