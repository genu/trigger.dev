import { TriggerConfig } from "@trigger.dev/core/v3";
import { ResolvedConfig } from "@trigger.dev/core/v3/build";
import * as esbuild from "esbuild";
export type ResolveConfigOptions = {
    cwd?: string;
    overrides?: Partial<TriggerConfig>;
    configFile?: string;
};
export declare function loadConfig({ cwd, }?: ResolveConfigOptions): Promise<ResolvedConfig>;
type ResolveWatchConfigOptions = ResolveConfigOptions & {
    onUpdate: (config: ResolvedConfig) => void;
    debounce?: number;
    ignoreInitial?: boolean;
};
type ResolveWatchConfigResult = {
    config: ResolvedConfig;
    files: string[];
    stop: () => Promise<void>;
};
export declare function watchConfig({ cwd, onUpdate, debounce, ignoreInitial, overrides, configFile, }: ResolveWatchConfigOptions): Promise<ResolveWatchConfigResult>;
export declare function configPlugin(resolvedConfig: ResolvedConfig): esbuild.Plugin | undefined;
export {};
