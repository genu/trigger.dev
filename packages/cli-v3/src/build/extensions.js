import { logger } from "../utilities/logger.js";
import { resolveModule } from "./resolveModule.js";
import { log, spinner } from "@clack/prompts";
export async function notifyExtensionOnBuildStart(context) {
    for (const extension of context.getExtensions()) {
        if (extension.onBuildStart) {
            await extension.onBuildStart(context);
        }
    }
}
export async function notifyExtensionOnBuildComplete(context, manifest) {
    let $manifest = manifest;
    for (const extension of context.getExtensions()) {
        if (extension.onBuildComplete) {
            await extension.onBuildComplete(context, $manifest);
            logger.debug(`Applying extension ${extension.name} to manifest`, {
                context,
                manifest,
            });
            $manifest = applyContextLayersToManifest(context, $manifest);
        }
    }
    return $manifest;
}
export function createBuildContext(target, config) {
    const layers = [];
    const registeredPlugins = [];
    const extensions = config.build.extensions ?? [];
    return {
        target,
        config: config,
        workingDir: config.workingDir,
        addLayer(layer) {
            layers.push(layer);
        },
        getLayers() {
            return layers;
        },
        clearLayers() {
            layers.splice(0);
        },
        registerPlugin(plugin, options) {
            if (options?.target && options.target !== target) {
                return;
            }
            registeredPlugins.push({ plugin, ...options });
        },
        getPlugins() {
            return registeredPlugins;
        },
        resolvePath: async (path) => {
            try {
                return await resolveModule(path, config.workingDir);
            }
            catch (error) {
                return undefined;
            }
        },
        getExtensions() {
            return extensions;
        },
        appendExtension(extension) {
            extensions.push(extension);
        },
        prependExtension(extension) {
            extensions.unshift(extension);
        },
        logger: {
            debug: (...args) => logger.debug(...args),
            log: (...args) => logger.log(...args),
            warn: (...args) => logger.warn(...args),
            progress: (message) => log.message(message),
            spinner: (message) => {
                const $spinner = spinner();
                $spinner.start(message);
                return $spinner;
            },
        },
    };
}
function applyContextLayersToManifest(context, manifest) {
    for (const layer of context.getLayers()) {
        manifest = applyLayerToManifest(layer, manifest);
    }
    context.clearLayers();
    return manifest;
}
function applyLayerToManifest(layer, manifest) {
    let $manifest = { ...manifest };
    if (layer.commands) {
        $manifest.build.commands ??= [];
        $manifest.build.commands = $manifest.build.commands.concat(layer.commands);
    }
    if (layer.build?.env) {
        $manifest.build.env ??= {};
        Object.assign($manifest.build.env, layer.build.env);
    }
    if (layer.deploy?.env) {
        $manifest.deploy.env ??= {};
        $manifest.deploy.sync ??= {};
        $manifest.deploy.sync.env ??= {};
        for (const [key, value] of Object.entries(layer.deploy.env)) {
            if (!value) {
                continue;
            }
            if (layer.deploy.override || $manifest.deploy.env[key] === undefined) {
                const existingValue = $manifest.deploy.env[key];
                if (existingValue !== value) {
                    $manifest.deploy.sync.env[key] = value;
                }
            }
        }
    }
    if (layer.dependencies) {
        const externals = $manifest.externals ?? [];
        for (const [name, version] of Object.entries(layer.dependencies)) {
            externals.push({ name, version });
        }
        $manifest.externals = externals;
    }
    if (layer.image) {
        $manifest.image ??= {};
        $manifest.image.instructions ??= [];
        $manifest.image.pkgs ??= [];
        if (layer.image.instructions) {
            $manifest.image.instructions = $manifest.image.instructions.concat(layer.image.instructions);
        }
        if (layer.image.pkgs) {
            $manifest.image.pkgs = $manifest.image.pkgs.concat(layer.image.pkgs);
            $manifest.image.pkgs = Array.from(new Set($manifest.image.pkgs));
        }
    }
    return $manifest;
}
export function resolvePluginsForContext(context) {
    const registeredPlugins = context.getPlugins();
    if (registeredPlugins.length === 0) {
        return [];
    }
    const sortedPlugins = [...registeredPlugins].sort((a, b) => {
        const order = { first: 0, undefined: 1, last: 2, $head: -1 };
        const aOrder = order[a.placement] ?? 1;
        const bOrder = order[b.placement] ?? 1;
        // If the placement order is different, sort based on that
        if (aOrder !== bOrder) {
            return aOrder - bOrder;
        }
        // If the placement order is the same, maintain original order
        return registeredPlugins.indexOf(a) - registeredPlugins.indexOf(b);
    });
    return sortedPlugins.map((plugin) => plugin.plugin);
}
//# sourceMappingURL=extensions.js.map