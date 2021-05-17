# emp-plugin-git-version
根据分支名匹配规则 ，git checkout后根据匹配的规则，将自动修改package.json中的version为目标值。

实现如下效果
```
git checkout -b commit-1.0.n
package.json版本号将会变成 {version: "1.0.n"}
```

## 使用
yarn add @efox/emp-plugin-git-version -D
or npm install @efox/emp-plugin-git-version -D

```
emp gitversionlint [matchRegexpName,replaceName]
```
## 配置 package.json
```
"husky": {
    "hooks": {
      "post-checkout": "emp gitversionlint -n matchRegexpName ",
    }
},

// example: 
"post-checkout": "emp gitversionlint -n matchRegexpName ",
"post-checkout": "emp gitversionlint -n matchRegexpName -rn replaceName ",
```

## 参数说明
| 指令 | 说明 | 备注 |
| --- | --- | --- |
| gitversionlint | 执行指令 | --- | 
| -n, --regexpname | 正则匹配分支名，有特殊符号时需要增加引号处理 commit-,or 'commit-|master-' | 'commit-|master-'将会匹配到commit-1.0.0,master-1.0.0名称，留下1.0.0 | 
| -rn, --replacename | 替换matchRegexpName的内容, 有特殊符号时需要增加引号处理， 'build-' | 可空，默认删除matchRegexpName匹配到的内容 | 

## 示例
```
emp gitversionlint -n  commit-                  ：  会将分支名commit-x开头的替换为空，将x写入package.json中的version中。
emp gitversionlint -n  commit- -rn build-       ：  会将分支名commit-x开头的替换为build-x，将build-x写入package.json中的version中。
emp gitversionlint  -n 'commit-|master-'        ：  会将分支名commit-x或master-x开头的替换为x，将x写入package.json中的version中。
```
