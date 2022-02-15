declare module '@microHostCCC/App' {
import { Button } from '@microHostCCC/.D:/emp/projects/micro-host/microHost/Button';
import StoreComp from '@microHostCCC/StoreComp';
import incStore from '@microHostCCC/importExport/incStore';
export { Button, StoreComp, incStore };
 const App: () => JSX.Element;
export default App;
}
declare module '@microHostCCC/bootstrap' {
export {};
}
declare module '@microHostCCC' {
}
declare module '@microHostCCC/StoreComp' {
 const StoreComp: () => JSX.Element;
export default StoreComp;
}
declare module '@microHostCCC/Button' {
import * as React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    customLabel: string;
}
export  const Button: ({ customLabel, ...rest }: ButtonProps) => JSX.Element;
export {};
}
declare module '@microHostCCC/importExport/incStore' {
 class IncStore {
    num: number;
    code: any;
    constructor();
    inc(): void;
    loadData(): Promise<void>;
}
 const _default: IncStore;
export default _default;
}
