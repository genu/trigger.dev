import { ResolvedConfig } from "@trigger.dev/core/v3/build";
import { CliApiClient } from "../apiClient.js";
import { type DevCommandOptions } from "../commands/dev.js";
export type DevSessionOptions = {
    name: string | undefined;
    dashboardUrl: string;
    initialMode: "local";
    showInteractiveDevSession: boolean | undefined;
    rawConfig: ResolvedConfig;
    rawArgs: DevCommandOptions;
    client: CliApiClient;
    onErr?: (error: Error) => void;
};
export declare function startDevSession({ rawConfig, name, rawArgs, client, dashboardUrl, }: DevSessionOptions): Promise<{
    stop: () => void;
}>;
