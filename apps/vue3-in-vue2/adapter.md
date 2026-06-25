# Vue3 适配器使用说明书

## 概述

Vue3 适配器是一个强大的工具，允许在 Vue2 应用中无缝集成和使用 Vue3 组件。它通过微前端技术实现跨版本组件的互操作性，为项目的渐进式升级提供了完美的解决方案。

## 核心特性

- ✅ **跨版本兼容**: 在 Vue2 环境中运行 Vue3 组件
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **插件支持**: 自动集成 Pinia、Vue Router 等插件
- ✅ **错误处理**: 完善的错误处理和重试机制
- ✅ **性能优化**: 智能的组件加载和资源管理
- ✅ **容错机制**: 多层级的容错和降级处理

## 快速开始

### 1. 基本用法

```vue
<template>
  <div>
    <h1>Vue2 应用</h1>
    <!-- 使用适配器加载 Vue3 组件 -->
    <Vue3Adapter 
      module-name="remote-app/MyVue3Component" 
      :component-props="vue3Props" 
    />
  </div>
</template>

<script>
import Vue3Adapter from './src/Adapter'

export default {
  components: {
    Vue3Adapter
  },
  data() {
    return {
      vue3Props: {
        title: '来自 Vue2 的数据',
        message: '这是传递给 Vue3 组件的 props'
      }
    }
  }
}
</script>
```

### 2. 高级用法

```vue
<template>
  <div class="app-container">
    <!-- 动态组件加载 -->
    <Vue3Adapter 
      :module-name="currentModule" 
      :component-props="dynamicProps"
      @error="handleError"
      @loaded="handleLoaded"
    />
    
    <!-- 多个 Vue3 组件 -->
    <Vue3Adapter 
      module-name="remote-app/UserProfile" 
      :component-props="userProps" 
    />
    
    <Vue3Adapter 
      module-name="remote-app/Dashboard" 
      :component-props="dashboardProps" 
    />
  </div>
</template>

<script>
import Vue3Adapter from './src/Adapter'

export default {
  components: {
    Vue3Adapter
  },
  data() {
    return {
      currentModule: 'remote-app/DefaultComponent',
      dynamicProps: {
        theme: 'dark',
        locale: 'zh-CN'
      },
      userProps: {
        userId: 123,
        permissions: ['read', 'write']
      },
      dashboardProps: {
        widgets: ['chart', 'table', 'summary']
      }
    }
  },
  methods: {
    handleError(error) {
      console.error('Vue3 组件加载失败:', error)
      // 可以显示错误提示或降级处理
    },
    
    handleLoaded(component) {
      console.log('Vue3 组件加载成功:', component)
    },
    
    switchComponent(moduleName) {
      this.currentModule = moduleName
    }
  }
}
</script>
```

## API 参考

### Vue3Adapter 组件

#### Props

| 属性名 | 类型 | 必需 | 默认值 | 描述 |
|--------|------|------|--------|------|
| `moduleName` | `String` | ✅ | - | 要加载的 Vue3 组件模块名称 |
| `componentProps` | `Object` | ❌ | `{}` | 传递给 Vue3 组件的 props |

#### 事件

| 事件名 | 参数 | 描述 |
|--------|------|------|
| `loaded` | `component` | 组件加载成功时触发 |
| `error` | `error` | 组件加载失败时触发 |
| `mounted` | `instance` | 组件挂载完成时触发 |

### Vue3AdapterCore 类

#### 构造函数

```typescript
constructor()
```

创建适配器实例，自动初始化 Vue3 运行时和插件。

#### 方法

##### `loadComponent(moduleName: string): Promise<any>`

加载指定的 Vue3 组件模块。

**参数:**
- `moduleName`: 组件模块名称

**返回值:**
- `Promise<any>`: 加载的组件

**示例:**
```typescript
const adapter = new Vue3AdapterCore()
const component = await adapter.loadComponent('remote-app/MyComponent')
```

##### `mountApp(container: Element, props?: Record<string, any>): Promise<void>`

将 Vue3 组件挂载到指定容器。

**参数:**
- `container`: DOM 容器元素
- `props`: 可选的组件 props

**示例:**
```typescript
const container = document.getElementById('vue3-container')
await adapter.mountApp(container, { title: 'Hello Vue3' })
```

##### `updateProps(newProps: Record<string, any>): void`

更新组件的 props。

**参数:**
- `newProps`: 新的 props 对象

**示例:**
```typescript
adapter.updateProps({ title: 'Updated Title', count: 42 })
```

##### `cleanup(): void`

清理组件实例和相关资源。

**示例:**
```typescript
adapter.cleanup()
```

##### `reload(moduleName: string, container: Element, props?: Record<string, any>): Promise<void>`

重新加载组件。

**参数:**
- `moduleName`: 组件模块名称
- `container`: DOM 容器元素
- `props`: 可选的组件 props

#### 属性

##### `loading: boolean` (只读)

组件是否正在加载中。

##### `errorMessage: string | null` (只读)

当前的错误信息，无错误时为 `null`。

##### `hasVue3: boolean` (只读)

Vue3 运行时是否可用。

## 配置说明

### 环境要求

1. **Vue2 环境**: 项目需要运行在 Vue2.x 环境中
2. **EMP 运行时**: 需要配置 `@empjs/share` 运行时
3. **Vue3 运行时**: 需要全局可用的 Vue3 运行时

### EMP 配置示例

```typescript
// emp.config.ts
import { defineConfig } from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
import { pluginRspackEmpShare } from '@empjs/share'

export default defineConfig(store => {
  return {
    plugins: [
      vue(),
      pluginRspackEmpShare({
        name: 'vue2App',
        remotes: {
          'remote-app': 'http://localhost:9904/emp.js'
        },
        empRuntime: {
          runtimeLib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
          framework: {
            libs: [
              // Vue2 运行时
              `https://unpkg.com/vue@2.7.14/dist/vue.min.js`,
              `https://unpkg.com/vuex@3.6.2/dist/vuex.min.js`,
              // Vue3 运行时 (用于适配器)
              `https://unpkg.com/vue@3.3.4/dist/vue.global.js`,
              `https://unpkg.com/pinia@2.1.6/dist/pinia.iife.js`,
              `https://unpkg.com/vue-router@4.2.4/dist/vue-router.global.js`
            ],
            global: 'window'
          },
          setExternals(o) {
            o['vue'] = 'Vue'
            o['vuex'] = 'Vuex'
            return o
          }
        }
      })
    ],
    server: { port: 9903 }
  }
})
```

## 错误处理

### 常见错误类型

1. **模块加载失败**
   ```
   Error: Component remote-app/MyComponent not found or has no default export
   ```

2. **Vue3 运行时不可用**
   ```
   Vue3 runtime not available
   ```

3. **容器元素未找到**
   ```
   Error: Container element is required
   ```

### 错误处理策略

```vue
<template>
  <div>
    <Vue3Adapter 
      :module-name="moduleName"
      :component-props="props"
      @error="handleAdapterError"
    />
  </div>
</template>

<script>
export default {
  methods: {
    handleAdapterError(error) {
      // 记录错误
      console.error('适配器错误:', error)
      
      // 显示用户友好的错误信息
      this.$message.error('组件加载失败，请稍后重试')
      
      // 可选：降级到备用组件
      this.fallbackToLocalComponent()
    },
    
    fallbackToLocalComponent() {
      // 使用本地 Vue2 组件作为降级方案
      this.showFallback = true
    }
  }
}
</script>
```

## 性能优化

### 1. 组件预加载

```javascript
// 在应用启动时预加载常用组件
const adapter = new Vue3AdapterCore()

// 预加载组件
Promise.all([
  adapter.loadComponent('remote-app/Header'),
  adapter.loadComponent('remote-app/Footer'),
  adapter.loadComponent('remote-app/Sidebar')
]).then(() => {
  console.log('常用组件预加载完成')
})
```

### 2. 懒加载

```vue
<template>
  <div>
    <!-- 使用 v-if 实现懒加载 -->
    <Vue3Adapter 
      v-if="shouldLoadComponent"
      module-name="remote-app/HeavyComponent"
      :component-props="props"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      shouldLoadComponent: false
    }
  },
  mounted() {
    // 延迟加载重型组件
    setTimeout(() => {
      this.shouldLoadComponent = true
    }, 1000)
  }
}
</script>
```

### 3. 组件缓存

```javascript
// 实现组件缓存
class ComponentCache {
  constructor() {
    this.cache = new Map()
  }
  
  async getComponent(moduleName) {
    if (this.cache.has(moduleName)) {
      return this.cache.get(moduleName)
    }
    
    const adapter = new Vue3AdapterCore()
    const component = await adapter.loadComponent(moduleName)
    this.cache.set(moduleName, component)
    
    return component
  }
}

const componentCache = new ComponentCache()
```

## 最佳实践

### 1. 组件设计

- **保持组件的纯净性**: Vue3 组件应该尽量避免依赖全局状态
- **明确的 Props 接口**: 定义清晰的 props 类型和默认值
- **事件通信**: 使用事件进行组件间通信

### 2. 错误边界

```vue
<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-fallback">
      <h3>组件加载失败</h3>
      <p>{{ errorMessage }}</p>
      <button @click="retry">重试</button>
    </div>
    <Vue3Adapter 
      v-else
      :module-name="moduleName"
      :component-props="props"
      @error="handleError"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasError: false,
      errorMessage: '',
      retryCount: 0
    }
  },
  methods: {
    handleError(error) {
      this.hasError = true
      this.errorMessage = error.message
    },
    
    async retry() {
      if (this.retryCount < 3) {
        this.retryCount++
        this.hasError = false
        this.errorMessage = ''
      }
    }
  }
}
</script>
```

### 3. 类型安全

```typescript
// 定义组件 Props 类型
interface MyComponentProps {
  title: string
  count: number
  items: Array<{ id: number; name: string }>
}

// 在 Vue2 组件中使用
export default {
  data(): { props: MyComponentProps } {
    return {
      props: {
        title: 'Hello',
        count: 0,
        items: []
      }
    }
  }
}
```

## 故障排除

### 问题 1: 组件无法加载

**症状**: 控制台显示 "Component not found" 错误

**解决方案**:
1. 检查模块名称是否正确
2. 确认远程应用是否正常运行
3. 验证 EMP 配置中的 remotes 配置

### 问题 2: Vue3 运行时不可用

**症状**: 显示 "Vue3 runtime not available"

**解决方案**:
1. 检查 EMP 配置中是否包含 Vue3 运行时库
2. 确认全局变量 `EMP_ADAPTER_VUE` 是否正确设置
3. 验证网络连接和 CDN 可用性

### 问题 3: Props 更新不生效

**症状**: 修改 componentProps 后组件不更新

**解决方案**:
1. 确保 props 对象是响应式的
2. 检查 Vue3 组件是否正确接收 props
3. 使用 `$forceUpdate()` 强制更新

## 版本兼容性

| Vue3Adapter 版本 | Vue2 版本 | Vue3 版本 | EMP 版本 |
|------------------|-----------|-----------|----------|
| 1.0.x | 2.6+ | 3.0+ | 3.10+ |
| 1.1.x | 2.7+ | 3.2+ | 3.11+ |

## 更新日志

### v1.1.0
- ✨ 新增 TypeScript 类型定义
- 🐛 修复内存泄漏问题
- ⚡ 优化组件加载性能
- 🛡️ 增强错误处理机制

### v1.0.0
- 🎉 初始版本发布
- ✅ 基本的 Vue3 组件适配功能
- ✅ 插件系统支持

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个适配器！

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License