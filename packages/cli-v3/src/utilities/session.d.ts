import { CliApiClient } from "../apiClient.js";
export type LoginResultOk = {
    ok: true;
    profile: string;
    userId: string;
    email: string;
    dashboardUrl: string;
    auth: {
        apiUrl: string;
        accessToken: string;
    };
};
export type LoginResult = LoginResultOk | {
    ok: false;
    error: string;
    auth?: {
        apiUrl: string;
        accessToken: string;
    };
};
export declare function isLoggedIn(profile?: string): Promise<LoginResult>;
export type GetEnvOptions = {
    accessToken: string;
    apiUrl: string;
    projectRef: string;
    env: string;
    profile: string;
};
export declare function getProjectClient(options: GetEnvOptions): Promise<{
    id: string;
    name: string;
    client: CliApiClient;
} | undefined>;
