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
    this.cacheable()
  }

  if (options && options.componentList && options.componentList.length > 0) {
    let replaceCode = null
    let replaceModuleName = null
    options.componentList.forEach(item => {
      const matchRule1 = source.match(/export default\s+(\w+)/)
      if (matchRule1 && matchRule1[1] && matchRule1[1] === item) {
        replaceCode = matchRule1[0]
        replaceModuleName = matchRule1[1]
      }
    })

    if (!replaceCode) {
      return this.callback(null, source, sourceMap)
    }
    console.log('#####replaceCode', replaceCode)

    const prependText = `
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
    const finalSource = source.replace(
      replaceCode,
      `${prependText} export default ErrorBoundaryWrap(${replaceModuleName})`,
    )
    console.log('###finalSource', finalSource)
    return this.callback(null, finalSource)
  }

  return this.callback(null, source, sourceMap)
}

// module.exports.pitch = function (remainingRequest) {
//   console.log('pitch阶段 remainingRequest', remainingRequest)
// }

module.exports = transform
