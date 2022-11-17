declare namespace EnvConfig {
    export class EnvConfig {
        constructor();
        has(key: string): boolean;
        hasEnv(key: string): boolean;
        hasConfig(key: string): boolean;
        get(key: string, defaultValue: any = null): any;
        getEnv(key: string, defaultValue: any = null): [any, boolean];
        getConfig(key: string, defaultValue: any = null): [any, boolean];
        set(key: string, value: any): void;
        setConfiguration(config: any): void;
        getSplit(): string;
        setSplit(split: string): void;
    }
}
