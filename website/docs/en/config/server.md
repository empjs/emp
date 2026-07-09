# 开发服务

常见服务配置包括 host、port、open 和代理规则。

```ts
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8000,
    open: true,
  },
})
```

本地调试 Module Federation 时，host 和 remote 需要使用稳定端口，避免 manifest 或 remote entry 指向临时地址。

## 代理诊断

demo 应用覆盖了代理成功、延迟、错误和目标不可达场景。代理规则调整后，应检查页面上的错误展示是否仍然对用户可理解。
