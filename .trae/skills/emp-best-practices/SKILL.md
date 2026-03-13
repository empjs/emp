---
name: emp-best-practices
description: Configure module federation Host/Remote apps, resolve shared dependency conflicts, develop custom plugins, and debug EMP CLI builds with Rspack. Use when setting up micro-frontends (MFE), creating emp.config.ts, connecting React/Vue remotes, writing EMP plugins, or troubleshooting federated module loading.
license: MIT
compatibility: opencode
metadata:
  audience: developers
  version: "1.1"
  workflow: module-federation, plugin-development, framework-interop
---

# EMP CLI Best Practices

Guides agents through EMP CLI micro-frontend architecture, module federation configuration, plugin development, and multi-framework interop using @empjs/cli and Rspack.

## Quick Start: Minimal EMP Project

```bash
pnpm create emp my-app && cd my-app && pnpm install && pnpm dev
```

Minimal `emp.config.ts`:

```typescript
import { defineConfig } from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'

export default defineConfig(store => ({
  plugins: [pluginReact()],
  server: { port: 8000 },
}))
```

## Module Federation Setup

### 1. Remote App (exposes components)

```typescript
import { pluginRspackEmpShare, externalReact } from '@empjs/share'

pluginRspackEmpShare({
  name: 'mfHost',
  exposes: { './App': './src/App' },
  manifest: true, // generates emp.json
  empRuntime: {
    framework: { global: 'EMP_ADAPTER_REACT', libs: [`https://unpkg.com/@empjs/cdn-react@0.19.1/dist/react.${store.mode}.umd.js`] },
    runtime: { lib: `https://unpkg.com/@empjs/share@3.11.4/output/sdk.js` },
    setExternals: externalReact,
  },
})
```

### 2. Host App (consumes remotes)

```typescript
remotes: { mfHost: `mfHost@http://${store.server.ip}:6001/emp.json` }
```

### 3. Verify Federation

```bash
curl http://localhost:6001/emp.json  # confirm remote is serving
```

## Troubleshooting

| Symptom | Check | Fix |
|---------|-------|-----|
| Remote module not loading | `curl` the remote `emp.json` URL | Ensure `manifest: true` is set and remote app is running |
| React multi-instance error | Check shared dependency config | Add `singleton: true` to shared React config |
| Type mismatch across apps | Verify `requiredVersion` in shared config | Align React versions across Host and Remote |

## Reference Index

### Core
- [Troubleshooting & Debugging](./references/core/troubleshooting.md)

### Architecture
- [Module Federation & CDN](./references/architecture/module-federation-cdn.md)
- [Multi-Port Runtime Sharing](./references/architecture/multi-port-runtime-sharing.md)

### Framework Interop
- [Multi-Framework Guide](./references/interop/framework-interop-guide.md) — React (16-18), Vue 2/3
  - [Implementation Details](./references/interop/framework-interop-implementation.md)
  - [React Interop](./references/interop/framework-interop-react.md)
  - [Vue Interop](./references/interop/framework-interop-vue.md)

### Plugins
- [Plugin Usage Guide](./references/plugins/plugin-usage-guide.md)
- [Plugin Development](./references/plugins/plugin-development.md)
- [React Plugins](./references/plugins/react-plugins.md)
- [Vue Plugins](./references/plugins/vue-plugins.md)
- [CSS/Style Plugins](./references/plugins/css-plugins.md)

### Performance
- [Build Optimization](./references/performance/build-optimization.md)
- [TailwindCSS Integration](./references/performance/tailwindcss-integration.md)
