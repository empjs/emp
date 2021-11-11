import { Express } from 'express';
declare class Serve {
    app: Express;
    constructor();
    setup(): Promise<void>;
}
declare const _default: Serve;
export default _default;
