declare module '@mfHost/App' {
/// <reference types="react" />
import { Button } from '@mfHost/Button';
import StoreComp from '@mfHost/StoreComp';
export { Button, StoreComp };
 const App: () => JSX.Element;
export default App;
}
declare module '@mfHost/bootstrap' {
export {};
}
declare module '@mfHost' {
}
declare module '@mfHost/StoreComp' {
/// <reference types="react" />
 const StoreComp: () => JSX.Element;
export default StoreComp;
}
declare module '@mfHost/Button' {
import * as React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    customLabel: string;
}
export  const Button: ({ customLabel, ...rest }: ButtonProps) => JSX.Element;
export {};
}
declare module '@mfHost/incStore' {
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
