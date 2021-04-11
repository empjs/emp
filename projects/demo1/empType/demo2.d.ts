declare module '@emp/demo2/App' {
  const App: () => JSX.Element;
  export default App;

}
declare module '@emp/demo2/bootstrap' {
  export {};

}
declare module '@emp/demo2/components/Hello' {
  export interface HelloProps {
      compiler: string;
      framework: string;
  }
  const Hello: (props: HelloProps) => JSX.Element;
  export default Hello;

}
declare module '@emp/demo2/helper' {
  export const log: (d: any) => void;

}
declare module '@emp/demo2' {

}
declare module '@emp/demo2' {
  import main = require('@emp/demo2/index.ts');
  export = main;
}