import type {FrameworkId, FrameworkRuntime} from './types'
export const frameworks: {id: FrameworkId; label: string; family: 'react' | 'vue'}[] = [
  {id: 'react16', label: 'React 16', family: 'react'},
  {id: 'react17', label: 'React 17', family: 'react'},
  {id: 'react18', label: 'React 18', family: 'react'},
  {id: 'react19', label: 'React 19', family: 'react'},
  {id: 'vue2', label: 'Vue 2', family: 'vue'},
  {id: 'vue3', label: 'Vue 3', family: 'vue'},
]
const loaders = {
  react16: () => import('@empjs/bridge-demo-react16'),
  react17: () => import('@empjs/bridge-demo-react17'),
  react18: () => import('@empjs/bridge-demo-react18'),
  react19: () => import('@empjs/bridge-demo-react19'),
  vue2: () => import('@empjs/bridge-demo-vue2'),
  vue3: () => import('@empjs/bridge-demo-vue3'),
}
const cache = new Map<FrameworkId, FrameworkRuntime>()
export async function loadRuntime(id: FrameworkId): Promise<FrameworkRuntime> {
  const existing = cache.get(id)
  if (existing) return existing
  // Cache only successful loads; failures remain retryable.
  const runtime = (await loaders[id]()).default
  cache.set(id, runtime)
  return runtime
}
