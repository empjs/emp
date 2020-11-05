# Dynamic System Host Example

This example demos a basic host application loading remote component.

- `dynamic_system_host` is the host application.
- `demo2` standalone application which exposes `./components/Hello` component.


- `dynamic_system_host`项目分别展示了常规`MF`组件，与`EMP`组件动态加载

# Running Demo

分别进入 `demo2` 、`dynamic_system_host` 项目目录，前台执行 `yarn dev`

- [localhost:3001](http://localhost:3001/) (HOST)
- [localhost:3002](http://localhost:3002/) (STANDALONE REMOTE) 不能直接访问，因为其指定的远程项目没有启动
