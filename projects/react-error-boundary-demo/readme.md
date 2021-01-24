# @emp/react-error-boundary-demo
针对react组件，使用 @efox/emp-react-error-boundary webpack loader 包裹错误边界

目前仅支持 esm 编译下的
+ export default [模块名]
+ export {[模块名], [模块名]}
+ export default {[模块名], [模块名]}

todo
+ 支持 export const [模块名]
+ loader改用ast优化逻辑
+ loader使用ts开发