declare module '@vue3Base/bootstrap' {
export {};
}
declare module '@vue3Base/main' {
}
declare module '@vue3Base/JSXComponent' {
 const _default: any;
export default _default;
}
declare module '@vue3Base/App' {
 const _default: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, import("vue").EmitsOptions, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>;
export default _default;
}
declare module '@vue3Base/components/Count' {
 const _default: import("vue").DefineComponent<{}, {}, {
    count: number;
    dataSource: {
        key: string;
        name: string;
        age: number;
        address: string;
    }[];
    columns: {
        title: string;
        dataIndex: string;
        key: string;
    }[];
}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, import("vue").EmitsOptions, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>;
export default _default;
}
declare module '@vue3Base/ButtonComponent' {
 const _default: import("vue").DefineComponent<__VLS_TypePropsToRuntimeProps<{
    attr1: string;
    attr2: boolean;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    attr1: string;
    attr2: boolean;
}>>>, {}>;
export default _default;
 type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
 type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
}
declare module '@vue3Base/TableComponent' {
 const _default: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, import("vue").EmitsOptions, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>;
export default _default;
}
declare module '@vue3Base/TsxScript' {
 const _default: import("vue").DefineComponent<{
    attr1: StringConstructor;
    attr2: BooleanConstructor;
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    attr1: StringConstructor;
    attr2: BooleanConstructor;
}>>, {
    attr2: boolean;
}>;
export default _default;
}
