# Vue3-in-Vue2 项目使用教程

## 项目概述

Vue3-in-Vue2 是一个基于 EMP (Extensible Micro-frontend Platform) 的微前端解决方案，允许在 Vue2 应用中无缝集成和使用 Vue3 组件。该项目通过自定义适配器组件实现了跨版本的组件兼容性。

## 核心特性

- ✅ **跨版本兼容**：在 Vue2 项目中直接使用 Vue3 组件
- ✅ **状态管理支持**：支持 Pinia 状态管理库
- ✅ **Props 传递**：完整支持 Vue2 到 Vue3 的 props 传递
- ✅ **生命周期管理**：自动处理组件的挂载和卸载
- ✅ **错误处理**：完善的错误捕获和处理机制
- ✅ **热重载支持**：开发环境下支持组件热重载

## 项目结构

```
vue3-in-vue2/
├── README.md                 # 项目说明
├── emp.config.ts            # EMP 构建配置
├── package.json             # 项目依赖配置
└── src/
    ├── Adapter.js           # Vue3 适配器核心组件
    ├── App.vue             # 主应用组件
    ├── bootstrap.js        # 应用启动文件
    ├── index.html          # HTML 模板
    ├── index.js            # 入口文件
    ├── logo.png            # 项目图标
    └── share.js            # 微前端共享配置
```

## 快速开始

### 1. 环境要求

- Node.js >= 16
- pnpm >= 7

### 2. 安装依赖

```bash
# 在项目根目录下安装依赖
pnpm install
```

### 3. 启动开发服务器

```bash
# 启动 Vue3-in-Vue2 项目
pnpm --filter vue3-in-vue2 dev

# 或者进入项目目录
cd apps/vue3-in-vue2
pnpm dev
```

项目将在 `http://localhost:9903` 启动。

### 4. 启动 Vue3 Host 应用

为了完整体验功能，还需要启动提供 Vue3 组件的 Host 应用：

```bash
# 启动 Vue3 Host 应用（通常在端口 9901）
pnpm --filter vue3-host dev
```

> ⚠️ **重要提醒**：为了避免影响主应用的热更新功能，建议 vue3-host 应用在 **production 模式** 下运行。开发模式下的 vue3-host 可能会导致主应用出现热更新冲突和报错。
>
> ```bash
> # 推荐：以 production 模式启动 vue3-host
> pnpm --filter vue3-host build
> pnpm --filter vue3-host preview
> 
> # 或者使用生产构建后的静态服务
> pnpm --filter vue3-host build && pnpm --filter vue3-host serve
> ```

## 核心组件详解

### Vue3Adapter 适配器组件

`Adapter.js` 是项目的核心组件，负责在 Vue2 环境中渲染 Vue3 组件。

#### 主要功能

1. **组件加载**：通过 EMP 运行时动态加载远程 Vue3 组件
2. **状态管理**：预先创建 Pinia 实例，避免时序问题
3. **生命周期管理**：正确处理 Vue3 应用的创建、挂载和卸载
4. **错误处理**：提供完善的错误捕获和用户反馈

#### 核心方法

```javascript
// 1. 加载 Vue3 组件
async loadVue3Component() {
  // 先创建 Vue3 应用实例和配置 Pinia
  await this.createVue3App()
  
  // 通过 EMP 运行时加载组件
  const componentModule = await rt.load(this.moduleName)
  this.vue3Component = componentModule.default
  
  // 渲染组件
  await this.renderVue3Component()
}

// 2. 创建 Vue3 应用实例
async createVue3App() {
  // 创建 Pinia 实例，确保状态管理正常工作
  if (!this.piniaInstance) {
    this.piniaInstance = EMP_ADAPTER_VUE.Pinia.createPinia?.() || EMP_ADAPTER_VUE.Pinia
  }
}

// 3. 挂载 Vue3 应用
async mountVue3App(container) {
  // 创建 Vue3 应用实例
  const {createApp} = EMP_ADAPTER_VUE.Vue
  this.vue3App = createApp(this.vue3Component, this.componentProps)
  
  // 配置 Pinia
  if (this.piniaInstance) {
    this.vue3App.use(this.piniaInstance)
  }
  
  // 挂载到容器
  this.vue3App.mount(container)
}
```

## 使用方法

### 基本用法

在 Vue2 组件中使用 Vue3Adapter：

```vue
<template>
  <div>
    <h2>Vue2 应用</h2>
    
    <!-- 使用适配器加载 Vue3 组件 -->
    <Vue3Adapter 
      module-name="v3h/ComponentName" 
      :component-props="propsData" 
    />
  </div>
</template>

<script>
import Vue3Adapter from './Adapter.js'

export default {
  components: {
    Vue3Adapter
  },
  data() {
    return {
      propsData: {
        title: '来自 Vue2 的数据',
        message: '这是传递给 Vue3 组件的 props'
      }
    }
  }
}
</script>
```

### Props 配置

Vue3Adapter 组件接受以下 props：

| 属性名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `module-name` | String | 是 | Vue3 组件的模块名称，格式：`远程应用别名/组件名` |
| `component-props` | Object | 否 | 传递给 Vue3 组件的 props 对象 |

### 动态 Props 更新

适配器支持动态更新 props：

```vue
<template>
  <div>
    <Vue3Adapter 
      module-name="v3h/Info" 
      :component-props="dynamicProps" 
    />
    
    <button @click="updateProps">更新 Props</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dynamicProps: {
        count: 0,
        message: '初始消息'
      }
    }
  },
  methods: {
    updateProps() {
      this.dynamicProps = {
        count: this.dynamicProps.count + 1,
        message: `更新后的消息 ${this.dynamicProps.count + 1}`
      }
    }
  }
}
</script>
```

## 配置说明

### EMP 配置 (emp.config.ts)

```typescript
import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
import {pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  return {
    plugins: [
      vue(), // Vue2 插件
      pluginRspackEmpShare({
        name: 'vue2App',
        remotes: {}, // 远程应用配置
        empRuntime: {
          runtimeLib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
          framework: {
            libs: [
              `https://unpkg.com/vue@2.7.14/dist/vue.min.js`,
              `https://unpkg.com/vuex@3.6.2/dist/vuex.min.js`,
              // 其他依赖库...
            ],
            global: 'window',
          },
          setExternals(o) {
            o['vue'] = `Vue`
            o['vuex'] = `Vuex`
            return o
          },
        },
      }),
    ],
    html: {
      title: 'vue2App',
      template: 'src/index.html',
    },
    server: {port: 9903}, // 开发服务器端口
    define: {ip: `${store.server.ip}`},
  }
})
```

### 微前端配置 (share.js)

```javascript
import rt from '@empjs/share/runtime'

// 初始化运行时
rt.init({
  name: 'vue2App',
  shared: {},
  remotes: [],
})

// 动态注册远程应用
rt.register([
  {
    name: 'vue3Host',           // 远程应用名称
    entry: `http://${process.env.ip}:9901/emp.json`, // 远程应用入口
    alias: 'v3h',               // 别名，用于组件引用
  },
])
```

## 最佳实践

### 1. 错误处理

适配器内置了完善的错误处理机制：

```javascript
// 在适配器中会显示加载状态和错误信息
render(h) {
  if (this.isLoading) {
    return h('div', {class: 'vue3-adapter-loading'}, '正在加载 Vue3 组件...')
  }
  
  if (this.error) {
    return h('div', {class: 'vue3-adapter-error'}, [
      h('p', `加载组件失败: ${this.error}`),
      h('button', {on: {click: this.reload}}, '重试')
    ])
  }
  
  return h('div', {ref: 'vue3Container', class: 'vue3-adapter-container'})
}
```

### 2. 性能优化

- **懒加载**：组件只在需要时才加载
- **缓存机制**：Pinia 实例在组件生命周期内复用
- **内存管理**：组件卸载时正确清理资源

### 3. 开发调试

启用开发模式进行调试：

```bash
# 开发模式启动主应用
pnpm dev

# 构建分析
pnpm run stat

# 生产构建
pnpm run build
```

**开发环境最佳实践**：
- 主应用（vue3-in-vue2）使用开发模式：`pnpm dev`
- Vue3 Host 应用建议使用 production 模式，避免热更新冲突：
  ```bash
  # 推荐的开发流程
  pnpm --filter vue3-host build
  pnpm --filter vue3-host preview
  ```
- 如需调试 Vue3 组件，可临时切换 vue3-host 到开发模式，但需注意可能的冲突

## 常见问题

### Q1: 组件加载失败怎么办？

**A**: 检查以下几点：
1. 确保 Vue3 Host 应用正在运行
2. 检查网络连接和端口配置
3. 验证组件名称是否正确
4. 查看浏览器控制台错误信息

### Q2: 主应用热更新失效或报错？

**A**: 这通常是由于 vue3-host 应用在开发模式下运行导致的冲突：
1. **推荐解决方案**：将 vue3-host 切换到 production 模式
   ```bash
   # 构建并启动 production 模式的 vue3-host
   pnpm --filter vue3-host build
   pnpm --filter vue3-host preview
   ```
2. **临时解决方案**：重启两个应用，确保启动顺序正确
3. **检查端口冲突**：确保两个应用使用不同的端口
4. **清除缓存**：清除浏览器缓存和 node_modules/.cache

### Q3: Props 传递不生效？

**A**: 确保：
1. Props 数据格式正确
2. Vue3 组件正确定义了 props
3. 数据是响应式的（使用 Vue2 的 data 或 computed）

### Q4: 状态管理问题？

**A**: 
1. 确保 Pinia 正确配置
2. 检查 Vue3 组件中的 store 使用方式
3. 验证适配器中的 Pinia 实例创建

### Q5: 样式隔离问题？

**A**:
1. 使用 scoped CSS
2. 确保 CSS 类名不冲突
3. 考虑使用 CSS Modules 或 CSS-in-JS

## 扩展功能

### 自定义适配器

可以基于现有适配器创建自定义版本：

```javascript
// CustomAdapter.js
import Vue3Adapter from './Adapter.js'

export default {
  extends: Vue3Adapter,
  methods: {
    // 重写或扩展方法
    async loadVue3Component() {
      // 自定义加载逻辑
      console.log('开始加载自定义组件...')
      await this.$parent.loadVue3Component.call(this)
    }
  }
}
```

### 添加插件支持

在适配器中添加更多 Vue3 插件：

```javascript
async mountVue3App(container) {
  const {createApp} = EMP_ADAPTER_VUE.Vue
  this.vue3App = createApp(this.vue3Component, this.componentProps)
  
  // 添加 Pinia
  if (this.piniaInstance) {
    this.vue3App.use(this.piniaInstance)
  }
  
  // 添加其他插件
  if (EMP_ADAPTER_VUE.VueRouter) {
    this.vue3App.use(EMP_ADAPTER_VUE.VueRouter)
  }
  
  this.vue3App.mount(container)
}
```

## 总结

Vue3-in-Vue2 项目提供了一个完整的解决方案，让开发者能够在现有的 Vue2 项目中逐步引入 Vue3 组件，实现平滑的技术栈迁移。通过 EMP 微前端架构和自定义适配器，项目具备了良好的扩展性和维护性。

关键优势：
- 🚀 **渐进式迁移**：无需重写整个应用
- 🔧 **灵活配置**：支持多种部署和配置方式  
- 📦 **完整生态**：支持状态管理、路由等完整功能
- 🛠️ **开发友好**：提供完善的开发工具和调试支持

通过本教程，您应该能够成功搭建和使用 Vue3-in-Vue2 项目，并根据实际需求进行定制和扩展。