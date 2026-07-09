# 构建配置

常见构建配置包括输出目录、静态资源目录、source map、target、module id、chunk id 和压缩策略。

```ts
export default defineConfig({
  build: {
    outDir: 'dist',
    target: 'es2018',
    rspack: {
      experiments: {
        css: true,
      },
    },
  },
})
```

v4 基于 Rspack 2，建议把高风险实验能力留在项目配置中显式打开，并通过应用级构建和浏览器测试验证。

## Rspack 2.1 能力

EMP 默认启用低风险的构建增强：

| 能力 | 默认行为 | 说明 |
| --- | --- | --- |
| `module.parser.javascript.createRequire` | `true` | ESM 中通过 `module.createRequire()` 创建的 `require` 可以被 Rspack 静态解析并纳入打包。 |
| persistent cache 清理 | `maxAge: 7 * 24 * 60 * 60`、`maxVersions: 3` | 避免长期开发或分支切换后旧缓存版本持续堆积。 |

语义更强或仍偏实验的能力需要手动启用：

```ts
export default defineConfig({
  build: {
    rspack: {
      experiments: {
        sourceImport: true,
      },
    },
  },
})
```

如果项目需要自行管理 persistent cache，可以显式关闭自动清理维度：

```ts
export default defineConfig({
  cache: {
    type: 'persistent',
    maxAge: Infinity,
    maxVersions: Infinity,
  },
})
```
