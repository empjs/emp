# Module Federation

Use this reference for EMP v4 host/remote wiring, runtime sharing, and federation validation.

## Contents

- [Inputs to collect](#inputs-to-collect)
- [Imports](#imports)
- [Federation options](#federation-options)
- [Remote provider](#remote-provider)
- [Host consumer](#host-consumer)
- [Runtime scope](#runtime-scope)
- [EMP runtime options](#emp-runtime-options)
- [Force remotes](#force-remotes)
- [DTS checks](#dts-checks)
- [Acceptance](#acceptance)

## Inputs to collect

- Whether the project is a remote provider, host consumer, or both.
- Remote container names, manifest URLs, exposed module paths, and shared singleton requirements.
- Type declaration needs for host development, including whether DTS output must be published.
- Runtime isolation needs, especially whether `empRuntime.version` is required.

## Files to inspect

- `emp.config.ts`
- `package.json`
- remote manifest such as `emp.json` or `mf-manifest.json`
- generated `@mf-types` or federation DTS output
- browser network and console output from the host page

## Success evidence

- Manifest is generated and reachable from the intended environment.
- Remote entry loads in a browser without console errors.
- `exposes` match the host import path.
- `remotes` point to the intended host or remote URL.
- `shared` singleton dependencies resolve to the expected version.
- Host browser behavior proves real remote rendering, not only build success.

## Imports

```ts
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import {externalReact, pluginRspackEmpShare} from '@empjs/share/rspack'
```

`@empjs/share/rspack` is the primary Rspack-side Module Federation entry.

## Federation Options

`pluginRspackEmpShare(...)` accepts the installed official `ModuleFederationPluginOptions` plus EMP-owned `empRuntime` and `forceRemotes` fields. Common official fields include:

| Field | Purpose |
| --- | --- |
| `name` | Stable container identity. |
| `filename` | Remote entry filename. |
| `exposes` | Public modules provided by a remote. |
| `remotes` | Remote containers consumed by a host. |
| `shared` | Shared dependency/version/singleton policy. |
| `runtimePlugins` | Module Federation runtime extensions. |
| `manifest` | Manifest generation options. |
| `dts` | Federation type generation and consumption options. |

For less common official options, inspect the installed `@module-federation/rspack` type used by `ModuleFederationPluginOptions`; do not freeze a copied upstream option list in this Skill.

## Remote Provider

```ts
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginRspackEmpShare({
      name: 'mfApp',
      exposes: {
        './App': './src/App',
      },
      shared: {
        react: {singleton: true},
        'react-dom': {singleton: true},
      },
    }),
  ],
})
```

Provider responsibilities:

- Keep `name` stable; it becomes part of the federation container identity.
- Declare every public module in `exposes`.
- Generate and publish a manifest that the host can fetch.
- Build type output when the host needs development-time DTS.

## Host Consumer

```ts
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginRspackEmpShare({
      name: 'mfHost',
      remotes: {
        mfApp: 'mfApp@http://localhost:6002/mf-manifest.json',
      },
      shared: {
        react: {singleton: true},
        'react-dom': {singleton: true},
      },
    }),
  ],
})
```

Consumer responsibilities:

- Keep `remotes` URLs environment-specific and explicit.
- Validate the manifest URL and remote entry in a browser.
- Verify the host imports the exposed module through the runtime path that production will use.

## Runtime Scope

Use `empRuntime.version` when multiple runtime versions may coexist:

```ts
pluginRspackEmpShare({
  name: 'mfHost',
  empRuntime: {
    version: true,
    setExternals: externalReact,
  },
})
```

`empRuntime.version: true` derives a versioned scope from package metadata. It also affects `output.uniqueName` and related CSS Modules prefixes.

## EMP Runtime Options

| Field | Behavior |
| --- | --- |
| `empRuntime.shareLib` | Legacy EMP share-library mapping; keep only for migration. |
| `empRuntime.version` | Derive version-isolated container name, `output.uniqueName`, and CSS Modules prefix. |
| `empRuntime.frameworkGlobal` | Framework global variable name. |
| `empRuntime.runtimeLib` | Runtime URL or `useFrameworkLib`. |
| `empRuntime.runtime` | Runtime `{lib, global?}` descriptor. |
| `empRuntime.runtimeGlobal` | Runtime global variable name. |
| `empRuntime.setExternals` | Callback that installs framework/runtime externals. |
| `empRuntime.injectGlobalValToHtml` | Inject selected runtime global values into HTML. |
| `empRuntime.framework` | `react`, `vue2`, `vue`, or a framework descriptor. |
| `empRuntime.frameworkLib` | Framework runtime URL or development/production URL pair. |

Prefer the structured `runtime` and `framework` descriptors in new configs. Treat `shareLib` and duplicated `*Global`/`*Lib` fields as compatibility surfaces until a future major provides one normalized runtime descriptor.

## Force Remotes

Use `forceRemotes` only when deployment must override a discovered remote version or replace a complete entry without rebuilding the host:

```ts
pluginRspackEmpShare({
  name: 'mfHost',
  remotes: {
    common: 'common@https://cdn.example.com/common@16.0.0/emp.json',
  },
  forceRemotes: {
    common: {version: '17.0.0'},
    '@scope/checkout': {entry: 'https://cdn.example.com/checkout/emp.json'},
  },
})
```

Accepted values:

- string or `{version}` replaces only the version segment in matching remote URLs.
- `{entry}` replaces the complete `entry`, `url`, or `manifest` of the remote whose alias or name matches the key.
- Alias matching takes priority because placeholder names may be duplicated.

Validate `forceRemotes` with the real runtime hook: inspect the final remote object, fetch the resulting manifest/entry, and load an exposed module. A shape-only test is insufficient.

## DTS Checks

When DTS is enabled, validate:

- remote output contains the expected exposed module types.
- host generated declarations include `@empjs/share/sdk` runtime entries when used.
- type artifacts match the current `@empjs/share` exports.
- TypeScript checks run against the generated federation tsconfig.

## Acceptance

Build success is not enough. Validate:

- manifest is generated and reachable.
- remote entry loads in the browser.
- `exposes` match the host import path.
- `remotes` point to the intended environment.
- `shared` singleton dependencies resolve to the expected version.
- browser behavior proves the host actually renders remote content.
