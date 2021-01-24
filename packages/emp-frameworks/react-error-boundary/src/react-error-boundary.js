const loaderUtils = require('loader-utils')
const {validate} = require('schema-utils')
const {SourceNode} = require('source-map')
const {SourceMapConsumer} = require('source-map')

function transform(source, sourceMap) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 对source进行一些操作 之后返回给下一个loader
  // return this.callback(null, source, sourceMap)
  let options = loaderUtils.getOptions(this) || {}
  let schema = {
    type: 'object',
    properties: {
      componentList: {
        type: 'array',
      },
    },
  }

  console.log('options', options)
  console.log('sourceMap', sourceMap)
  console.log('###boundary loader', source)
  validate(schema, options)
  if (this.cacheable) {
    console.log('### 使用了缓存')
    // this.cacheable()
  }

  if (options && options.componentList && options.componentList.length > 0) {
    let replaceCodeRule1 = []
    let replaceCodeRule2 = []
    let replaceCodeRule3 = []
    let prependText = `
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true };
      }

      componentDidCatch(error, errorInfo) {
      }

      render() {
        if (this.state.hasError) {
          return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
      }
    }

    const ErrorBoundaryWrap = (Child) => {
      return (props) => (
        <ErrorBoundary>
          <Child {...props} />
        </ErrorBoundary>
      );
    };
    `

    options.componentList.forEach(item => {
      // 处理 export default Hello1

      const matchRule1 = source.match(/export\s+default\s+(\w+)/)
      if (matchRule1 && matchRule1[1] && matchRule1[1] === item) {
        replaceCodeRule1.push({
          codeString: matchRule1[0],
          moduleName: item,
        })
      }
      // 处理 export default {Hello1, ...}
      const matchRule2 = source.match(/export\s+default\s*{([\w|,|\s]*)/)
      if (matchRule2 && matchRule2[1] && String(matchRule2[1]).split(',').includes(item)) {
        const tmpCodeString = matchRule2[1].replace(item, `${item}:ErrorBoundaryWrap(${item})`)
        replaceCodeRule2.push({
          codeString: matchRule2[0],
          exportDefaultCodeString: tmpCodeString,
        })
      }
      // 处理 export {Hello1, ...}
      const matchRule3 = source.match(/export\s*{([\w|,|\s]*)/)
      if (matchRule3 && matchRule3[1] && String(matchRule3[1]).split(',').includes(item)) {
        prependText += `
          const ${item}ErrorBoundary = ErrorBoundaryWrap(${item});
        `
        const tmpCodeString = matchRule3[1].replace(item, `${item}ErrorBoundary as ${item}`)
        replaceCodeRule3.push({
          codeString: matchRule3[0],
          exportDefaultCodeString: tmpCodeString,
        })
      }
    })

    if (replaceCodeRule1.length === 0 && replaceCodeRule2.length === 0 && replaceCodeRule3.length === 0) {
      console.log('没有匹配到任何规则')
      return this.callback(null, source, sourceMap)
    }

    let finalSource = source
    replaceCodeRule1.forEach(item => {
      finalSource = finalSource.replace(
        item.codeString,
        `${prependText} export default ErrorBoundaryWrap(${item.moduleName})`,
      )
    })

    replaceCodeRule2.forEach(item => {
      finalSource = finalSource.replace(
        item.codeString,
        `${prependText}  export default { ${item.exportDefaultCodeString}`,
      )
    })
    replaceCodeRule3.forEach(item => {
      finalSource = finalSource.replace(item.codeString, `${prependText}  export { ${item.exportDefaultCodeString}`)
    })
    console.log('###replaceCodeRule1', replaceCodeRule1)
    console.log('###replaceCodeRule2', replaceCodeRule2)
    console.log('###replaceCodeRule3', replaceCodeRule3)
    console.log('###finalSource', finalSource)
    return this.callback(null, finalSource)
  }

  return this.callback(null, source, sourceMap)
}

// module.exports.pitch = function (remainingRequest) {
//   console.log('pitch阶段 remainingRequest', remainingRequest)
// }

module.exports = transform
