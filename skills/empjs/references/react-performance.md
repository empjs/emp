# EMP React 性能规则详解

适配自 Vercel React 最佳实践，状态管理用 @empjs/valtio。

## 目录

1. [消除瀑布](#1-消除瀑布)
2. [包体积](#2-包体积)
3. [客户端数据](#3-客户端数据)
4. [状态管理 → valtio](#4-状态管理--empjsvaltio)
5. [渲染](#5-渲染)
6. [JS 性能](#6-js-性能)
7. [高级](#7-高级)

---

## 1. 消除瀑布

### async-parallel

独立请求用 `Promise.all()`：

```ts
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()])
```

### async-defer-await

await 移到真正需要的分支，避免阻塞不需要的分支。

### async-suspense-boundaries

用 Suspense 包裹异步组件，流式加载。

## 2. 包体积

### bundle-barrel-imports

直接导入：`import { X } from 'lib/x'` 而非 `import { X } from 'lib'`（barrel 会拉全量）。

### bundle-dynamic-imports

重组件用 `React.lazy`：

```tsx
const Heavy = React.lazy(() => import('./Heavy'))
<Suspense fallback={...}><Heavy /></Suspense>
```

### bundle-defer-third-party

分析、日志等 hydration 后加载：

```tsx
useEffect(() => {
  import('@vercel/analytics').then(m => m.inject())
}, [])
```

### bundle-preload

hover/focus 时预加载：

```tsx
<button onMouseEnter={() => import('./Editor')} onFocus={...}>
  打开编辑器
</button>
```

## 3. 客户端数据

### client-swr-dedup

用 SWR 自动去重请求。

### client-passive-listeners

touch/wheel 加 `{ passive: true }`，避免阻塞滚动。

### client-localstorage-schema

localStorage 加版本前缀，只存必要字段，try-catch。

## 4. 状态管理 → @empjs/valtio

原 useState/useReducer/useCallback 规则改用 valtio：

- 全局：`createStore` + `useSnapshot`
- 局部：`useStore`
- 派生：`derive` 替代 useMemo
- 细粒度：`subscribeKey` 替代订阅整块
- 批量：`batch` 合并写

## 5. 渲染

### rendering-content-visibility

长列表：`content-visibility: auto` + `contain-intrinsic-size`。

### rendering-hoist-jsx

静态 JSX 提到组件外，避免每次渲染创建。

### rendering-conditional-render

用 `count > 0 ? <Badge /> : null`，不用 `count && <Badge />`（0 会渲染）。

### rendering-activity (React 19)

`<Activity mode={isOpen ? 'visible' : 'hidden'}>` 保留 DOM/状态，避免频繁挂载。

### rendering-hydration-no-flicker

客户端数据用 inline script 同步设置，避免闪烁。

## 6. JS 性能

### js-batch-dom-css

用 class 或 cssText 批量改样式，避免多次 reflow。

### js-index-maps

重复 find 用 Map 建索引，O(n)→O(1)。

### js-cache-storage

localStorage 读缓存到 Map，避免重复 I/O。

### js-tosorted-immutable

用 `arr.toSorted()` 替代 `arr.sort()`，不修改原数组。

### js-early-exit

函数内早 return，减少嵌套。

## 7. 高级

### advanced-event-handler-refs

事件处理存 ref，避免闭包重建。

### advanced-use-latest

`useLatest(callback)` 稳定 callback ref。
