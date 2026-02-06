# @empjs/valtio 使用指南

基于 **Valtio v2** 的增强状态库，在 `proxy` + `useSnapshot` 之上提供开箱即用的 `createStore` / `useStore`、历史、派生、持久化与 Store 方法封装。

**安装**：`pnpm add @empjs/valtio` | **文档**：<https://valtio.empjs.dev/>

## 何时用 createStore vs useStore

| 场景 | 使用 |
|------|------|
| 单例、跨组件共享（如主题、用户、全局计数） | `createStore(initialState, options?)` |
| 组件内独立状态、每实例一份（表单、编辑器、画板） | `useStore(initialState, options?)` |

## 按使用方法速查

| 用法 | 说明 | 详见 |
|------|------|------|
| 常规 store | 读 `useSnapshot()` / `snap`，写 `set` / `update` | [valtio-usage.md](valtio-usage.md#1-常规-store) |
| 带历史 | `history: {}`，读 `snap.value`，写 `store.value.xxx`，`snap.undo()` / `snap.redo()`，`snap.history.nodes.length` 为步数 | [valtio-usage.md](valtio-usage.md#2-带历史的-store) |
| 带派生 | `derive: (get, proxy) => ({ ... })`，返回 `{ base, derived }` 或 `[baseSnap, baseStore, derivedSnap]` | [valtio-usage.md](valtio-usage.md#3-带派生的-store) |
| 集合 Map/Set | `createMap` / `createSet` 放入 store 或 useStore | [valtio-usage.md](valtio-usage.md#4-集合-createmap--createset) |
| 持久化 | `store.persist('key')` 与 localStorage 双向同步 | [valtio-usage.md](valtio-usage.md#5-持久化) |
| 订阅 | `subscribe` / `subscribeKey` / `subscribeKeys`、`batch(fn)` 合并多次写为一次通知 | [valtio-usage.md](valtio-usage.md#6-订阅与-batch) |

## 调用闭环（重要）

1. **读**：只用 `snap`（来自 `store.useSnapshot()` 或 `useStore` 的 `snap`），不要直接读 `store.xxx` 做渲染，否则不触发订阅。
2. **写**：用 store 方法（`set`、`update`、`store.key = value` 等），写后所有订阅该路径的组件会重渲染。
3. **历史 store**：读用 `snap.value.xxx`，写用 `store.value.xxx = y`；撤销/重做用 `snap.undo()` / `snap.redo()`；当前记录步数可用 `snap.history?.nodes?.length`。

## 常见错误与注意点

- **"Please use proxy object"**：传给 `snapshot`/`useSnapshot`/`subscribe` 的必须是 proxy（createStore/useStore 返回的 store 或 base），不要传普通对象。
- **派生函数签名**：`derive: (get, proxy) => derivedObject`，`get(proxy)` 得当前快照，返回纯对象，不要写副作用。
- **集合 key 名**：勿用 key 名 `"set"`，会与 `store.set(key, value)` 方法冲突。

## 类型要点（TypeScript）

- `createStore(initialState)` → `T & StoreBaseMethods<T>`；带 `history` → `HistoryStoreWithSnapshot<T>`；带 `derive` → `{ base, derived }`。
- `useStore` 常规 → `[Snapshot<T>, T & StoreBaseMethods<T>]`；带 derive → `[Snapshot<T>, T & StoreBaseMethods<T>, D]`；带 history → `[WithHistorySnapshot<T>, HistoryStore<T>]`。
- 初始状态可用 `InitialStateOrFn<T>`（即 `T | (() => T)`）惰性初始化。

## 更多资源

- **按使用方法详细说明**：[valtio-usage.md](valtio-usage.md)
- **API 与类型**：[valtio-api.md](valtio-api.md)
- **示例索引**：[valtio-examples.md](valtio-examples.md)
