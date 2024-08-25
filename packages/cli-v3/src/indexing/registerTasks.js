import { taskCatalog } from "@trigger.dev/core/v3";
export async function registerTasks(buildManifest) {
    const importErrors = [];
    for (const file of buildManifest.files) {
        const [error, module] = await tryImport(file.out);
        if (error) {
            if (typeof error === "string") {
                importErrors.push({
                    file: file.entry,
                    message: error,
                });
            }
            else {
                importErrors.push({
                    file: file.entry,
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                });
            }
            continue;
        }
        for (const exportName of getExportNames(module)) {
            const task = module[exportName] ?? module.default?.[exportName];
            if (!task) {
                continue;
            }
            if (task[Symbol.for("trigger.dev/task")]) {
                if (taskCatalog.taskExists(task.id)) {
                    taskCatalog.registerTaskFileMetadata(task.id, {
                        exportName,
                        filePath: file.entry,
                        entryPoint: file.out,
                    });
                }
            }
        }
    }
    return importErrors;
}
async function tryImport(path) {
    try {
        const module = await import(path);
        return [null, module];
    }
    catch (error) {
        return [error, null];
    }
}
function getExportNames(module) {
    const exports = [];
    const exportKeys = Object.keys(module);
    if (exportKeys.length === 0) {
        return exports;
    }
    if (exportKeys.length === 1 && exportKeys[0] === "default") {
        return Object.keys(module.default);
    }
    return exportKeys;
}
//# sourceMappingURL=registerTasks.js.map