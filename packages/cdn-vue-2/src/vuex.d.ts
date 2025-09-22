declare module 'vuex' {
  import Vue from 'vue';
  
  export interface StoreOptions<S> {
    state?: S | (() => S);
    getters?: Record<string, any>;
    actions?: Record<string, any>;
    mutations?: Record<string, any>;
    modules?: Record<string, any>;
    plugins?: any[];
    strict?: boolean;
  }

  export class Store<S> {
    constructor(options: StoreOptions<S>);
    readonly state: S;
    readonly getters: any;
    
    replaceState(state: S): void;
    dispatch(type: string, payload?: any): Promise<any>;
    commit(type: string, payload?: any, options?: any): void;
    subscribe(fn: (mutation: any, state: S) => void): () => void;
    subscribeAction(fn: (action: any, state: S) => void): () => void;
    watch<T>(getter: (state: S) => T, cb: (value: T, oldValue: T) => void, options?: any): () => void;
    registerModule<T>(path: string | string[], module: any, options?: any): void;
    unregisterModule(path: string | string[]): void;
    hotUpdate(options: any): void;
  }

  export function install(Vue: typeof Vue): void;
  export function createNamespacedHelpers(namespace: string): any;
  
  export function mapState(map: string[] | Record<string, any>): Record<string, any>;
  export function mapGetters(map: string[] | Record<string, any>): Record<string, any>;
  export function mapActions(map: string[] | Record<string, any>): Record<string, any>;
  export function mapMutations(map: string[] | Record<string, any>): Record<string, any>;
  
  export default {
    Store,
    install,
    mapState,
    mapGetters,
    mapActions,
    mapMutations,
    createNamespacedHelpers
  };
}