import { ResolvedConfig } from "@trigger.dev/core/v3/build";
import { BuildTarget, TaskFile } from "@trigger.dev/core/v3/schemas";
import * as esbuild from "esbuild";
export interface BundleOptions {
    target: BuildTarget;
    destination: string;
    cwd: string;
    resolvedConfig: ResolvedConfig;
    jsxFactory?: string;
    jsxFragment?: string;
    jsxAutomatic?: boolean;
    watch?: boolean;
    plugins?: esbuild.Plugin[];
}
export type BundleResult = {
    contentHash: string;
    files: TaskFile[];
    configPath: string;
    loaderEntryPoint: string | undefined;
    runWorkerEntryPoint: string | undefined;
    runControllerEntryPoint: string | undefined;
    indexWorkerEntryPoint: string | undefined;
    indexControllerEntryPoint: string | undefined;
    stop: (() => Promise<void>) | undefined;
};
export declare function bundleWorker(options: BundleOptions): Promise<BundleResult>;
export declare function getBundleResultFromBuild(target: BuildTarget, workingDir: string, result: esbuild.BuildResult<{
    metafile: true;
    write: false;
}>): Promise<Omit<BundleResult, "stop"> | undefined>;
export declare function logBuildWarnings(warnings: esbuild.Message[]): void;
/**
 * Logs all errors/warnings associated with an esbuild BuildFailure in the same
 * style esbuild would.
 */
export declare function logBuildFailure(errors: esbuild.Message[], warnings: esbuild.Message[]): void;
