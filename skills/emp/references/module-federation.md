# Module Federation

Use this reference for EMP v4 host/remote wiring, runtime sharing, and federation validation.

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
