import * as esbuild from "esbuild";
import { BuildTarget } from "@trigger.dev/core/v3/schemas";
import { ResolvedConfig } from "@trigger.dev/core/v3/build";
export declare function buildPlugins(target: BuildTarget, resolvedConfig: ResolvedConfig): Promise<esbuild.Plugin[]>;
export declare function analyzeMetadataPlugin(): esbuild.Plugin;
export declare function polyshedPlugin(): esbuild.Plugin;
