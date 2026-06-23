# EMP Share Version Isolation Design

## Goal

在 `@empjs/share` 中增加一个最小开关，让共享包在同页加载多个版本时，避免 `emp.js` container scope 和 CSS Modules className 互相干扰。

对外 API 只增加：

```ts
pluginRspackEmpShare({
  name: 'some_share',
  empRuntime: {
    version: true,
  },
})
```

`version: true` 不接受手写版本号。版本来源固定为当前业务项目 `package.json.version`。

## Reference Behavior

参考项目 `/Users/Bigo/Desktop/develop/workflow/bigo-nova-core` 的实现：

- `packages/web/src/config.ts` 从 `package.json` 派生 `shareName = pkg.name + '_' + pkg.version`，并清理为合法变量名。
- `packages/web/src/plugins/empShare/index.ts` 把 `shareName` 作为 Module Federation `name`。
- `packages/web/src/index.ts` 把同一个 `shareName` 作为 `css.prifixName`。

EMP 内建实现应复用这个行为，但把业务手动封装收敛为一个 `empRuntime.version` 开关。

## API

在 `EMPSHARERuntimeOptions` 中新增：

```ts
version?: boolean
```

语义：

- `version !== true`：完全保持当前行为。
- `version === true`：从当前项目 `package.json` 读取 `name` 和 `version`，派生版本化 share name。

派生规则与参考项目保持一致：

```ts
const versionedShareName = `${pkg.name}_${pkg.version}`
  .replace(/@/g, '')
  .replace(/[^\w_]/g, '_')
```

若 `pkg.name` 或 `pkg.version` 缺失，回退到当前 legacy `name`，并不启用版本化改名。

## Architecture

### Unit 1: Versioned Share Name

在 `EmpShare` 内部增加一个小的归一化方法，负责计算：

- `enabled`: `empRuntime.version === true`
- `baseName`: 当前插件传入的 `op.name` 或 `store.empConfig.output.uniqueName`
- `packageName`: `store.pkg.name`
- `packageVersion`: `store.pkg.version`
- `versionedName`: 清理后的 `${packageName}_${packageVersion}`
- `effectiveName`: 未开启时为 `baseName`，开启时为 `versionedName`

这个方法只做纯计算，不修改 store 或 plugin option。

### Unit 2: MF Scope Isolation

`setMfName()` 使用 `effectiveName`：

- 写回 `this.op.name`
- 同步 `store.chain.output.set('uniqueName', effectiveName)`

这样 `emp.js` 中的 Module Federation container var 会从业务名变成 `pkgName_pkgVersion`，避免两个版本同页覆盖同一个 var。

文件名仍保持 `emp.js`。隔离点是文件内容里的 container scope，不是 URL 文件名。

### Unit 3: CSS Modules Prefix

当 `empRuntime.version === true` 且业务没有显式配置 `css.prifixName` 时，自动设置：

```ts
css.prifixName = effectiveName
```

如果业务已经配置了 `css.prifixName`，不覆盖。

该能力只影响 CSS Modules 生成的 className，不处理普通全局 CSS selector。

### Unit 4: Legacy Compatibility

不修改 `EMPShareGlobalVal` 主流程。它只是 `empRuntime` 注入的辅助变量，用来告诉 SDK 从哪个 window global 读取 runtime/framework，不是本次目标。

不修改 `runtimeGlobal`、`frameworkGlobal`、`shareLib.global`。显式 global 配置继续由业务负责。

## Data Flow

配置输入：

```ts
pluginRspackEmpShare({
  name: 'logical_share_name',
  empRuntime: { version: true },
})
```

运行时计算：

```text
store.pkg.name + store.pkg.version
  -> sanitize
  -> effectiveName
  -> ModuleFederationPlugin.name
  -> output.uniqueName
  -> css.prifixName when empty
```

消费方影响：

- 通过 `emp.json` 消费时，验证 manifest 是否使用版本化后的 name。
- 直接通过 `scope@url/emp.js` 消费时，scope 必须使用版本化后的实际 name。

## Error Handling

- `empRuntime.version` 非 `true` 时不报错，按 legacy 行为执行。
- `store.pkg.name` 或 `store.pkg.version` 缺失时不抛错，回退 legacy `baseName`，避免破坏 dev/build。
- 派生后的名称统一走现有 `store.encodeVarName` 或等价清理逻辑，保证是合法变量名。

## Testing

新增或扩展 `packages/emp-share` 测试覆盖：

- 未配置 `empRuntime.version` 时，MF `name` 与 `output.uniqueName` 保持旧行为。
- `empRuntime.version: false` 时，行为与未配置一致。
- `empRuntime.version: true` 时，MF `name` 使用 `package.json name + version` 派生值。
- `empRuntime.version: true` 时，`output.uniqueName` 与 MF `name` 一致。
- `empRuntime.version: true` 且 `css.prifixName` 为空时，自动填入派生值。
- `empRuntime.version: true` 且业务已有 `css.prifixName` 时，不覆盖业务配置。
- `filename` 仍为 `emp.js`。

最小验证命令：

```bash
pnpm --filter @empjs/share test
pnpm --filter @empjs/share build
pnpm --filter @empjs/cli build
```

## Out Of Scope

- 不增加 `shareName` 公共配置。
- 不支持手写 `empRuntime.version: '1.2.3'`。
- 不自动隔离普通全局 CSS selector。
- 不重构 `EMPShareGlobalVal`。
- 不改变 `emp.js` 文件名。
