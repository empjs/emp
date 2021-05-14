@efox/emp-plugin-ossupload

## 包介绍
把yynpm上的资源上传到oss

## 使用方式
### 安装
```
yarn add -D @efox/emp-plugin-ossupload
```
### 使用

安装后，可以通过`npm script` 使用
```
emp ossupload <包名> <包版本>
```
把发布在`yynpm``npm.yy.com`上的npm资源对应同步到`oss`上。

上传成功后会返回oss上资源的地址