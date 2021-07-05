import './global';
export declare const __WindowTopCache: any;
export declare function empCreateClassStore<T>(Ctor: {
    new (...args: any[]): any;
}): T;
export declare function empCreateObjectStore<T>(obj: Record<any, any> & T): T & {
    __name: string;
};
