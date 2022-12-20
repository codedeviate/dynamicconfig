export as namespace DynamicConfig
export = new DynamicConfig

declare class DynamicConfig {
    constructor();
    has(key: string): boolean;
    hasEnv(key: string): boolean;
    hasConfig(key: string): boolean;
    get(key: string = undefined, defaultValue: any = null, throwOnDefault: boolean = false): any;
    getAsString(key: string = undefined, defaultValue: any = null, throwOnDefault: boolean = false): string;
    getAsInt(key: string = undefined, defaultValue: any = null, throwOnDefault: boolean = false): number;
    getAsFloat(key: string = undefined, defaultValue: any = null, throwOnDefault: boolean = false): number;
    getAsBoolean(key: string = undefined, defaultValue: any = null, throwOnDefault: boolean = false): boolean;
    getEnv(key: string, defaultValue: any = null): [any, boolean];
    getConfig(key: string, defaultValue: any = null): [any, boolean];
    envPopulate(key: string): void;
    addFuse(key: string): void;
    fuseAll(): void;
    listFuseable(callback: function): void;
    blowOnFuse(): boolean;
    setBlowOnFuse(): void;
    set(key: string, value: any): void;
    setConfiguration(config: any): boolean;
    mergeConfiguration(config: any): boolean;
    getSplit(): string;
    setSplit(split: string): void;
}
