/// <reference types="@efox/emp-tsconfig" />

declare module 'mobx5/Demo' {
  /// <reference types="react" />
  const Demo: () => JSX.Element
  export default Demo
}

declare module 'mobx5/Hello' {
  /// <reference types="react" />
  const Hello: () => JSX.Element
  export default Hello
}
