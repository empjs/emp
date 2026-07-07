# CSS 插件

## Tailwind CSS 4

`@empjs/plugin-tailwindcss` 当前面向 Tailwind CSS 4。仓库中的 `apps/tailwind-4` 是当前主验证场景。

```ts
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

export default defineConfig({
  plugins: [pluginTailwindcss()],
})
```

## PostCSS

`@empjs/plugin-postcss` 用于接入 PostCSS 插件链，适合已有 CSS 工程继续保留处理流程。

## Lightning CSS

`@empjs/plugin-lightningcss` 用于更现代的 CSS 编译、压缩和单位转换场景。仓库中的 demo 应用覆盖了 rem / vw 转换和产物断言。

## Stylus

`@empjs/plugin-stylus` 用于保留 Stylus 样式链路。
