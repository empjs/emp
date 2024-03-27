# @empjs/postcss-px-to-viewport

## 安装 
```
pnpm add @empjs/postcss-px-to-viewport -D
```

## 配置 emp-config.js
```js
import {defineConfig} from '@empjs/cli'
const cssSelector = {
  vw: true,
}
  const vwplugin = store.importResolve('@empjs/postcss-px-to-viewport', import.meta.url)
export default defineConfig(store => {
  return {
    plugins,
    css: {
      postcss: [
        ['autoprefixer'],
        // rem
        !cssSelector.vw
          ? [
              store.importResolve('postcss-pxtorem'),
              {
                rootValue: 16, //结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 20rem
                unitPrecision: 5,
                // propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
                propList: ['*'],
                selectorBlackList: [],
                replace: true,
                mediaQuery: false,
                minPixelValue: 0,
                // exclude: /node_modules/i, //这里表示不处理node_modules文件夹下的内容
              },
            ]
          : [
              vwplugin,
              {
                unitToConvert: 'px',
                viewportWidth: 320,
                viewportHeight: 568, // not now used; TODO: need for different units and math for different properties
                unitPrecision: 5,
                viewportUnit: 'vw',
                fontViewportUnit: 'vw', // vmin is more suitable.
                selectorBlackList: [],
                propList: ['*'],
                minPixelValue: 1,
                mediaQuery: false,
                replace: true,
                landscape: false,
                landscapeUnit: 'vw',
                landscapeWidth: 568,
              },
            ],
      ],
    },
  }
})


```
