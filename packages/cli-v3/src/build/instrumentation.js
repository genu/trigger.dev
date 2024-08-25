import { builtinModules } from "node:module";
export function getInstrumentedPackageNames(config) {
    const packageNames = [];
    if (config.instrumentations) {
        for (const instrumentation of config.instrumentations) {
            const moduleDefinitions = instrumentation.getModuleDefinitions?.();
            if (!Array.isArray(moduleDefinitions)) {
                continue;
            }
            for (const moduleDefinition of moduleDefinitions) {
                if (!builtinModules.includes(moduleDefinition.name)) {
                    packageNames.push(moduleDefinition.name);
                }
            }
        }
    }
    return packageNames;
}
//# sourceMappingURL=instrumentation.js.map