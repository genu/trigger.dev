import { recordSpanException } from "@trigger.dev/core/v3/workers";
import { CliApiClient } from "../apiClient.js";
import { readAuthConfigProfile } from "./configFiles.js";
import { getTracer } from "../telemetry/tracing.js";
import { logger } from "./logger.js";
const tracer = getTracer();
export async function isLoggedIn(profile = "default") {
    return await tracer.startActiveSpan("isLoggedIn", async (span) => {
        try {
            const config = readAuthConfigProfile(profile);
            if (!config?.accessToken || !config?.apiUrl) {
                span.recordException(new Error("You must login first"));
                span.end();
                return { ok: false, error: "You must login first" };
            }
            const apiClient = new CliApiClient(config.apiUrl, config.accessToken);
            const userData = await apiClient.whoAmI();
            if (!userData.success) {
                recordSpanException(span, userData.error);
                span.end();
                return {
                    ok: false,
                    error: userData.error,
                    auth: {
                        apiUrl: config.apiUrl,
                        accessToken: config.accessToken,
                    },
                };
            }
            span.setAttributes({
                "login.userId": userData.data.userId,
                "login.email": userData.data.email,
                "login.dashboardUrl": userData.data.dashboardUrl,
                "login.profile": profile,
            });
            span.end();
            return {
                ok: true,
                profile,
                userId: userData.data.userId,
                email: userData.data.email,
                dashboardUrl: userData.data.dashboardUrl,
                auth: {
                    apiUrl: config.apiUrl,
                    accessToken: config.accessToken,
                },
            };
        }
        catch (e) {
            recordSpanException(span, e);
            span.end();
            return {
                ok: false,
                error: e instanceof Error ? e.message : "Unknown error",
            };
        }
    });
}
export async function getProjectClient(options) {
    logger.debug(`Initializing ${options.env} environment for project ${options.projectRef}`, options.apiUrl);
    const apiClient = new CliApiClient(options.apiUrl, options.accessToken);
    const projectEnv = await apiClient.getProjectEnv({
        projectRef: options.projectRef,
        env: options.env,
    });
    if (!projectEnv.success) {
        if (projectEnv.error === "Project not found") {
            logger.error(`Project not found: ${options.projectRef}. Ensure you are using the correct project ref and CLI profile (use --profile). Currently using the "${options.profile}" profile, which points to ${options.apiUrl}`);
        }
        else {
            logger.error(`Failed to initialize ${options.env} environment: ${projectEnv.error}. Using project ref ${options.projectRef}`);
        }
        return;
    }
    const client = new CliApiClient(projectEnv.data.apiUrl, projectEnv.data.apiKey);
    return {
        id: projectEnv.data.projectId,
        name: projectEnv.data.name,
        client,
    };
}
//# sourceMappingURL=session.js.map