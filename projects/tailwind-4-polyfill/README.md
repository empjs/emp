# Tailwind CSS v4 兼容性开发指南
> 兼容 Chrome >= 50 和 Android >= 7

## 浏览器兼容性分析
### 支持的 CSS 特性（Chrome >= 50 和 Android >= 7）
- **CSS 自定义属性（Custom Properties）**：Chrome 49+ 支持，Android >= 7 的 Chrome 和 Webkit 浏览器通常支持。
- **Flexbox**：Chrome 50+ 完全支持现代 Flexbox，Webkit 浏览器支持良好。
- **CSS Grid**：Chrome 57+ 支持（2017 年 3 月）。安卓 7 设备需更新 Chrome 至 57+，否则 Grid 可能不可用。
- **gap 属性**：Flexbox 的 `gap` 在 Chrome 84+ 支持，Android >= 7 的 Chrome（50-60）不支持，需用 `space-x-*` 和 `space-y-*` 替代。
- **@property 规则**：Chrome 85+ 支持，Android >= 7 不支持，可能导致 `shadow-*` 等工具类失效。
- **color-mix()**：Chrome 111+ 支持，Android >= 7 不支持，需使用静态颜色类。
- **Cascade Layers（@layer）**：Chrome 99+ 支持，Android >= 7 的 Chrome 50-60 不支持，Webkit 浏览器可能完全失效。
- **Native CSS Nesting**：Chrome 112+ 支持，Android >= 7 不支持，需 PostCSS 插件转换。

### 不支持的特性
- `@property`（如 `shadow-*` 和部分动态样式）。
- `color-mix()`（如动态颜色生成）。
- Flexbox 和 Grid 的 `gap` 属性。
- 原生 CSS 嵌套（需转换）。
- 部分伪类（如 `:has()`、`:where()`）和 `backdrop-filter`。


## 推荐的 Tailwind CSS v4 工具类
为确保兼容性，优先使用以下广泛支持的工具类，避免依赖现代 CSS 特性的类：

### 布局
- **Flexbox**：使用 `flex`、`flex-row`、`flex-col`、`justify-*`、`items-*`（Chrome 50+ 支持）。
- **Spacing**：使用 `space-x-*` 和 `space-y-*`（基于 margin）替代 `gap-*`。
  ```html
  <!-- 推荐 -->
  <div class="flex space-x-4">
    <div class="w-1/2">Item 1</div>
    <div class="w-1/2">Item 2</div>
  </div>
  <!-- 避免 -->
  <div class="flex gap-4">
    <div class="w-1/2">Item 1</div>
    <div class="w-1/2">Item 2</div>
  </div>
  ```
- **Grid**：谨慎使用 `grid` 和 `grid-cols-*`，确保 Chrome 版本 >= 57。提供回退：
  ```html
  <div class="grid grid-cols-2 md:grid-cols-1">
    <div>Item 1</div>
    <div>Item 2</div>
  </div>
  ```

### 颜色和背景
- 使用静态颜色类（如 `bg-blue-500`、`text-red-600`）替代动态颜色（如 `bg-[color-mix(...)]`）。
- 自定义主题颜色时，使用 RGB 或 HEX 值：
  ```css
  @theme {
    --color-primary: #3b82f6;
  }
  ```
  ```html
  <div class="bg-primary text-white">Primary Button</div>
  ```

### 阴影和效果
- 避免 `shadow-*`（依赖 `@property`），使用 `shadow-sm` 或自定义静态阴影：
  ```html
  <div class="shadow-sm compat-shadow">Card</div>
  ```

### 间距和排版
- 使用 `m-*`、`p-*`、`mt-*` 等基于 margin 和 padding 的类，兼容性极高。
- 字体相关：使用 `text-*`、`font-*`，避免依赖 `:has()` 或 `:where()` 的变体。

## 避免使用的工具类
以下工具类可能在 Chrome >= 50 和 Android >= 7 上失效，需替换：
- **gap-***：替换为 `space-x-*` 和 `space-y-*`。
- **shadow-*（复杂阴影）**：替换为 `shadow-sm` 或自定义静态阴影。
- **bg-[color-mix(...)]**：替换为静态颜色类（如 `bg-blue-500`）。
- **backdrop-filter-***：Android >= 7 不支持，无直接替代，需避免。
- **transition-*（涉及 @starting-style）**：使用简单的 `transition` 类（如 `transition-opacity`）。

## 测试和调试
### 测试工具
- **BrowserStack**：在真实安卓 7 设备上测试 Chrome 50-60 和 AOSP 浏览器。
- **Local Device**：使用安卓 7 设备，更新 Chrome 至最新可用版本（通常 <= 80）。
- **DevTools**：在 Chrome DevTools 中模拟低版本浏览器（选择“Custom”并设置为 Chrome 50）。

### 常见问题及解决
- **问题**：`space-y-*` 在 Webkit 浏览器上失效。
  - **原因**：依赖 CSS 变量，部分 Webkit 浏览器解析错误。
  - **解决**：替换为 `my-*`（如 `my-4` 替代 `space-y-4`）。
- **问题**：颜色或阴影不渲染。
  - **原因**：依赖 `@property` 或 `color-mix()`。
  - **解决**：使用 v4.1 的回退机制，或定义静态值。
- **问题**：Grid 布局失效。
  - **原因**：Chrome < 57 不支持 Grid。
  - **解决**：提供 Flexbox 回退，或要求用户更新 Chrome。
