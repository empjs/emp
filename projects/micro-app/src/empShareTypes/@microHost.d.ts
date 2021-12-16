declare module '@microHost/App' {
/// <reference types="react" />
import { Button } from '@microHost/Button';
import StoreComp from '@microHost/StoreComp';
export { Button, StoreComp };
 const App: () => JSX.Element;
export default App;
}
declare module '@microHost/StoreComp' {
/// <reference types="react" />
 const StoreComp: () => JSX.Element;
export default StoreComp;
}
declare module '@microHost/bootstrap' {
export {};
}
declare module '@microHost' {
}
declare module '@microHost/Button' {
import * as React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    customLabel: string;
}
export  const Button: ({ customLabel, ...rest }: ButtonProps) => JSX.Element;
export {};
}
declare module '@microHost/store/incStore' {
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
