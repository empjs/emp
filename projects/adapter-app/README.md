# EMP Bridge 全框架演示台

同一套计数器组件，在 React 16 / 17 / 18 / 19、Vue 2 / 3 六种宿主中运行。

每张卡片展示完整的“宿主 → 组件”关系。版本来自对应运行时的 `React.version` / `Vue.version`，Bridge 版本读取本地包元信息。页面外壳使用 React 17，每张卡片内部的宿主由选择器切换，不会把外壳版本误标为组件版本。

## 本地运行

本仓库锁文件使用 pnpm 8 格式。首次运行先安装锁定依赖，并构建本地工具及 Bridge 包：

```sh
pnpm install --frozen-lockfile
pnpm --filter @empjs/chain build
pnpm --filter @empjs/cli --filter @empjs/plugin-react --filter @empjs/share build
pnpm --filter '@empjs/bridge-*' build
pnpm --filter adapter-app dev
```

演示台监听 `0.0.0.0:7704`。所有演示运行时通过本地构建的异步模块加载，不需要启动其他项目或加载第三方 CDN。

## 场景

- 基础通信：修改名称和步长，观察 Props 即时更新且计数保持；取消可选 Props，组件恢复默认展示。
- 多实例：同一卡片两个组件，计数及生命周期独立。
- 混合嵌套：选择任意宿主，运行“宿主 → Vue 3 → React 19”和“宿主 → React 18 → Vue 2”。每一层显示自身运行版本。
- 卸载与重挂载：销毁组件后重新创建，计数恢复为 0；挂载、卸载均写入事件记录。
- 慢加载：模拟 700ms 异步加载，可在加载完成前卸载或切换宿主。
- 模拟失败：显示加载错误，点击重试后恢复；模拟错误会正常出现在浏览器控制台。

## 兼容矩阵与自动验收

矩阵初始状态是“待验证”。点击“验证全部 36 种组合”后，页面逐项挂载真实组件，检查：

1. 宿主、组件及实际版本。
2. Props 更新和移除、步长变化及状态保持。
3. 替换回调后只向新回调发送一次事件。
4. 多实例计数隔离。
5. 卸载回调、DOM 清理、重新挂载及再次卸载。

结果仅代表本次页面中锁定版本的运行情况，不是任意历史补丁版本的兼容承诺。

```sh
pnpm --filter adapter-app typecheck
pnpm --filter adapter-app test:unit
pnpm --filter adapter-app build
pnpm --filter adapter-app start
pnpm --filter adapter-app test:bridge
```

浏览器验收使用本机 Chrome；通过 `BRIDGE_URL` 指定服务地址，通过 `BRIDGE_ARTIFACTS` 指定截图和 JSON 报告目录（默认 `/private/tmp/emp-bridge-acceptance`）。测试还检查六种宿主下的失败重试、加载中卸载、多实例、混合嵌套、移动端横向溢出，以及浏览器错误和警告。

## 框架运行时与组件契约

`runtimes/` 中每个私有 workspace 包锁定自己的框架与匹配的渲染器。React 的 JSX/组件对象不跨运行时传递；跨边界统一使用 DOM Bridge Provider 和普通 Props / 函数回调。

```ts
interface DemoProps {
  name: string
  step: number
  instanceId: string
  note?: string
  onChange?: (event: DemoEvent) => void
  onLifecycle?: (event: DemoEvent) => void
}
```

`src/lab/runtime-factory.ts` 提供 React 和 Vue 的同等行为实现。`registry.ts` 按需加载运行时，`DemoCard.tsx` 管理实例，`verify.ts` 执行真实交互检查。

## 原有 Module Federation 示例

原有远端接入和 Vuex / Pinia 用例保留在 `LegacyApp.tsx`，需要三个远端项目：

```sh
pnpm --filter adapter-host --filter adapter-vue2-host --filter adapter-vue3-host dev
pnpm --filter adapter-app dev:legacy
```

旧入口监听 7702；`build:legacy` 输出到 `dist-legacy`，不覆盖演示台 `dist`。新矩阵验证的是 Bridge 跨框架渲染和通信；Module Federation 的网络、远端清单及发布链路需要在远端示例中另外验收。

原有架构说明保留在 [LEGACY.md](./LEGACY.md)。
