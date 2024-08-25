import fsSync from "fs";
import fsModule, { writeFile } from "fs/promises";
import fs from "node:fs";
import { tmpdir } from "node:os";
import pathModule from "node:path";
// Creates a file at the given path, if the directory doesn't exist it will be created
export async function createFile(path, contents) {
    await fsModule.mkdir(pathModule.dirname(path), { recursive: true });
    await fsModule.writeFile(path, contents);
    return path;
}
export function isDirectory(configPath) {
    try {
        return fs.statSync(configPath).isDirectory();
    }
    catch (error) {
        // ignore error
        return false;
    }
}
export async function pathExists(path) {
    return fsSync.existsSync(path);
}
export async function someFileExists(directory, filenames) {
    for (let index = 0; index < filenames.length; index++) {
        const filename = filenames[index];
        if (!filename)
            continue;
        const path = pathModule.join(directory, filename);
        if (await pathExists(path)) {
            return true;
        }
    }
    return false;
}
export async function removeFile(path) {
    await fsModule.unlink(path);
}
export async function readFile(path) {
    return await fsModule.readFile(path, "utf8");
}
export async function readJSONFile(path) {
    const fileContents = await fsModule.readFile(path, "utf8");
    return JSON.parse(fileContents);
}
export async function safeFeadJSONFile(path) {
    try {
        const fileExists = await pathExists(path);
        if (!fileExists)
            return;
        const fileContents = await readFile(path);
        return JSON.parse(fileContents);
    }
    catch {
        return;
    }
}
export async function writeJSONFile(path, json, pretty = false) {
    await writeFile(path, JSON.stringify(json, undefined, pretty ? 2 : undefined), "utf8");
}
export function readJSONFileSync(path) {
    const fileContents = fsSync.readFileSync(path, "utf8");
    return JSON.parse(fileContents);
}
export function safeDeleteFileSync(path) {
    try {
        fs.unlinkSync(path);
    }
    catch (error) {
        // ignore error
    }
}
// Create a temporary directory within the OS's temp directory
export async function createTempDir() {
    // Generate a unique temp directory path
    const tempDirPath = pathModule.join(tmpdir(), "trigger-");
    // Create the temp directory synchronously and return the path
    const directory = await fsModule.mkdtemp(tempDirPath);
    return directory;
}
//# sourceMappingURL=fileSystem.js.map