import { Command } from "commander";
import { CliApiClient } from "../apiClient.js";
export declare function configureDeployCommand(program: Command): Command;
export declare function deployCommand(dir: string, options: unknown): Promise<void>;
export declare function syncEnvVarsWithServer(apiClient: CliApiClient, projectRef: string, environmentSlug: string, envVars: Record<string, string>): Promise<boolean>;
