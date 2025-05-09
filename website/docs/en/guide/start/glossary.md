# 术语表

该索引列出了整个 `EMP` 生态系统中的常用术语。

## asset（静态资源）

静态资源是对 图像、字体、视频等静态文件的统称。这些文件通常会最终输出为单独的文件，而不是打包到代码块中，但是通过其也可以转换成 base64 内联到代码块中

## asset module（资源模块）

Asset 模块是一种特殊的模块类型，用来处理静态资源，例如图片、字体、视频等。

## bundle splitting

Bundle splitting 是一种允许你将代码拆分或合并到多个 bundle 的技术，这对于并行请求和更好的浏览器缓存很有用，它不用于减少初始化 bundle 的大小。

## chunk

Chunk 是一组绑定在一起的模块。`EMP` 会将相互关联的模块打包成一个 chunk，然后生成对应的文件。

## chunk graph（chunk 图）

chunk 图是一种表示块之间关系的数据结构。它是一个有向图，图中的每个节点代表一个块，每条边代表块之间的依赖关系。

## code splitting

Code splitting 是一种技术，它允许你将你的代码拆分成多个块，并且只在应用程序运行时加载必要的块。这可以帮助你减少初始包的大小，加快应用程序的加载时间。

## first class module type（一等公民模块类型）

`EMP` 中的一等公民模块指的是那些不需要依赖 loader 和 plugin 即可支持的模块类型，例如 JavaScript、CSS、JSON 等，而像 HTML、Markdown、YAML 等需要依赖 loader 和 plugin 才能支持的模块类型则不是一等公民模块。

## loader

Loader 是用来转换模块内容的。例如，我们可以使用 loader 将 TypeScript 模块转化为 JavaScript 模块，或者将 CSS 模块转化为 JavaScript 模块，将 CSS 注入到页面中。

## module（模块）

模块允许你将应用拆分为多个文件，并且在这些文件可以通过导入和导出进行模块内容的共享和复用，这可以帮助你将代码组织成独立的部分，并使用良好的接口在彼此间进行通信。

## module type（模块类型）

模块类型是模块的一种属性，它们可以通过不同的方式进行解析和处理。我们可以通过指明模块的模块类型来告诉 `EMP` 如何处理它们。例如，我们可以通过指定模块类型为 JavaScript 来告诉 `EMP` 该模块是一个 JavaScript 模块，然后 `EMP` 就会使用 JavaScript 解析器来解析该模块，如果指定的模块类型为 CSS，那么 `EMP` 就会使用 CSS 解析器来解析该模块。

## module resolution（模块解析）

模块解析是指 `EMP` 如何找到模块的过程。`EMP` 会根据模块的路径来解析模块，例如，当我们在代码中使用 `import 'foo'` 时，`EMP` 就会根据模块的路径来解析模块。

## module graph | dependency graph（模块图 | 依赖图）

模块图是一种表示模块之间关系的数据结构。它是一个有向图，图中的每个节点代表一个模块，每条边代表模块之间的依赖关系。

## NAPI-RS

[NAPI-RS](https://napi.rs/) 是一个在 Rust 中构建预编译的 Node.js 插件的框架。它通过提供 Node-API 的高级抽象，简化了创建和发布本地 Node.js 附加组件的过程。

## plugin（插件）

插件可以用来扩展 `EMP` 的功能。它可以用来定制构建过程，或与其他工具集成。`EMP` 提供了很多钩子，你可以用它们来定制构建过程。

## tree shaking

Tree shaking 是一种允许你从包中删除未使用代码的技术。它是一种特殊的死代码优化方式。像 `EMP` 这样的编译器将通过分析代码的静态语法，然后删除未使用的代码来完成此操作。
