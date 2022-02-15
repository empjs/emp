declare module '@microHostB/App' {
import { Button } from '@microHostB/.D:/emp/projects/micro-host/microHost/Button';
import StoreComp from '@microHostB/StoreComp';
import incStore from '@microHostB/importExport/incStore';
export { Button, StoreComp, incStore };
 const App: () => JSX.Element;
export default App;
}
declare module '@microHostB/bootstrap' {
export {};
}
declare module '@microHostB' {
}
declare module '@microHostB/StoreComp' {
 const StoreComp: () => JSX.Element;
export default StoreComp;
}
declare module '@microHostB/Button' {
import * as React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    customLabel: string;
}
export  const Button: ({ customLabel, ...rest }: ButtonProps) => JSX.Element;
export {};
}
declare module '@microHostB/importExport/incStore' {
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
