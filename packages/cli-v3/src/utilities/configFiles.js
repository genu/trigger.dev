import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { xdgAppPaths } from "../imports/xdg-app-paths.js";
import { readJSONFileSync } from "./fileSystem.js";
import { logger } from "./logger.js";
function getGlobalConfigFolderPath() {
    const configDir = xdgAppPaths("trigger").config();
    return configDir;
}
//auth config file
export const UserAuthConfigSchema = z.object({
    accessToken: z.string().optional(),
    apiUrl: z.string().optional(),
});
const UserAuthConfigFileSchema = z.record(UserAuthConfigSchema);
function getAuthConfigFilePath() {
    return path.join(getGlobalConfigFolderPath(), "default.json");
}
export function writeAuthConfigProfile(config, profile = "default") {
    const existingConfig = readAuthConfigFile() || {};
    existingConfig[profile] = config;
    writeAuthConfigFile(existingConfig);
}
export function readAuthConfigProfile(profile = "default") {
    try {
        const authConfigFilePath = getAuthConfigFilePath();
        logger.debug(`Reading auth config file`, { authConfigFilePath });
        const json = readJSONFileSync(authConfigFilePath);
        const parsed = UserAuthConfigFileSchema.parse(json);
        return parsed[profile];
    }
    catch (error) {
        logger.debug(`Error reading auth config file: ${error}`);
        return undefined;
    }
}
export function deleteAuthConfigProfile(profile = "default") {
    const existingConfig = readAuthConfigFile() || {};
    delete existingConfig[profile];
    writeAuthConfigFile(existingConfig);
}
export function readAuthConfigFile() {
    try {
        const authConfigFilePath = getAuthConfigFilePath();
        logger.debug(`Reading auth config file`, { authConfigFilePath });
        const json = readJSONFileSync(authConfigFilePath);
        const parsed = UserAuthConfigFileSchema.parse(json);
        return parsed;
    }
    catch (error) {
        logger.debug(`Error reading auth config file: ${error}`);
        return undefined;
    }
}
export function writeAuthConfigFile(config) {
    const authConfigFilePath = getAuthConfigFilePath();
    mkdirSync(path.dirname(authConfigFilePath), {
        recursive: true,
    });
    writeFileSync(path.join(authConfigFilePath), JSON.stringify(config), {
        encoding: "utf-8",
    });
}
//# sourceMappingURL=configFiles.js.map