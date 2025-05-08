### 使用yarn无法启动项目，缺失部分module

在Vue项目中，我们使用了 `@empjs/plugin-vue2` 和 `@empjs/plugin-vue3` 两个插件，在实际开发中，我们注意到了这个模块缺失导致的问题。
这是因为在这两个插件中，我们引用了 `vue-loader` 这个依赖，而这个依赖又依赖于 `webpack`， 由于yarn的包管理机制，我们无法在高版本的Node版本下安装 `webpack` 的低版本，所以导致了这一问题的发生。

目前对于这个问题的解决，我们提供了两种方案进行选择：

- <span style={{ 'color': 'green' }}>（✨推荐）</span> 使用 `pnpm` 包管理器解决这一问题。由于pnpm在这种情况下，会自动将webpack安装更为适合当前node版本的版本，而不是抛出警告然后不安装它，所以使用pnpm可以完美解决这一问题。

- 如果你想继续使用yarn，您可以手动安装 `webpack` 这一依赖，具体安装命令如下：
  ```bash
  yarn add webpack
  ```

如果您在npm中遇到类似的问题，您也可以尝试这两个方案进行解决。