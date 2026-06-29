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

export const COMPAT_APP_GROUPS = {
  vue2: ['vue-2-base', 'vue-2-project'],
  adapter: ['adapter-app', 'adapter-host'],
  manual: ['demo'],
}

export const REMOVE_CANDIDATES = {
  'batch-1-uncataloged': [
    'app-and-host',
    'daisyui-demo',
    'local-build-remote-dev-demo',
    'mf-split-chunk',
    'mf-v3-host',
    'old-func-demo',
    'react-19-runtime',
    'react-router-demo',
    'shadcn-ui',
    'vue-3-with-vue-2',
  ],
  'batch-2-root-script-cleanup': [
    'esm-react-app',
    'esm-react-host',
    'react-eager-app',
    'react-eager-host',
    'react-wouter',
    'unpkg-demo',
  ],
  'batch-3-compat-collapse': [
    'adapter-vue2-host',
    'adapter-vue3-host',
    'auto-pages',
    'emp-window-demo',
    'es5-import-demo',
    'mobile-vw-rem',
    'pixi-js-demo',
    'proxy-demo',
    'react-16-adapter-18',
    'react-18-runtime',
    'rtHost',
    'rtLayout',
    'rtProvider',
    'runtime-18-app',
    'runtime-18-host',
    'tailwind-2',
    'tailwind-3',
    'vue-2-element',
    'vue-2-stylus',
    'vue3-in-vue2',
  ],
}

export const MERGE_CANDIDATES = [
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
