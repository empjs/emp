# @empjs/cdn-vue-router-pinia

为业务使用优化的 Vue 3 + Vue Router + Pinia 最小化 CDN Bundle。

## 📦 Bundle 版本

| 文件名 | 大小 | 包含内容 | 使用场景 |
|--------|------|----------|----------|
| `vue.min.umd.js` | ~569KB | Vue 3 + Pinia | 只需要状态管理的应用 |
| `vueRouter.min.umd.js` | ~674KB | Vue 3 + Vue Router + Pinia | 完整的 SPA 应用 |

> 🎯 **精简版本**: 只保留两个核心bundle，体积最小化优化！

## 🚀 快速开始

### Vue + Pinia 使用

```html
<!-- 引入Vue + Pinia -->
<script src="https://your-cdn.com/vue.min.umd.js"></script>
<script>
const { createApp, ref } = EMP_VUE_PINIA;
const { createPinia, defineStore } = EMP_VUE_PINIA;

// 你的应用代码...
</script>
```

### Vue + Vue Router + Pinia 使用

```html
<script src="https://your-cdn.com/vueRouter.min.umd.js"></script>
<script>
const { createApp, ref, createRouter, createWebHistory, createPinia } = EMP_ADAPTER_VUE;

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

### 超级最小化版本

```html
<script src="https://your-cdn.com/minimal.ultra.min.umd.js"></script>
<script>
const { createApp, ref, reactive, computed } = EMP_VUE_MINIMAL;

const app = createApp({
  setup() {
    const state = reactive({ count: 0 });
    const doubleCount = computed(() => state.count * 2);
    return { state, doubleCount };
  }
});
</script>
```

## 🛠️ 构建命令

```bash
# 构建所有版本
pnpm run build:all

# 单独构建
pnpm run build        # 标准版本 (开发+生产)
pnpm run build:min    # 最小化版本 (仅生产)
```

## ⚡ 优化特性

- **Tree Shaking**: 移除未使用的代码
- **Dead Code Elimination**: 移除开发环境代码
- **多轮Terser压缩**: 最多10轮压缩优化
- **变量名混淆**: 缩短变量名减少体积
- **移除注释和空白**: 极致压缩
- **ES2020目标**: 现代浏览器优化
- **Console移除**: 生产版本移除所有console语句

### 配置文件说明

| 配置文件 | 用途 | 特点 |
|----------|------|------|
| `tsup.config.ts` | 标准构建 | 平衡性能和兼容性 |
| `tsup.min.config.ts` | 最小化构建 | 更激进的压缩 |
| `tsup.ultra.config.ts` | 超级最小化 | 极致压缩，只包含核心API |

## 🎯 自定义优化

### 1. 自定义核心API

编辑 `src/minimal.ts` 文件，只导出你需要的API：

```typescript
// 只导出最基础的API
import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'

export { createApp, ref, createPinia }
```

### 2. 调整压缩参数

修改 `tsup.ultra.config.ts` 中的 `terserOptions`：

```typescript
terserOptions: {
  compress: {
    passes: 10, // 增加压缩轮次
    unsafe: true, // 启用更激进的优化
    // ... 其他选项
  }
}
```

### 3. 目标浏览器调整

根据你的目标浏览器调整 `target` 设置：

```typescript
// 现代浏览器
target: 'es2022'

// 兼容性优先
target: 'es2018'
```

## 📋 API 导出清单

### 完整版本 (EMP_ADAPTER_VUE)
- Vue 3 所有导出
- Vue Router 所有导出  
- Pinia 所有导出

### 最小化版本 (EMP_VUE_MINIMAL)
- **Vue 核心**: `createApp`, `ref`, `reactive`, `computed`, `watch`, `watchEffect`, `onMounted`, `onUnmounted`
- **Vue Router**: `createRouter`, `createWebHistory`, `createWebHashHistory`, `useRouter`, `useRoute`
- **Pinia**: `createPinia`, `defineStore`, `storeToRefs`

## 🔍 使用建议

1. **小型项目**: 使用 `minimal.ultra.min.umd.js`
2. **中型项目**: 使用 `vue.min.umd.js` 或 `vueRouter.min.umd.js`
3. **大型项目**: 考虑使用模块化导入而非CDN

## 📄 许可证

MIT