declare module '@microHostaaa/App' {
import { Button } from '@microHostaaa/.D:/emp/projects/micro-host/microHost/Button';
import StoreComp from '@microHostaaa/StoreComp';
import incStore from '@microHostaaa/importExport/incStore';
export { Button, StoreComp, incStore };
 const App: () => JSX.Element;
export default App;
}
declare module '@microHostaaa/bootstrap' {
export {};
}
declare module '@microHostaaa' {
}
declare module '@microHostaaa/StoreComp' {
 const StoreComp: () => JSX.Element;
export default StoreComp;
}
declare module '@microHostaaa/Button' {
import * as React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    customLabel: string;
}
export  const Button: ({ customLabel, ...rest }: ButtonProps) => JSX.Element;
export {};
}
declare module '@microHostaaa/importExport/incStore' {
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
