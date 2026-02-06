# @empjs/valtio API 参考

基于 Valtio v2 的导出与类型整理。

## 类型

| 类型 | 说明 |
|------|------|
| `Unsubscribe` | `() => void`，取消订阅 |
| `InitialStateOrFn<T>` | `T \| (() => T)`，初始状态或惰性函数 |
| `DeriveFn<T, D>` | `(get, proxy) => TDerived`，派生函数 |
| `CreateOptionsBase` | `{ devtools?: boolean; name?: string }` |
| `StoreBaseMethods<T>` | 增强方法集：`useSnapshot`、`set`、`reset`、`batch`、`subscribe` 等 |
| `EmpStore<T>` | `T & StoreBaseMethods<T>`，推荐用于类型标注 |
| `WithHistorySnapshot<T>` | `{ value, history, isUndoEnabled, isRedoEnabled, undo, redo }` |
| `StoreWithDerived<T, D>` | `{ base; derived }` |

## createStore

```ts
function createStore<T>(initialState: T, options?: CreateOptionsBase): EmpStore<T>
function createStore<T>(initialState: T, options: { history: WithHistoryOptions }): HistoryStoreWithSnapshot<T>
function createStore<T, D>(initialState: T, options: { derive: DeriveFn<T, D> }): StoreWithDerived<T, D>
```

- **常规**：返回 `EmpStore<T>`；支持 `devtools`、`name`
- **history**：与 valtio-history 的 `proxyWithHistory` 一致
- **derive**：返回 `{ base, derived }`；base 写、derived 只读

## useStore

```ts
function useStore<T>(initialState: InitialStateOrFn<T>): [Snapshot<T>, EmpStore<T>]
function useStore<T>(initialState: InitialStateOrFn<T>, options: { history }): [WithHistorySnapshot<T>, HistoryStore<T>]
function useStore<T, D>(initialState: InitialStateOrFn<T>, options: { derive }): [Snapshot<T>, EmpStore<T>, D]
```

`initialState` 可为函数实现惰性初始化。options 仅支持 `history`、`derive`。

## StoreBaseMethods

| 方法 | 说明 |
|------|------|
| `getSnapshot` | 当前只读快照 |
| `useSnapshot` | React 内订阅用 |
| `subscribe` | 全量订阅 |
| `subscribeKey` | 单 key 订阅 |
| `subscribeKeys` | 多 key 订阅 |
| `update` | 批量更新 |
| `set` | 单字段更新 |
| `setNested` | 点号路径更新 |
| `delete` | 删除字段 |
| `reset` | 重置为初始状态 |
| `batch` | 批量写（单次调度） |
| `clone` | deepClone 快照后新 proxy |
| `toJSON` | 可序列化字段 |
| `fromJSON` | 从对象写回 store |
| `persist` | localStorage 双向同步 |
| `debug` | console 打印当前快照 |

## 集合与再导出

- **createMap** / **createSet**：响应式 Map/Set
- **再导出**：`proxy`、`snapshot`、`subscribe`、`subscribeKey`、`ref`、`useSnapshot`、`proxyWithHistory`、`proxyMap`、`proxySet`、`derive`、`devtools`
