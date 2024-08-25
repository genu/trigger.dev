import * as esbuild from "esbuild";
import { configPlugin } from "../config.js";
import { logger } from "../utilities/logger.js";
import { bunPlugin } from "../runtimes/bun.js";
export async function buildPlugins(target, resolvedConfig) {
    logger.debug("Building plugins for target", target);
    const plugins = [];
    const $configPlugin = configPlugin(resolvedConfig);
    if ($configPlugin) {
        plugins.push($configPlugin);
    }
    plugins.push(polyshedPlugin());
    if (resolvedConfig.runtime === "bun") {
        plugins.push(bunPlugin());
    }
    return plugins;
}
export function analyzeMetadataPlugin() {
    return {
        name: "analyze-metafile",
        setup(build) {
            build.onEnd(async (result) => {
                if (!result.metafile) {
                    return;
                }
                console.log(await esbuild.analyzeMetafile(result.metafile, {
                    verbose: true,
                }));
            });
        },
    };
}
const polysheds = [
    {
        moduleName: "server-only",
        code: "export default true;",
    },
];
export function polyshedPlugin() {
    return {
        name: "polyshed",
        setup(build) {
            for (const polyshed of polysheds) {
                build.onResolve({ filter: new RegExp(`^${polyshed.moduleName}$`) }, (args) => {
                    if (args.path !== polyshed.moduleName) {
                        return undefined;
                    }
                    return {
                        path: args.path,
                        external: false,
                        namespace: `polyshed-${polyshed.moduleName}`,
                    };
                });
                build.onLoad({
                    filter: new RegExp(`^${polyshed.moduleName}$`),
                    namespace: `polyshed-${polyshed.moduleName}`,
                }, (args) => {
                    return {
                        contents: polyshed.code,
                        loader: "js",
                    };
                });
            }
        },
    };
}
//# sourceMappingURL=plugins.js.map