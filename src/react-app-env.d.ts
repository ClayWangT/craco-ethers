/// <reference types="react-scripts" />
declare module '*.m.scss' {
    const classes: { readonly [classNames: string] : string };
    export = classes;
}

declare module '*.json' {
    const abis: Array<any>;
    export = abis;
}

interface LessVars {
    [key: string]: string;
}

declare var less: {
    modifyVars: (vars: LessVars) => Promise;
}

interface Window {
    ethereum: ExternalProvider & {
        enable: () => void
    };
}