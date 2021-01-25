# @emp/react-error-boundary-demo
针对react组件，使用 @efox/emp-react-error-boundary webpack loader 包裹错误边界

目前仅支持 react esm 中以下的export类型进行编译:
+ export default [模块名]
+ export {[模块名], [模块名]}
+ export default {[模块名], [模块名]}

## todo
+ 支持 export const [模块名]
+ loader改用ast优化逻辑
+ loader使用ts开发
+ loader npm 发布

## 调试注意事项

使用 `lerna add -D {dep} --scope @emp/react-error-boundary-demo`

添加 `@efox/emp-cli` 与 `@efox/emp-react-error-boundary` 依赖 方便本地workspace调试