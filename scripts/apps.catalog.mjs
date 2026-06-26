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

export const COMPAT_APP_GROUPS = {
  'tailwind-legacy': ['tailwind-2', 'tailwind-3'],
  vue2: ['vue-2-base', 'vue-2-project', 'vue-2-element', 'vue-2-stylus'],
  'vue3-pinia-router': ['vue3-app', 'vue3-host'],
  'react-runtime-legacy': ['react-16-adapter-18', 'react-18-runtime', 'runtime-18-app', 'runtime-18-host'],
  adapter: ['adapter-app', 'adapter-host', 'adapter-vue2-host', 'adapter-vue3-host', 'vue3-in-vue2'],
  'runtime-layout': ['rtHost', 'rtLayout', 'rtProvider', 'emp-window-demo'],
  'assets-proxy': ['demo', 'proxy-demo', 'auto-pages', 'mobile-vw-rem', 'pixi-js-demo', 'es5-import-demo'],
}

export const MERGE_CANDIDATES = [
  {
    group: 'react-tanstack',
    canonical: ['react-19-tanstack'],
    removeAfterCovered: ['react-tanstack'],
    requiredEvidence: ['react-19-tanstack build passes', 'route artifact includes static and dynamic route coverage'],
  },
  {
    group: 'vue3-pinia-router',
    canonical: ['vue-3-base', 'vue-3-project'],
    removeAfterCovered: ['vue3-app', 'vue3-host'],
    requiredEvidence: ['vue-3-project build passes', 'canonical Vue 3 route or source contains Pinia/router coverage'],
  },
  {
    group: 'tailwind-default-v4',
    canonical: ['tailwind-4'],
    removeAfterCovered: ['tailwind-4-polyfill', 'tailwind-demo', 'tailwindcss-app', 'tailwindcss-host'],
    requiredEvidence: ['tailwind-4 build passes', 'CSS artifact exists and Tailwind v4 package is used'],
  },
  {
    group: 'library-output',
    canonical: ['packages/cdn-*', 'packages/lib-*', 'packages/emp-share'],
    removeAfterCovered: ['lib-main', 'lib-react', 'unpkg-demo', 'unpkg-lib'],
    requiredEvidence: ['Rslib package build passes', 'static service serves a library/runtime asset over HTTP'],
  },
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
