# @empjs/plugin-tailwindcss3
## 安装 
```
pnpm add @empjs/plugin-tailwindcss3 -D
```
## 使用 
```js
import pluginTailwindcss from '@empjs/plugin-tailwindcss3'
import {defineConfig} from '@empjs/cli'
export default defineConfig(({mode, env}) => {
  return {
    plugins: [pluginTailwindcss()],
  }
})

```

## 配置参数
插件支持传入 Tailwind CSS v3 的配置选项，例如：
```js
import pluginTailwindcss from '@empjs/plugin-tailwindcss3'
import {defineConfig} from '@empjs/cli'

export default defineConfig(({mode, env}) => {
  return {
    plugins: [
      pluginTailwindcss({
        // 指定要扫描的文件
        content: [`${appSrc}/src/**/*.{js,jsx,ts,tsx}`],
        // 自定义主题
        theme: {
          extend: {
            colors: {
              primary: '#3490dc',
              secondary: '#ffed4a',
              danger: '#e3342f',
            },
          },
        },
        // 添加插件
        plugins: [
          require('@tailwindcss/forms'),
          require('@tailwindcss/typography'),
        ],
      }),
    ],
  }
})
```
### 默认配置
如果不传入配置参数，插件会使用以下默认配置：
```js
{
  content: [`${appSrc}/**/*.{html,js,ts,jsx,tsx}`],
}
```
其中 appSrc 是项目源代码目录路径。

更多 Tailwind CSS v3 配置选项，请参考 [Tailwind CSS 官方文档](https://v3.tailwindcss.com/) 。