declare const logger: {
    info: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
};
/**
 * begin logger
 * @param title
 * @returns
 */
export declare const logTitle: (title: string) => void;
/**
 * tag log
 * @param msg
 * @param tag
 */
declare type tagType = 'green' | 'blue' | 'yellow' | 'red';
export declare const logTag: (msg: string, tag?: tagType) => void;
export default logger;
