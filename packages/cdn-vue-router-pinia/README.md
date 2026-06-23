# @empjs/cdn-vue-router-pinia

为业务使用优化的 Vue 3 + Vue Router + Pinia 最小化 CDN Bundle。

## 📦 Bundle 版本

| 文件名 | 大小 | 包含内容 | 使用场景 |
|--------|------|----------|----------|
| `vue.development.umd.js` | - | Vue 3 + Pinia | 本地调试 |
| `vue.production.umd.js` | - | Vue 3 + Pinia | 生产环境 |
| `vueRouter.development.umd.js` | - | Vue 3 + Vue Router + Pinia | 本地调试 |
| `vueRouter.production.umd.js` | - | Vue 3 + Vue Router + Pinia | 生产环境 |

> 🎯 **精简版本**: 只保留两个核心bundle，体积最小化优化！

## 🚀 快速开始

### Vue + Pinia 使用

```html
<!-- 引入 Vue + Pinia -->
<script src="https://your-cdn.com/vue.production.umd.js"></script>
<script>
const { Vue, Pinia } = EMP_ADAPTER_VUE;
const { createApp, ref } = Vue;
const { createPinia, defineStore } = Pinia;

// 你的应用代码...
</script>
```

### Vue + Vue Router + Pinia 使用

```html
<script src="https://your-cdn.com/vueRouter.production.umd.js"></script>
<script>
const { Vue, VueRouter, Pinia } = EMP_ADAPTER_VUE;
const { createApp, ref } = Vue;
const { createRouter, createWebHistory } = VueRouter;
const { createPinia } = Pinia;

const app = createApp({
  setup() {
    const count = ref(0);
    return { count };
  }
});

app.use(createRouter({ history: createWebHistory(), routes: [] }));
app.use(createPinia());
app.mount('#app');
</script>
```

## 🛠️ 构建命令

```bash
pnpm run build
pnpm run dev:bundle
```

## ⚡ 优化特性

- **Tree Shaking**: 移除未使用的代码
- **Dead Code Elimination**: 移除开发环境代码
- **移除注释和空白**: 极致压缩
- **ES2018目标**: 现代浏览器优化

### 配置文件说明

| 配置文件 | 用途 | 特点 |
|----------|------|------|
| `rslib.config.ts` | 标准构建 | 同时输出 development / production UMD |

## 🎯 自定义优化

### 1. 调整压缩参数

修改 `rslib.config.ts` 中的 `output.minify.jsOptions.minimizerOptions`：

```typescript
minify: {
  js: true,
  jsOptions: {
    minimizerOptions: {
      format: {
        comments: false,
      },
    },
  }
}
```

### 2. 目标浏览器调整

根据你的目标浏览器调整 `target` 设置：

```typescript
// 现代浏览器
syntax: 'es2022'

// 兼容性优先
syntax: 'es2018'
```

## 📋 API 导出清单

### 完整版本 (EMP_ADAPTER_VUE)
- Vue 3 所有导出
- Vue Router 所有导出  
- Pinia 所有导出

## 🔍 使用建议

1. **只需要 Vue + Pinia**: 使用 `vue.production.umd.js`
2. **需要 Vue Router + Pinia**: 使用 `vueRouter.production.umd.js`
3. **大型项目**: 考虑使用模块化导入而非 CDN

## 📄 许可证

MIT
