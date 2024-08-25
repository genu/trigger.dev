import { CORE_VERSION } from "@trigger.dev/core/v3";
import { DEFAULT_RUNTIME } from "@trigger.dev/core/v3/build";
import { bundleWorker, getBundleResultFromBuild, logBuildFailure, logBuildWarnings, } from "../build/bundle.js";
import { createBuildContext, notifyExtensionOnBuildComplete, notifyExtensionOnBuildStart, resolvePluginsForContext, } from "../build/extensions.js";
import { createExternalsBuildExtension } from "../build/externals.js";
import { copyManifestToDir } from "../build/manifests.js";
import { devIndexWorker, devRunWorker, telemetryEntryPoint } from "../build/packageModules.js";
import { eventBus } from "../utilities/eventBus.js";
import { logger } from "../utilities/logger.js";
import { resolveFileSources } from "../utilities/sourceFiles.js";
import { getTmpDir } from "../utilities/tempDirectories.js";
import { VERSION } from "../version.js";
import { startDevOutput } from "./devOutput.js";
import { startWorkerRuntime } from "./workerRuntime.js";
import { getInstrumentedPackageNames } from "../build/instrumentation.js";
export async function startDevSession({ rawConfig, name, rawArgs, client, dashboardUrl, }) {
    const destination = getTmpDir(rawConfig.workingDir, "build");
    const runtime = await startWorkerRuntime({
        name,
        config: rawConfig,
        args: rawArgs,
        client,
        dashboardUrl,
    });
    const stopOutput = startDevOutput({
        name,
        dashboardUrl,
        config: rawConfig,
        args: rawArgs,
    });
    logger.debug("Starting dev session", { destination: destination.path, rawConfig });
    const externalsExtension = createExternalsBuildExtension("dev", rawConfig);
    const buildContext = createBuildContext("dev", rawConfig);
    buildContext.prependExtension(externalsExtension);
    await notifyExtensionOnBuildStart(buildContext);
    const pluginsFromExtensions = resolvePluginsForContext(buildContext);
    async function updateBundle(bundle, workerDir) {
        let buildManifest = await createBuildManifestFromBundle(bundle, destination.path, rawConfig, workerDir?.path);
        buildManifest = await notifyExtensionOnBuildComplete(buildContext, buildManifest);
        try {
            logger.debug("Updated bundle", { bundle, buildManifest });
            await runtime.initializeWorker(buildManifest);
        }
        catch (error) {
            if (error instanceof Error) {
                eventBus.emit("backgroundWorkerIndexingError", buildManifest, error);
            }
            else {
                logger.error("Error updating bundle", { error });
            }
        }
    }
    async function updateBuild(build, workerDir) {
        const bundle = await getBundleResultFromBuild("dev", rawConfig.workingDir, build);
        if (bundle) {
            await updateBundle({ ...bundle, stop: undefined }, workerDir);
        }
    }
    let bundled = false;
    const onEnd = {
        name: "on-end",
        setup(b) {
            b.onStart(() => {
                logger.debug("on-end plugin started");
                if (bundled) {
                    eventBus.emit("rebuildStarted", "dev");
                }
            });
            b.onEnd(async (result) => {
                const errors = result.errors;
                const warnings = result.warnings;
                if (errors.length > 0) {
                    logBuildFailure(errors, warnings);
                    return;
                }
                if (warnings.length > 0) {
                    logBuildWarnings(warnings);
                }
                if (!bundled) {
                    // First bundle, no need to update bundle
                    bundled = true;
                }
                else {
                    const workerDir = getTmpDir(rawConfig.workingDir, "build");
                    await updateBuild(result, workerDir);
                }
            });
        },
    };
    async function runBundle() {
        eventBus.emit("buildStarted", "dev");
        const bundleResult = await bundleWorker({
            target: "dev",
            cwd: rawConfig.workingDir,
            destination: destination.path,
            watch: true,
            resolvedConfig: rawConfig,
            plugins: [...pluginsFromExtensions, onEnd],
            jsxFactory: rawConfig.build.jsx.factory,
            jsxFragment: rawConfig.build.jsx.fragment,
            jsxAutomatic: rawConfig.build.jsx.automatic,
        });
        await updateBundle(bundleResult);
        return bundleResult.stop;
    }
    const stopBundling = await runBundle();
    return {
        stop: () => {
            logger.debug("Stopping dev session");
            destination.remove();
            stopBundling?.().catch((error) => { });
            runtime.shutdown().catch((error) => { });
            stopOutput();
        },
    };
}
async function createBuildManifestFromBundle(bundle, destination, resolvedConfig, workerDir) {
    const buildManifest = {
        contentHash: bundle.contentHash,
        runtime: resolvedConfig.runtime ?? DEFAULT_RUNTIME,
        cliPackageVersion: VERSION,
        packageVersion: CORE_VERSION,
        environment: "dev",
        target: "dev",
        files: bundle.files,
        sources: await resolveFileSources(bundle.files, resolvedConfig.workingDir),
        externals: [],
        config: {
            project: resolvedConfig.project,
            dirs: resolvedConfig.dirs,
        },
        outputPath: destination,
        runWorkerEntryPoint: bundle.runWorkerEntryPoint ?? devRunWorker,
        indexWorkerEntryPoint: bundle.indexWorkerEntryPoint ?? devIndexWorker,
        loaderEntryPoint: bundle.loaderEntryPoint ?? telemetryEntryPoint,
        configPath: bundle.configPath,
        deploy: {
            env: {},
        },
        build: {},
        otelImportHook: {
            include: getInstrumentedPackageNames(resolvedConfig),
        },
    };
    if (!workerDir) {
        return buildManifest;
    }
    return copyManifestToDir(buildManifest, destination, workerDir);
}
//# sourceMappingURL=devSession.js.map