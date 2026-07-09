# 配置参考

EMP 配置以 `defineConfig(...)` 为入口。配置项最终会驱动 Rspack、开发服务、HTML 插件、Module Federation、CSS 和调试能力。

```ts
import {defineConfig} from '@empjs/cli'

export default defineConfig(store => {
  return {
    server: {
      port: 8000,
    },
    build: {
      outDir: 'dist',
      target: 'es2018',
    },
    plugins: [],
  }
})
```

如果需要直接接触 Rspack 2 能力，可以通过 `build.rspack` 显式传入项目自有配置。
