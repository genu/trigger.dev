import { BuildRuntime } from "@trigger.dev/core/v3/schemas";
export type IndexWorkerManifestOptions = {
    runtime: BuildRuntime;
    indexWorkerPath: string;
    buildManifestPath: string;
    nodeOptions?: string;
    env: Record<string, string | undefined>;
    cwd?: string;
    otelHookInclude?: string[];
    otelHookExclude?: string[];
    handleStdout?: (data: string) => void;
    handleStderr?: (data: string) => void;
};
export declare function indexWorkerManifest({ runtime, indexWorkerPath, buildManifestPath, nodeOptions, env: $env, cwd, otelHookInclude, otelHookExclude, handleStderr, handleStdout, }: IndexWorkerManifestOptions): Promise<{
    tasks: {
        id: string;
        filePath: string;
        exportName: string;
        entryPoint: string;
        queue?: {
            name?: string | undefined;
            concurrencyLimit?: number | undefined;
            rateLimit?: {
                type: "fixed-window";
                limit: number;
                window: ({
                    seconds: number;
                } | {
                    minutes: number;
                } | {
                    hours: number;
                }) & ({
                    seconds: number;
                } | {
                    minutes: number;
                } | {
                    hours: number;
                } | undefined);
            } | {
                type: "sliding-window";
                limit: number;
                window: ({
                    seconds: number;
                } | {
                    minutes: number;
                } | {
                    hours: number;
                }) & ({
                    seconds: number;
                } | {
                    minutes: number;
                } | {
                    hours: number;
                } | undefined);
            } | undefined;
        } | undefined;
        retry?: {
            maxAttempts?: number | undefined;
            factor?: number | undefined;
            minTimeoutInMs?: number | undefined;
            maxTimeoutInMs?: number | undefined;
            randomize?: boolean | undefined;
        } | undefined;
        machine?: {
            cpu?: 2 | 1 | 4 | 0.25 | 0.5 | undefined;
            memory?: 2 | 1 | 4 | 0.25 | 0.5 | 8 | undefined;
            preset?: "micro" | "small-1x" | "small-2x" | "medium-1x" | "medium-2x" | "large-1x" | "large-2x" | undefined;
        } | undefined;
        triggerSource?: string | undefined;
        schedule?: {
            cron: string;
            timezone: string;
        } | undefined;
    }[];
    runtime: "node" | "bun";
    configPath: string;
    workerEntryPoint: string;
    controllerEntryPoint?: string | undefined;
    loaderEntryPoint?: string | undefined;
    otelImportHook?: {
        include?: string[] | undefined;
        exclude?: string[] | undefined;
    } | undefined;
}>;
