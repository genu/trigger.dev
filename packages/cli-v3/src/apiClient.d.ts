import { CreateBackgroundWorkerRequestBody, InitializeDeploymentRequestBody, StartDeploymentIndexingRequestBody, ImportEnvironmentVariablesRequestBody, FailDeploymentRequestBody, FinalizeDeploymentRequestBody } from "@trigger.dev/core/v3";
export declare class CliApiClient {
    readonly apiURL: string;
    readonly accessToken?: string | undefined;
    constructor(apiURL: string, accessToken?: string | undefined);
    createAuthorizationCode(): Promise<ApiResult<{
        url: string;
        authorizationCode: string;
    }>>;
    getPersonalAccessToken(authorizationCode: string): Promise<ApiResult<{
        token: {
            token: string;
            obfuscatedToken: string;
        } | null;
    }>>;
    whoAmI(): Promise<ApiResult<{
        userId: string;
        email: string;
        dashboardUrl: string;
    }>>;
    getProject(projectRef: string): Promise<ApiResult<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        organization: {
            id: string;
            createdAt: Date;
            slug: string;
            title: string;
        };
        externalRef: string;
    }>>;
    getProjects(): Promise<ApiResult<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        organization: {
            id: string;
            createdAt: Date;
            slug: string;
            title: string;
        };
        externalRef: string;
    }[]>>;
    createBackgroundWorker(projectRef: string, body: CreateBackgroundWorkerRequestBody): Promise<ApiResult<{
        id: string;
        version: string;
        contentHash: string;
    }>>;
    createTaskRunAttempt(runFriendlyId: string): Promise<ApiResult<{
        task: {
            id: string;
            filePath: string;
            exportName: string;
        };
        attempt: {
            number: number;
            status: string;
            id: string;
            startedAt: Date;
            backgroundWorkerId: string;
            backgroundWorkerTaskId: string;
        };
        run: {
            id: string;
            startedAt: Date;
            payload: string;
            payloadType: string;
            tags: string[];
            isTest: boolean;
            createdAt: Date;
            durationMs: number;
            costInCents: number;
            baseCostInCents: number;
            context?: any;
            idempotencyKey?: string | undefined;
            maxAttempts?: number | undefined;
            version?: string | undefined;
        };
        queue: {
            id: string;
            name: string;
        };
        environment: {
            type: "PRODUCTION" | "STAGING" | "DEVELOPMENT" | "PREVIEW";
            id: string;
            slug: string;
        };
        organization: {
            id: string;
            name: string;
            slug: string;
        };
        project: {
            id: string;
            name: string;
            slug: string;
            ref: string;
        };
        batch?: {
            id: string;
        } | undefined;
        machine?: {
            name: "micro" | "small-1x" | "small-2x" | "medium-1x" | "medium-2x" | "large-1x" | "large-2x";
            cpu: number;
            memory: number;
            centsPerMs: number;
        } | undefined;
    }>>;
    getProjectEnv({ projectRef, env }: {
        projectRef: string;
        env: string;
    }): Promise<ApiResult<{
        name: string;
        apiKey: string;
        apiUrl: string;
        projectId: string;
    }>>;
    getEnvironmentVariables(projectRef: string): Promise<ApiResult<{
        variables: Record<string, string>;
    }>>;
    importEnvVars(projectRef: string, slug: string, params: ImportEnvironmentVariablesRequestBody): Promise<ApiResult<{
        success: boolean;
    }>>;
    initializeDeployment(body: InitializeDeploymentRequestBody): Promise<ApiResult<{
        id: string;
        version: string;
        contentHash: string;
        imageTag: string;
        shortCode: string;
        externalBuildData?: {
            projectId: string;
            buildId: string;
            buildToken: string;
        } | null | undefined;
        registryHost?: string | undefined;
    }>>;
    createDeploymentBackgroundWorker(deploymentId: string, body: CreateBackgroundWorkerRequestBody): Promise<ApiResult<{
        id: string;
        version: string;
        contentHash: string;
    }>>;
    failDeployment(id: string, body: FailDeploymentRequestBody): Promise<ApiResult<{
        id: string;
    }>>;
    finalizeDeployment(id: string, body: FinalizeDeploymentRequestBody): Promise<ApiResult<{
        id: string;
    }>>;
    startDeploymentIndexing(deploymentId: string, body: StartDeploymentIndexingRequestBody): Promise<ApiResult<{
        id: string;
        contentHash: string;
    }>>;
    getDeployment(deploymentId: string): Promise<ApiResult<{
        status: "PENDING" | "CANCELED" | "FAILED" | "BUILDING" | "DEPLOYING" | "DEPLOYED" | "TIMED_OUT";
        id: string;
        version: string;
        contentHash: string;
        shortCode: string;
        imageReference?: string | null | undefined;
        errorData?: {
            message: string;
            name: string;
            stack?: string | undefined;
            stderr?: string | undefined;
        } | null | undefined;
        worker?: {
            id: string;
            version: string;
            tasks: {
                id: string;
                filePath: string;
                exportName: string;
                slug: string;
            }[];
        } | undefined;
    }>>;
}
type ApiResult<TSuccessResult> = {
    success: true;
    data: TSuccessResult;
} | {
    success: false;
    error: string;
};
export {};
