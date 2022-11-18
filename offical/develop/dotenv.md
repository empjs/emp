# dotenv
## 环境变量配置
+ 根目录创建 `.env.[env]` 即可 根据以上的 `--env` 定制自己的配置环境 如:
```
DOTENV='dev'
```
+ 使用配置 内容 `process.env.env` or esnext `import.meta.env.env` 如:
```js
console.log(process.env.env.DOTENV)
```
