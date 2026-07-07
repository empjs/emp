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
