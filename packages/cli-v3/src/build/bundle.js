import * as esbuild from "esbuild";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { createFile } from "../utilities/fileSystem.js";
import { logger } from "../utilities/logger.js";
import { deployEntryPoints, devEntryPoints, isConfigEntryPoint, isRunWorkerForTarget, isIndexWorkerForTarget, isLoaderEntryPoint, isRunControllerForTarget, shims, isIndexControllerForTarget, } from "./packageModules.js";
import { buildPlugins } from "./plugins.js";
export async function bundleWorker(options) {
    const { resolvedConfig } = options;
    // We need to add the package entry points here somehow
    // Then we need to get them out of the build result into the build manifest
    // taskhero/dist/esm/workers/dev.js
    // taskhero/dist/esm/telemetry/loader.js
    const entryPoints = await getEntryPoints(options.target, resolvedConfig);
    const $buildPlugins = await buildPlugins(options.target, resolvedConfig);
    let initialBuildResult;
    const initialBuildResultPromise = new Promise((resolve) => (initialBuildResult = resolve));
    const buildResultPlugin = {
        name: "Initial build result plugin",
        setup(build) {
            build.onEnd(initialBuildResult);
        },
    };
    const buildOptions = {
        entryPoints,
        outdir: options.destination,
        absWorkingDir: options.cwd,
        bundle: true,
        metafile: true,
        write: false,
        minify: false,
        splitting: true,
        charset: "utf8",
        platform: "node",
        sourcemap: true,
        sourcesContent: options.target === "dev",
        conditions: ["trigger.dev", "node"],
        format: "esm",
        target: ["node20", "es2022"],
        loader: {
            ".js": "jsx",
            ".mjs": "jsx",
            ".cjs": "jsx",
            ".wasm": "copy",
        },
        outExtension: { ".js": ".mjs" },
        inject: [...shims], // TODO: copy this into the working dir to work with Yarn PnP
        jsx: options.jsxAutomatic ? "automatic" : undefined,
        jsxDev: options.jsxAutomatic && options.target === "dev" ? true : undefined,
        plugins: [...$buildPlugins, ...(options.plugins ?? []), buildResultPlugin],
        ...(options.jsxFactory && { jsxFactory: options.jsxFactory }),
        ...(options.jsxFragment && { jsxFragment: options.jsxFragment }),
        logLevel: "silent",
        logOverride: {
            "empty-glob": "silent",
        },
    };
    let result;
    let stop;
    logger.debug("Building worker with options", buildOptions);
    if (options.watch) {
        const ctx = await esbuild.context(buildOptions);
        await ctx.watch();
        result = await initialBuildResultPromise;
        if (result.errors.length > 0) {
            throw new Error("Failed to build");
        }
        stop = async function () {
            await ctx.dispose();
        };
    }
    else {
        result = await esbuild.build(buildOptions);
        // Even when we're not watching, we still want some way of cleaning up the
        // temporary directory when we don't need it anymore
        stop = async function () { };
    }
    const bundleResult = await getBundleResultFromBuild(options.target, options.cwd, result);
    if (!bundleResult) {
        throw new Error("Failed to get bundle result");
    }
    return { ...bundleResult, stop };
}
export async function getBundleResultFromBuild(target, workingDir, result) {
    const hasher = createHash("md5");
    for (const outputFile of result.outputFiles) {
        hasher.update(outputFile.hash);
        await createFile(outputFile.path, outputFile.contents);
    }
    const files = [];
    let configPath;
    let loaderEntryPoint;
    let runWorkerEntryPoint;
    let runControllerEntryPoint;
    let indexWorkerEntryPoint;
    let indexControllerEntryPoint;
    for (const [outputPath, outputMeta] of Object.entries(result.metafile.outputs)) {
        if (outputPath.endsWith(".mjs")) {
            const $outputPath = resolve(workingDir, outputPath);
            if (!outputMeta.entryPoint) {
                continue;
            }
            if (isConfigEntryPoint(outputMeta.entryPoint)) {
                configPath = $outputPath;
            }
            else if (isLoaderEntryPoint(outputMeta.entryPoint)) {
                loaderEntryPoint = $outputPath;
            }
            else if (isRunControllerForTarget(outputMeta.entryPoint, target)) {
                runControllerEntryPoint = $outputPath;
            }
            else if (isRunWorkerForTarget(outputMeta.entryPoint, target)) {
                runWorkerEntryPoint = $outputPath;
            }
            else if (isIndexControllerForTarget(outputMeta.entryPoint, target)) {
                indexControllerEntryPoint = $outputPath;
            }
            else if (isIndexWorkerForTarget(outputMeta.entryPoint, target)) {
                indexWorkerEntryPoint = $outputPath;
            }
            else {
                if (!outputMeta.entryPoint.startsWith("..") &&
                    !outputMeta.entryPoint.includes("node_modules")) {
                    files.push({
                        entry: outputMeta.entryPoint,
                        out: $outputPath,
                    });
                }
            }
        }
    }
    if (!configPath) {
        return undefined;
    }
    return {
        files,
        configPath: configPath,
        loaderEntryPoint,
        runWorkerEntryPoint,
        runControllerEntryPoint,
        indexWorkerEntryPoint,
        indexControllerEntryPoint,
        contentHash: hasher.digest("hex"),
    };
}
async function getEntryPoints(target, config) {
    const projectEntryPoints = config.dirs.flatMap((dir) => dirToEntryPointGlob(dir));
    if (config.configFile) {
        projectEntryPoints.push(config.configFile);
    }
    if (target === "dev") {
        projectEntryPoints.push(...devEntryPoints);
    }
    else {
        projectEntryPoints.push(...deployEntryPoints);
    }
    return projectEntryPoints;
}
// Converts a directory to a glob that matches all the entry points in that
function dirToEntryPointGlob(dir) {
    return [
        join(dir, "**", "*.ts"),
        join(dir, "**", "*.tsx"),
        join(dir, "**", "*.mts"),
        join(dir, "**", "*.cts"),
        join(dir, "**", "*.js"),
        join(dir, "**", "*.jsx"),
        join(dir, "**", "*.mjs"),
        join(dir, "**", "*.cjs"),
    ];
}
export function logBuildWarnings(warnings) {
    const logs = esbuild.formatMessagesSync(warnings, { kind: "warning", color: true });
    for (const log of logs) {
        console.warn(log);
    }
}
/**
 * Logs all errors/warnings associated with an esbuild BuildFailure in the same
 * style esbuild would.
 */
export function logBuildFailure(errors, warnings) {
    const logs = esbuild.formatMessagesSync(errors, { kind: "error", color: true });
    for (const log of logs) {
        console.error(log);
    }
    logBuildWarnings(warnings);
}
//# sourceMappingURL=bundle.js.map