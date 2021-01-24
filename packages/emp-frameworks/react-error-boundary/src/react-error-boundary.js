module.exports = function (source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 对source进行一些操作 之后返回给下一个loader
  console.log('###boundary loader', source)
  return source
}
