# empShare 配置

`empShare` 相关配置由 `@empjs/share` 处理，核心目标是降低 Module Federation 接入成本。

```ts
pluginRspackEmpShare({
  name: 'mfApp',
  remotes: {
    mfHost: 'mfHost@http://localhost:6001/emp.json',
  },
  shared: {
    react: {singleton: true},
    'react-dom': {singleton: true},
  },
})
```

## 建议

- remote provider 需要检查 expose、manifest 和 remote entry。
- remote consumer 需要检查 remotes URL 和真实页面消费链路。
- 开启 DTS 时，需要把类型产物作为验收对象。
- 开启 `empRuntime.version` 时，需要确认派生 scope 名称符合预期。
