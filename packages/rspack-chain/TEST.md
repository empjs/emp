# Testing Guide for rspack-chain

本项目使用 [Bun](https://bun.sh/) 作为测试运行器，提供快速、现代的测试体验。

## 🚀 快速开始

### 安装依赖

```bash
# 安装项目依赖
bun install
```

### 运行测试

```bash
# 运行所有测试
bun test

# 运行测试并监听文件变化
bun test --watch

# 运行测试并生成覆盖率报告
bun test --coverage

# 运行特定测试文件
bun test Config.test.ts

# 运行匹配特定模式的测试
bun test --grep "Config"
```

## 📁 测试结构

```
__tests__/
├── Config.test.ts          # Config 类核心功能测试
├── ChainedMap.test.ts      # ChainedMap 链式映射测试
├── ChainedSet.test.ts      # ChainedSet 链式集合测试
├── Plugin.test.ts          # Plugin 插件配置测试
├── Rule.test.ts            # Rule 模块规则测试
├── Orderable.test.ts       # Orderable 排序混入测试
└── integration.test.ts     # 集成测试和复杂场景
```

## 🧪 测试覆盖范围

### 核心类测试

- **Config**: 主配置类的所有方法和链式调用
- **ChainedMap**: 链式映射的基本操作、合并、条件操作
- **ChainedSet**: 链式集合的添加、删除、排序操作
- **Plugin**: 插件配置、参数传递、排序
- **Rule**: 模块规则配置、加载器链、条件匹配
- **Orderable**: 排序混入的 before/after 功能

### 集成测试

- 完整的 webpack 配置生成
- 开发环境和生产环境配置
- 配置合并和继承
- 插件和规则排序
- 复杂链式调用场景
- 性能和内存测试

## 📊 覆盖率要求

项目设置了以下覆盖率阈值：

- **行覆盖率**: 80%
- **函数覆盖率**: 80%
- **分支覆盖率**: 70%
- **语句覆盖率**: 80%

覆盖率报告会生成在 `coverage/` 目录下，包含：
- 文本报告（终端输出）
- HTML 报告（可在浏览器中查看）
- LCOV 报告（用于 CI/CD 集成）

## 🔧 测试配置

测试配置位于 `bunfig.toml` 文件中，包含：

```toml
[test]
timeout = 5000
root = "."

[test.coverage]
enabled = true
reporter = ["text", "html", "lcov"]
dir = "coverage"
threshold = {
  line = 80,
  function = 80,
  branch = 70,
  statement = 80
}
```

## 🎯 测试最佳实践

### 1. 测试命名

```typescript
describe('ClassName', () => {
  describe('methodName', () => {
    it('should do something when condition', () => {
      // 测试实现
    })
  })
})
```

### 2. 测试结构

```typescript
// Arrange - 准备测试数据
const config = new Config()

// Act - 执行被测试的操作
config.mode('development')

// Assert - 验证结果
expect(config.get('mode')).toBe('development')
```

### 3. Mock 对象

```typescript
class MockPlugin {
  constructor(public options: any = {}) {}
}

// 在测试中使用
config.plugin('test').use(MockPlugin, [{ option: 'value' }])
```

### 4. 边界条件测试

- 测试空值、null、undefined
- 测试边界值和异常情况
- 测试错误处理和异常抛出

## 🚀 性能测试

集成测试包含性能基准测试：

```typescript
it('should handle large configurations efficiently', () => {
  const startTime = Date.now()
  
  // 创建大型配置
  for (let i = 0; i < 100; i++) {
    config.entry(`entry-${i}`).add(`src/entry-${i}.js`)
  }
  
  const webpackConfig = config.toConfig()
  const endTime = Date.now()
  
  expect(endTime - startTime).toBeLessThan(1000)
})
```

## 🔍 调试测试

### 使用 Bun 调试器

```bash
# 启用调试模式
bun --inspect test

# 在特定测试中添加断点
it('should debug this test', () => {
  debugger; // 断点
  // 测试代码
})
```

### 详细输出

```bash
# 显示详细测试输出
bun test --verbose

# 显示失败的测试详情
bun test --reporter=verbose
```

## 📈 持续集成

在 CI/CD 环境中运行测试：

```yaml
# GitHub Actions 示例
- name: Run tests
  run: |
    bun install
    bun test --coverage
    
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## 🤝 贡献指南

添加新功能时，请确保：

1. 为新功能编写对应的测试用例
2. 保持测试覆盖率在阈值之上
3. 遵循现有的测试命名和结构规范
4. 运行完整测试套件确保没有回归

```bash
# 提交前检查
bun test --coverage
bun run build
```

## 📚 相关资源

- [Bun Test Runner 文档](https://bun.sh/docs/cli/test)
- [Jest API 兼容性](https://bun.sh/docs/test/writing)
- [rspack-chain API 文档](../README.md)