# Tailwind v4 配置参考

## 默认配置（推荐）

```typescript
// emp.config.ts
import pluginTailwindcss from '@empjs/plugin-tailwindcss'

plugins: [pluginReact(), pluginTailwindcss()]
```

```css
/* src/style.css */
@import "tailwindcss";
```

```ts
// src/index.tsx
import 'src/style.css'
import('./bootstrap')
```

## package.json

```json
{
  "devDependencies": {
    "@empjs/plugin-tailwindcss": "workspace:^",
    "tailwindcss": "^4.x"
  }
}
```

## 分层导入（可选）

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);
```

## 作用域样式（微前端隔离）

```css
@import "tailwindcss/theme.css" layer(theme);

.scope-container {
  @import "tailwindcss/preflight.css" layer(base);
  @import "tailwindcss/utilities.css" layer(utilities);
}
```

## 与 empRuntime 共存

Tailwind 与 `pluginRspackEmpShare` 可同时使用，顺序无严格要求。
