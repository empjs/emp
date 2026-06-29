export const DEFAULT_APP_ACCEPTANCE = [
  'rspack2-modern-module',
  'rspack2-optimization',
  'mf-host',
  'mf-app',
  'vue-3-base',
  'vue-3-project',
  'tailwind-4',
  'react-19-tanstack',
]

export const TARGET_APP_DIRS = [
  'adapter-app',
  'adapter-host',
  'demo',
  'mf-app',
  'mf-host',
  'react-19-tanstack',
  'rspack2-modern-module',
  'rspack2-optimization',
  'tailwind-4',
  'vue-2-base',
  'vue-2-project',
  'vue-3-base',
  'vue-3-project',
]

export const RETIRED_APP_DIRS = [
  'adapter-vue2-host',
  'adapter-vue3-host',
  'app-and-host',
  'auto-pages',
  'daisyui-demo',
  'emp-window-demo',
  'es5-import-demo',
  'esm-react-app',
  'esm-react-host',
  'local-build-remote-dev-demo',
  'mf-split-chunk',
  'mf-v3-host',
  'mobile-vw-rem',
  'old-func-demo',
  'pixi-js-demo',
  'proxy-demo',
  'react-16-adapter-18',
  'react-18-runtime',
  'react-19-runtime',
  'react-eager-app',
  'react-eager-host',
  'react-router-demo',
  'react-wouter',
  'rtHost',
  'rtLayout',
  'rtProvider',
  'runtime-18-app',
  'runtime-18-host',
  'shadcn-ui',
  'tailwind-2',
  'tailwind-3',
  'unpkg-demo',
  'vue-2-element',
  'vue-2-stylus',
  'vue-3-with-vue-2',
  'vue3-in-vue2',
]

export function getDuplicatePackageNames(apps) {
  const byName = new Map()
  for (const app of apps) {
    byName.set(app.name, [...(byName.get(app.name) ?? []), app.dir])
  }

  return Object.fromEntries(
    [...byName.entries()]
      .filter(([, dirs]) => dirs.length > 1)
      .map(([name, dirs]) => [name, dirs.sort()]),
  )
}
