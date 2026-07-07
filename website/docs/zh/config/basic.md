# 基础配置

| 配置 | 说明 |
| --- | --- |
| `appSrc` | 应用源码目录 |
| `entries` | 多入口配置 |
| `plugins` | EMP 插件列表 |
| `define` | 注入编译期常量 |
| `resolve` | 路径解析和别名 |
| `chain` | 低层 Rspack chain 扩展 |
| `html` | HTML 模板与注入 |
| `css` | CSS Modules、前缀和样式处理 |

基础配置建议保持明确和稳定。对底层 Rspack 做扩展时，应优先在局部场景验证，不要把实验性配置作为全局默认值。
