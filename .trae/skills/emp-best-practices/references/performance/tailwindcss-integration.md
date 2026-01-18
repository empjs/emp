# EMP CLI 与 TailwindCSS 集成技巧

## 🎯 基础配置技巧

### 1. 插件集成
```typescript
// emp.config.ts
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginTailwindcss(), // 零配置启用
    ],
  }
})
```

### 2. CSS 入口配置
```css
/* src/style.css */
@import "tailwindcss";

/* TailwindCSS v4 主题配置 */
@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
}

/* 组件层样式 */
@layer components {
  .btn-primary {
    @apply bg-primary text-white rounded-lg;
  }
}
```

## 🚀 性能优化技巧

### 3. 浏览器兼容性配置
```typescript
// emp.config.ts
build: {
  polyfill: {
    mode: 'entry',
    browserslist: ['iOS >= 9', 'Android >= 4.4', 'last 2 versions'],
  },
}
```

### 4. px 到 rem 转换
```typescript
// 自动转换 px 为 rem，适配移动端
pluginTailwindcss({
  pxToRemOptions: {
    rootValue: 100,
    unitPrecision: 3,
    propList: ['*'],
  },
})
```

## 🎨 实用开发技巧

### 5. 兼容性优先的类选择
```tsx
// 使用兼容性更好的类
<div className="space-x-4 space-y-2"> // 代替 gap-4 gap-2
  <div className="shadow-lg"> // 代替复杂阴影
```

### 6. 响应式设计模式
```tsx
// 移动优先的响应式设计
<div className="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
  <div className="block md:flex lg:grid">
```

### 7. CSS 变量与主题系统
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
}

@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
}
```

## 🔧 高级配置技巧

### 8. 自定义 PostCSS 插件
```typescript
pluginTailwindcss({
  customPostcssPlugins: [
    ['postcss-custom-media', {}],
    ['postcss-preset-env', { stage: 3 }],
  ],
})
```

### 9. 条件性 polyfill 加载
```typescript
// 根据 browserslist 自动启用 polyfill
build: {
  polyfill: {
    browserslist: store.browserslistOptions.h5, // 使用预设配置
  },
}
```

## 📱 移动端优化技巧

### 10. 移动端适配策略
```css
/* 1rem = 100px 的移动端适配 */
@theme {
  --font-size-base: 0.14rem; /* 14px */
  --spacing-unit: 0.1rem;   /* 10px */
}
```

### 11. Touch 友好的交互
```tsx
<button className="min-h-[44px] min-w-[44px] p-4">
  {/* 最小点击区域 44x44px */}
</button>
```

## 🛡️ 兼容性处理技巧

### 12. 特性检测与降级
```css
/* 现代浏览器 */
@supports (display: grid) {
  .layout { display: grid; }
}

/* 降级方案 */
@supports not (display: grid) {
  .layout { display: flex; }
}
```

### 13. CSS 变量回退
```css
.element {
  color: #333; /* 回退值 */
  color: hsl(var(--foreground)); /* 现代浏览器 */
}
```

## 🏗️ 插件架构详解

### PostCSS 处理链
基于 `@empjs/plugin-tailwindcss` 的实现，插件使用了复杂的 PostCSS 处理链：

1. **postcss-import** - 使用自定义别名解析 TailwindCSS 导入
2. **@tailwindcss/postcss** - TailwindCSS v4 处理器
3. **postcss-preset-env** - 浏览器兼容性的 CSS 功能 polyfills
4. **autoprefixer** - 供应商前缀
5. **postcss-pxtorem** - 可选的 px 到 rem 转换

### 导入解析策略
```typescript
// 自定义导入解析
if (id === 'tailwindcss') {
    return tailwindcssEntry
}
if (id.startsWith('tailwindcss/')) {
    return path.join(installDir, id.replace('tailwindcss/', ''))
}
```

### 浏览器兼容性处理
插件在配置 browserslist 时自动启用 `postcss-preset-env`：
```typescript
if (store.empConfig.build.polyfill.browserslist && store.empConfig.build.polyfill.browserslist.length > 0) {
    postcssPlugins.push([
        'postcss-preset-env',
        {
            browsers: store.empConfig.build.polyfill.browserslist,
            stage: 1, // 启用带有 polyfills 的新 CSS 功能
            features: presetEnvFeature,
        },
    ])
}
```

## 🎭 TailwindCSS v4 特性

### 支持的功能 (Chrome >= 50, Android >= 7)
- CSS 自定义属性 (Chrome 49+)
- Flexbox (Chrome 50+)
- CSS Grid (Chrome 57+ 带有注意事项)
- 基础间距和排版实用工具

### 有问题的功能
- `gap` 属性 (Chrome 84+)
- `@property` 规则 (Chrome 85+)
- `color-mix()` 函数 (Chrome 111+)
- 级联层 (Chrome 99+)
- 原生 CSS 嵌套 (Chrome 112+)

## 🔍 调试与故障排除

### 开发环境调试
```typescript
// 启用源映射
build: {
  sourcemap: store.mode === 'development',
}

// PostCSS 调试信息
debug: {
  loggerLevel: 'debug',
}
```

### 常见问题解决

#### 1. 样式未生效
- 检查 `@import "tailwindcss"` 是否正确引入
- 确认 PostCSS 插件配置正确
- 验证 CSS 构建输出

#### 2. 响应式类无效
- 确认断点配置正确
- 检查浏览器开发者工具中的媒体查询
- 验证 HTML viewport 设置

#### 3. 构建性能问题
- 启用持久缓存
- 优化 PostCSS 插件链
- 减少不必要的 CSS 变量

## 📈 性能监控

### CSS 分析
```typescript
// 启用构建分析
export default defineConfig(store => {
  return {
    debug: {
      rsdoctor: store.cliOptions.analyze,
    },
  }
})
```

### 包体积优化
```typescript
// CSS 优化配置
pluginTailwindcss({
  // 启用 CSS 压缩
  minify: store.mode === 'production',
  
  // 移除未使用的 CSS
  purge: {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    enabled: store.mode === 'production',
  },
})
```

这些技巧确保在 EMP 项目中高效使用 TailwindCSS，同时保持良好的兼容性和开发体验。
