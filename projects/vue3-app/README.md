# Vue3-App 调用 Vue3-Host 项目组件的整体流程

## 概述

本文档详细说明了如何在 `vue3-app` 项目中调用 `vue3-host` 项目暴露的组件，实现微前端架构下的组件共享。

## 架构说明

### 项目角色
- **vue3-host**: 微前端宿主应用，负责暴露组件
- **vue3-app**: 微前端消费者应用，负责消费远程组件

### 技术栈
- Vue 3.6.0+
- Vue Router 4.5.1+
- Pinia 3.0.3+
- EMP (Enterprise Micro-frontend Platform)
- TypeScript

## 一、Vue3-Host 配置（组件提供方）

### 1.1 EMP 配置文件 (emp.config.ts)

```typescript
import {defineConfig} from '@empjs/cli'
import Vue3 from '@empjs/plugin-vue3'
import {pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  return {
    plugins: [
      Vue3(), // Vue3 插件，提供 Vue3 框架支持
      pluginRspackEmpShare({
        // 🔗 暴露的组件配置 - 定义哪些组件可以被其他微前端应用消费
        exposes: {
          './Info': './src/components/Info.vue',     // 信息展示组件
          './Count': './src/components/Count.vue',   // 计数器组件（包含 Pinia 状态管理）
          './Home': './src/components/Home.vue',     // 首页组件
        },
        
        // ⚙️ 微前端运行时配置 - 定义共享依赖和运行时环境
        empRuntime: {
          // 🚀 EMP 核心运行时配置
          runtime: {
            // EMP Share 运行时库，负责模块联邦的核心功能
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
            // 全局变量名，运行时库挂载到 window 对象的属性名
            global: `EMP_SHARE_RUNTIME`,
          },
          
          // 🎯 框架适配器配置 - 提供 Vue3 生态系统支持
          framework: {
            // Vue3 + Vue Router + Pinia 的 CDN 适配器库
            // 根据构建模式（development/production）自动选择对应版本
            libs: [`https://unpkg.com/@empjs/cdn-vue-router-pinia@3.5.0/dist/vueRouter.${store.mode}.umd.js`],
            // 框架适配器的全局变量名
            global: 'EMP_ADAPTER_VUE',
          },
          
          // 📦 外部依赖映射配置 - 将 npm 包映射到全局变量，实现依赖共享
          setExternals(o) {
            // 将 Vue3 核心库映射到适配器提供的全局变量
            o['vue'] = `EMP_ADAPTER_VUE.Vue`
            // 将 Vue Router 映射到适配器提供的路由库
            o['vue-router'] = `EMP_ADAPTER_VUE.VueRouter`
            // 将 Pinia 状态管理库映射到适配器提供的状态管理
            o['pinia'] = `EMP_ADAPTER_VUE.Pinia`
            return o
          },
        },
        
        // 🏷️ 微前端应用唯一标识名称，用于模块联邦识别
        name: 'vue3Host',
      }),
    ],
    
    // 🌐 开发服务器配置
    server: {
      port: 9901, // 宿主应用运行端口，消费者应用将通过此端口访问暴露的组件
    },
  }
})
```

### 1.2 暴露的组件

#### Info 组件 (src/components/Info.vue)
- 功能：展示信息组件
- Props：`name` (String, 默认值: 'info')
- 特点：包含子组件 Count

#### Count 组件 (src/components/Count.vue)
- 功能：计数器组件
- Props：`name` (String, 默认值: 'count')
- 状态管理：使用 Pinia 进行状态管理
- 特点：多个实例共享同一状态

#### Home 组件 (src/components/Home.vue)
- 功能：首页组件
- 特点：展示应用基本信息

## 二、Vue3-App 配置（组件消费方）

### 2.1 EMP 配置文件 (emp.config.ts)

```typescript
import {defineConfig} from '@empjs/cli'
import Vue3 from '@empjs/plugin-vue3'
import {pluginRspackEmpShare} from '@empjs/share'

export default defineConfig(store => {
  return {
    plugins: [
      Vue3(),
      pluginRspackEmpShare({
        // 远程应用配置
        remotes: {
          v3h: `vue3Host@http://${store.server.host}:9901/emp.json`,
        },
        // 微前端运行时配置（与宿主应用保持一致）
        empRuntime: {
          runtime: {
            lib: `https://unpkg.com/@empjs/share@3.10.1/output/sdk.js`,
            global: `EMP_SHARE_RUNTIME`,
          },
          framework: {
            libs: [`https://unpkg.com/@empjs/cdn-vue-router-pinia@3.5.0/dist/vueRouter.${store.mode}.umd.js`],
            global: 'EMP_ADAPTER_VUE',
          },
          setExternals(o) {
            o['vue'] = `EMP_ADAPTER_VUE.Vue`
            o['vue-router'] = `EMP_ADAPTER_VUE.VueRouter`
            o['pinia'] = `EMP_ADAPTER_VUE.Pinia`
            return o
          },
        },
        name: 'vue3App', // 消费者应用名称
      }),
    ],
    server: {port: 9902}, // 消费者应用端口
  }
})
```

### 2.2 关键配置说明

#### remotes 配置
- `v3h`: 远程应用别名
- `vue3Host`: 对应宿主应用的 name
- `http://${store.server.host}:9901/emp.json`: 宿主应用的清单文件地址

#### empRuntime 配置
- 必须与宿主应用保持一致
- 确保 Vue、Vue Router、Pinia 的版本兼容性

## 三、组件调用流程

### 3.1 导入远程组件

在 Vue3-App 的组件中导入远程组件：

```typescript
// 导入远程组件
import Info from 'v3h/Info'
import Count from 'v3h/Count'
import Home from 'v3h/Home'
```

### 3.2 使用远程组件

#### 基本使用
```vue
<template>
  <div>
    <!-- 直接使用远程组件 -->
    <Info />
    <Count />
    <Home />
  </div>
</template>
```

#### 传递 Props
```vue
<template>
  <div>
    <!-- 传递属性给远程组件 -->
    <Info :name="infoName" />
    <Count :name="countName" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const infoName = ref('自定义信息')
const countName = ref('自定义计数器')
</script>
```

#### 混合使用本地和远程组件
```vue
<template>
  <div>
    <!-- 本地组件 -->
    <LocalComponent />
    
    <!-- 远程组件 -->
    <Info name="混合使用示例" />
  </div>
</template>

<script setup lang="ts">
import Info from 'v3h/Info'
import LocalComponent from './LocalComponent.vue'
</script>
```

## 四、运行流程

### 4.1 启动顺序

1. **启动 vue3-host (宿主应用)**
   ```bash
   cd projects/vue3-host
   npm run dev
   # 应用运行在 http://localhost:9901
   ```

2. **启动 vue3-app (消费者应用)**
   ```bash
   cd projects/vue3-app
   npm run dev
   # 应用运行在 http://localhost:9902
   ```

### 4.2 加载流程

1. **初始化阶段**
   - vue3-app 启动时加载 EMP 运行时
   - 解析 remotes 配置，获取远程应用清单

2. **组件加载阶段**
   - 当页面需要渲染远程组件时
   - EMP 运行时从 vue3-host 动态加载组件代码
   - 组件在 vue3-app 的上下文中渲染

3. **状态共享阶段**
   - 远程组件使用的 Pinia 状态在消费者应用中独立运行
   - 多个远程组件实例可以共享同一状态

## 五、注意事项

### 5.1 版本兼容性
- 确保 Vue、Vue Router、Pinia 版本在宿主和消费者应用中兼容
- EMP 运行时版本需要保持一致

### 5.2 网络依赖
- 消费者应用依赖宿主应用的网络可用性
- 建议在生产环境中使用 CDN 或稳定的服务器

### 5.3 类型安全
- 可以通过 EMP 的 DTS 功能生成类型定义
- 在配置中启用 `dts.generateTypes` 和 `dts.consumeTypes`

### 5.4 错误处理
- 远程组件加载失败时的降级策略
- 网络异常时的用户体验优化

## 六、最佳实践

### 6.1 组件设计
- 远程组件应该尽量独立，减少外部依赖
- 通过 Props 和 Events 进行通信
- 避免直接操作 DOM 或全局状态

### 6.2 性能优化
- 使用懒加载减少初始包大小
- 合理设置组件缓存策略
- 监控远程组件的加载性能

### 6.3 开发调试
- 使用 EMP 提供的调试工具
- 在开发环境中启用详细日志
- 建立完善的错误监控机制

## 七、故障排除

### 7.1 常见问题

#### 组件加载失败
- 检查宿主应用是否正常运行
- 验证 remotes 配置中的 URL 是否正确
- 确认网络连接是否正常

#### 类型错误
- 检查 TypeScript 配置
- 确认组件导入路径是否正确
- 验证 Props 类型定义

#### 状态管理问题
- 确认 Pinia 配置是否正确
- 检查状态初始化逻辑
- 验证状态共享机制

### 7.2 调试技巧
- 使用浏览器开发者工具查看网络请求
- 检查控制台错误信息
- 利用 Vue DevTools 调试组件状态

## 八、总结

通过 EMP 微前端框架，vue3-app 可以无缝调用 vue3-host 中暴露的组件，实现了：

1. **组件复用**: 多个应用可以共享同一套组件
2. **独立开发**: 不同团队可以独立开发和部署
3. **技术栈统一**: 基于 Vue 3 生态的完整解决方案
4. **类型安全**: 支持 TypeScript 类型检查
5. **状态管理**: 支持 Pinia 状态共享

这种架构模式特别适合大型企业级应用的组件化和模块化开发。