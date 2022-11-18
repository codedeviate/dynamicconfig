export declare class DynamicConfig {
    constructor(blowOnFuse: boolean = true);
    has(key: string): boolean;
    hasEnv(key: string): boolean;
    hasConfig(key: string): boolean;
    get(key: string = undefined, defaultValue: any = null, throwOnDefault: boolean = false): any;
    getEnv(key: string, defaultValue: any = null): [any, boolean];
    getConfig(key: string, defaultValue: any = null): [any, boolean];
    addFuse(key: string): void;
    blowOnFuse(): boolean;
    set(key: string, value: any): void;
    setConfiguration(config: any): void;
    getSplit(): string;
    setSplit(split: string): void;
}
