# Advanced Configuration

Use this reference for cache, injected values, Rspack passthroughs, imperative hooks, diagnostics, and checker plugins.

## Contents

- [Cache and transformation](#cache-and-transformation)
- [Define and environment expressions](#define-and-environment-expressions)
- [Rspack extension layers](#rspack-extension-layers)
- [Lifecycle and diagnostics](#lifecycle-and-diagnostics)
- [Complete debug index](#complete-debug-index)
- [Checkers](#checkers)

## Cache and transformation

| Field | Behavior |
| --- | --- |
| `cacheDir` | Persistent cache directory; default `node_modules/.emp-cache`. |
| `cache` | `false` disables cache, `true`/memory behavior uses the normal runtime cache, `persistent` enables persistent cache, and a Rspack cache object passes through advanced options. `cache.maxVersions` no longer exists in Rspack 2: setting it emits a warning and the value is ignored. |

Transformation include/exclude control has no `emp-config` field. Adjust loader rules through `chain` or a first-party plugin, and prove the change with a resolved-config or artifact assertion.

## Define and environment expressions

| Field | Behavior |
| --- | --- |
| `define` | Key/value map serialized into build-time expressions. Do not place secrets here; values become client assets. |
| `defineFix` | `cjs` creates `process.env.*`, `esm` creates `import.meta.env.*`, `all` creates both, and `none` uses raw keys. |

When `defineFix` is omitted, EMP derives `esm` for `build.format: 'esm'` and `cjs` for script format. Keep an explicit value when a migration intentionally needs both expression styles.

## Rspack extension layers

| Field | Layer and precedence |
| --- | --- |
| `plugins` | Ordered semantic EMP plugins. Prefer this layer for supported framework, CSS, and federation behavior. |
| `externals` | Raw Rspack externals. Confirm browser globals and script injection separately. |
| `resolve` | Raw Rspack resolve options merged over EMP defaults. |
| `output` | Raw Rspack output options merged over EMP output defaults. Explicit library/module/environment settings can override semantic defaults and must remain consistent with `build.format` and `build.targets`. |
| `target` | Raw top-level Rspack target escape hatch. Prefer `build.targets` for browser compatibility. |
| `chain` | Imperative final chain mutation for behavior that has no supported semantic field. |

Before using `chain`, confirm the same behavior is not already represented by `build.rspack`, `html`, `server`, `css`, or a first-party plugin. Keep chain edits narrow and add a resolved-config or artifact assertion.

## Lifecycle and diagnostics

| Field | Behavior |
| --- | --- |
| `lifeCycle` | EMP lifecycle callbacks around config/module/plugin stages. Keep callbacks deterministic and avoid hidden external writes. |
| `ignoreWarnings` | Rspack warning filters. Match only known warnings; do not silence broad classes without an artifact test. |
| `showLogTitle` | Callback that replaces the CLI title output. Presentation only. |

## Complete debug index

| Field | Default/behavior |
| --- | --- |
| `debug.loggerLevel` | `info`; accepts `debug`, `info`, `warn`, or `error`. |
| `debug.clearLog` | `true`; controls terminal clearing. |
| `debug.showRsconfig` | `false`; `true` prints resolved config, a string writes JSON to that path, and inspect options customize terminal rendering. |
| `debug.showPerformance` | Deprecated compatibility field with no active report path; a truthy value logs a warning at setup. |
| `debug.showScriptDebug` | Enables additional script debug behavior where consumed. |
| `debug.rsdoctor` | `false`, boolean enablement, or Rsdoctor options; CLI doctor mode enables it automatically. |
| `debug.newTreeshaking` | Deprecated compatibility field; Rspack 2 has no active consumer, and a truthy value logs a warning at setup. |
| `debug.devShowAllLog` | Show all development logs. |
| `debug.warnRuleAsWarning` | `true`; default warning policy inherited by Sass. Prefer `css.sass.warnRuleAsWarning` for CSS-only intent. |
| `debug.infrastructureLogging` | Defaults to append-only warning-level Rspack infrastructure logs. |
| `debug.cssChunkingPlugin` | `true`; boolean or options for Rspack CSS chunking. |
| `debug.nativeWatcher` | `true`; controls the Rspack native watcher experiment. |

Do not use debug fields as application behavior switches. If a debug option becomes a required production semantic, promote it to the owning config domain in a future major.

## Checkers

| Field | Behavior |
| --- | --- |
| `tsCheckerRspackPlugin` | `false` disables; `true` uses defaults; an options object configures `ts-checker-rspack-plugin`. |
| `circularCheckRspackPlugin` | `false` disables; `true` uses defaults; an options object configures Rspack's circular check plugin. |

Run the relevant package typecheck/build after enabling either checker. Circular checks and declaration generation may expose existing dependency cycles or fixture-specific TypeScript problems that normal transpilation does not block.
