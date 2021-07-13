import './utils/global';
import { makeAutoObservable, observable, observe, onBecomeObserved, onBecomeUnobserved, toJS } from 'mobx';
declare function empCreateClassStore<T>(Ctor: {
    new (...args: any[]): any;
}): T;
declare function empCreateObjectStore<T>(obj: Record<any, any> & T, namespace?: string): T & {
    __name: string;
};
export { makeAutoObservable, empCreateClassStore, observe, onBecomeObserved, onBecomeUnobserved, observable, empCreateObjectStore, toJS, };
