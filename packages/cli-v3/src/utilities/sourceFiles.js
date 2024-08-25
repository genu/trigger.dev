import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import * as zlib from "node:zlib";
export async function resolveFileSources(files, baseDir) {
    const sources = {};
    for (const file of files) {
        const fullPath = join(baseDir, file.entry);
        const content = await readFile(fullPath, "utf-8");
        const hasher = createHash("md5");
        hasher.update(content);
        sources[file.entry] = {
            contents: compressContent(content),
            contentHash: hasher.digest("hex"),
        };
    }
    return sources;
}
export function resolveTaskSourceFiles(sources, tasks) {
    const tasksGroupedByFile = {};
    for (const task of tasks) {
        if (!tasksGroupedByFile[task.filePath]) {
            tasksGroupedByFile[task.filePath] = [];
        }
        tasksGroupedByFile[task.filePath].push(task);
    }
    const taskFiles = [];
    for (const [filePath, tasks] of Object.entries(tasksGroupedByFile)) {
        const source = sources[filePath];
        if (!source) {
            continue;
        }
        const taskIds = tasks.map((task) => task.id);
        taskFiles.push({
            ...source,
            taskIds,
            filePath,
        });
    }
    return taskFiles;
}
function compressContent(data) {
    // Convert data to string if it's not already
    // Compress the data
    const compressedData = zlib.deflateSync(data);
    // Encode the compressed data to base64
    const base64Encoded = compressedData.toString("base64");
    return base64Encoded;
}
//# sourceMappingURL=sourceFiles.js.map