import { CreateAuthorizationCodeResponseSchema, GetPersonalAccessTokenResponseSchema, WhoAmIResponseSchema, CreateBackgroundWorkerResponse, StartDeploymentIndexingResponseBody, GetProjectEnvResponse, GetEnvironmentVariablesResponseBody, InitializeDeploymentResponseBody, GetDeploymentResponseBody, GetProjectsResponseBody, GetProjectResponseBody, EnvironmentVariableResponseBody, TaskRunExecution, FailDeploymentResponseBody, } from "@trigger.dev/core/v3";
import { zodfetch, ApiError } from "@trigger.dev/core/v3/zodfetch";
export class CliApiClient {
    apiURL;
    accessToken;
    constructor(apiURL, accessToken) {
        this.apiURL = apiURL;
        this.accessToken = accessToken;
        this.apiURL = apiURL.replace(/\/$/, "");
    }
    async createAuthorizationCode() {
        return wrapZodFetch(CreateAuthorizationCodeResponseSchema, `${this.apiURL}/api/v1/authorization-code`, {
            method: "POST",
        });
    }
    async getPersonalAccessToken(authorizationCode) {
        return wrapZodFetch(GetPersonalAccessTokenResponseSchema, `${this.apiURL}/api/v1/token`, {
            method: "POST",
            body: JSON.stringify({
                authorizationCode,
            }),
        });
    }
    async whoAmI() {
        if (!this.accessToken) {
            throw new Error("whoAmI: No access token");
        }
        return wrapZodFetch(WhoAmIResponseSchema, `${this.apiURL}/api/v2/whoami`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });
    }
    async getProject(projectRef) {
        if (!this.accessToken) {
            throw new Error("getProject: No access token");
        }
        return wrapZodFetch(GetProjectResponseBody, `${this.apiURL}/api/v1/projects/${projectRef}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });
    }
    async getProjects() {
        if (!this.accessToken) {
            throw new Error("getProjects: No access token");
        }
        return wrapZodFetch(GetProjectsResponseBody, `${this.apiURL}/api/v1/projects`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });
    }
    async createBackgroundWorker(projectRef, body) {
        if (!this.accessToken) {
            throw new Error("createBackgroundWorker: No access token");
        }
        return wrapZodFetch(CreateBackgroundWorkerResponse, `${this.apiURL}/api/v1/projects/${projectRef}/background-workers`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
    async createTaskRunAttempt(runFriendlyId) {
        if (!this.accessToken) {
            throw new Error("creatTaskRunAttempt: No access token");
        }
        return wrapZodFetch(TaskRunExecution, `${this.apiURL}/api/v1/runs/${runFriendlyId}/attempts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });
    }
    async getProjectEnv({ projectRef, env }) {
        if (!this.accessToken) {
            throw new Error("getProjectDevEnv: No access token");
        }
        return wrapZodFetch(GetProjectEnvResponse, `${this.apiURL}/api/v1/projects/${projectRef}/${env}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });
    }
    async getEnvironmentVariables(projectRef) {
        if (!this.accessToken) {
            throw new Error("getEnvironmentVariables: No access token");
        }
        return wrapZodFetch(GetEnvironmentVariablesResponseBody, `${this.apiURL}/api/v1/projects/${projectRef}/envvars`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });
    }
    async importEnvVars(projectRef, slug, params) {
        if (!this.accessToken) {
            throw new Error("importEnvVars: No access token");
        }
        return wrapZodFetch(EnvironmentVariableResponseBody, `${this.apiURL}/api/v1/projects/${projectRef}/envvars/${slug}/import`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });
    }
    async initializeDeployment(body) {
        if (!this.accessToken) {
            throw new Error("initializeDeployment: No access token");
        }
        return wrapZodFetch(InitializeDeploymentResponseBody, `${this.apiURL}/api/v1/deployments`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
    async createDeploymentBackgroundWorker(deploymentId, body) {
        if (!this.accessToken) {
            throw new Error("createDeploymentBackgroundWorker: No access token");
        }
        return wrapZodFetch(CreateBackgroundWorkerResponse, `${this.apiURL}/api/v1/deployments/${deploymentId}/background-workers`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
    async failDeployment(id, body) {
        if (!this.accessToken) {
            throw new Error("failDeployment: No access token");
        }
        return wrapZodFetch(FailDeploymentResponseBody, `${this.apiURL}/api/v1/deployments/${id}/fail`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
    async finalizeDeployment(id, body) {
        if (!this.accessToken) {
            throw new Error("finalizeDeployment: No access token");
        }
        return wrapZodFetch(FailDeploymentResponseBody, `${this.apiURL}/api/v1/deployments/${id}/finalize`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
    async startDeploymentIndexing(deploymentId, body) {
        if (!this.accessToken) {
            throw new Error("startDeploymentIndexing: No access token");
        }
        return wrapZodFetch(StartDeploymentIndexingResponseBody, `${this.apiURL}/api/v1/deployments/${deploymentId}/start-indexing`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
    async getDeployment(deploymentId) {
        if (!this.accessToken) {
            throw new Error("getDeployment: No access token");
        }
        return wrapZodFetch(GetDeploymentResponseBody, `${this.apiURL}/api/v1/deployments/${deploymentId}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Accept: "application/json",
            },
        });
    }
}
async function wrapZodFetch(schema, url, requestInit) {
    try {
        const response = await zodfetch(schema, url, requestInit, {
            retry: {
                minTimeoutInMs: 500,
                maxTimeoutInMs: 5000,
                maxAttempts: 5,
                factor: 2,
                randomize: false,
            },
        });
        return {
            success: true,
            data: response,
        };
    }
    catch (error) {
        if (error instanceof ApiError) {
            return {
                success: false,
                error: error.message,
            };
        }
        else if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
            };
        }
        else {
            return {
                success: false,
                error: String(error),
            };
        }
    }
}
//# sourceMappingURL=apiClient.js.map