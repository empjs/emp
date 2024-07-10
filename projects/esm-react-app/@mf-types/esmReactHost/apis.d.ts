
    export type RemoteKeys = 'esmReactHost/App';
    type PackageType<T> = T extends 'esmReactHost/App' ? typeof import('esmReactHost/App') :any;