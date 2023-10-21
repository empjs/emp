# 指令
```json
"scripts": {
  "dev": "emp dev --env dev",
  "build": "emp build --env prod",
  "build:ts": "emp build --env prod -t",
  "start": "emp serve",
  "analyze": "emp build --analyze"
},
```

## emp init
创建 emp 模板项目
目前可选模板:
  1. vue2_base
  2. vue2_project
  3. react_base
  4. react_project

::: tip v2.1.1 可指定安装业务模板
+ `npx @efox/emp init -t http://localhost:8000/data.json` 指定url
+ `npx @efox/emp init -t ./data.json` 指定本地文件
+ `data.json` 数据结构解析
```json
{
	"模板名称":"git地址"
}
```
:::

## emp dev
+ -e, --env 部署环境 dev、test、prod 默认为 dev
+ -t, --ts 生成 dts文件 默认为 false
+ -ps, --progress  显示进度 默认为 true
+ -pr, --profile 统计模块消耗
+ -cl, --clearLog  清空日志 默认为 true
+ -wl, --wplogger  打印webpack配置 默认为 false,filename 为 输出webpack配置文件

## emp build
+ -e, --env 部署环境 dev、test、prod 默认为 dev
+ -t, --ts 生成 dts文件 默认为 false
+ -a, --analyze 生成分析报告 默认为 false
+ -h, --hot 是否使用热更新 默认启动
+ -o, --open 是否打开调试页面 默认不打开
+ -ps, --progress  显示进度 默认为 true
+ -pr, --profile 统计模块消耗
+ -cl, --clearLog  清空日志 默认为 true
+ -wl, --wplogger  打印webpack配置 默认为 false,filename 为 输出webpack配置文件

## emp serve
+ -cl, --clearLog  清空日志 默认为 true

## emp dts
> 根据 `config.empShare.remote` 自动同步所需类型
+ -p, --typingsPath 下载目录 默认为 `src/empShareType`
