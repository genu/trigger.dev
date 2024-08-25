import * as esbuild from "esbuild";
import { BuildTarget } from "@trigger.dev/core/v3/schemas";
import { BuildExtension, ResolvedConfig } from "@trigger.dev/core/v3/build";
export type CollectedExternal = {
    name: string;
    path: string;
    version: string;
};
export type ExternalsCollector = {
    externals: Array<CollectedExternal>;
    plugin: esbuild.Plugin;
};
export declare function createExternalsBuildExtension(target: BuildTarget, config: ResolvedConfig): BuildExtension;
