import { clientWebsocketMessages, SemanticInternalAttributes, serverWebsocketMessages, } from "@trigger.dev/core/v3";
import { ZodMessageHandler, ZodMessageSender, } from "@trigger.dev/core/v3/zodMessageHandler";
import { WebSocket } from "partysocket";
import { WebSocket as wsWebSocket } from "ws";
import { getInstrumentedPackageNames } from "../build/instrumentation.js";
import { chalkError, chalkTask } from "../utilities/cliOutput.js";
import { resolveDotEnvVars } from "../utilities/dotEnv.js";
import { eventBus } from "../utilities/eventBus.js";
import { logger } from "../utilities/logger.js";
import { resolveTaskSourceFiles } from "../utilities/sourceFiles.js";
import { BackgroundWorker, BackgroundWorkerCoordinator } from "./backgroundWorker.js";
import { env } from "std-env";
export async function startWorkerRuntime(options) {
    const runtime = new DevWorkerRuntime(options);
    await runtime.init();
    return runtime;
}
class DevWorkerRuntime {
    options;
    websocket;
    backgroundWorkerCoordinator;
    sender;
    websocketMessageHandler;
    lastBuild;
    constructor(options) {
        this.options = options;
        const websocketUrl = new URL(this.options.client.apiURL);
        websocketUrl.protocol = websocketUrl.protocol.replace("http", "ws");
        websocketUrl.pathname = `/ws`;
        this.sender = new ZodMessageSender({
            schema: clientWebsocketMessages,
            sender: async (message) => {
                this.websocket.send(JSON.stringify(message));
            },
        });
        this.backgroundWorkerCoordinator = new BackgroundWorkerCoordinator();
        this.backgroundWorkerCoordinator.onWorkerTaskRunHeartbeat.attach(async ({ worker, backgroundWorkerId, id }) => {
            await this.sender.send("BACKGROUND_WORKER_MESSAGE", {
                backgroundWorkerId,
                data: {
                    type: "TASK_RUN_HEARTBEAT",
                    id,
                },
            });
        });
        this.backgroundWorkerCoordinator.onTaskCompleted.attach(async ({ backgroundWorkerId, completion, execution }) => {
            await this.sender.send("BACKGROUND_WORKER_MESSAGE", {
                backgroundWorkerId,
                data: {
                    type: "TASK_RUN_COMPLETED",
                    completion,
                    execution,
                },
            });
        });
        this.backgroundWorkerCoordinator.onTaskFailedToRun.attach(async ({ backgroundWorkerId, completion }) => {
            await this.sender.send("BACKGROUND_WORKER_MESSAGE", {
                backgroundWorkerId,
                data: {
                    type: "TASK_RUN_FAILED_TO_RUN",
                    completion,
                },
            });
        });
        this.backgroundWorkerCoordinator.onWorkerRegistered.attach(async ({ id, worker, record }) => {
            await this.sender.send("READY_FOR_TASKS", {
                backgroundWorkerId: id,
            });
        });
        this.websocketMessageHandler = new ZodMessageHandler({
            schema: serverWebsocketMessages,
            messages: {
                SERVER_READY: async (payload) => {
                    await this.#serverReady(payload);
                },
                BACKGROUND_WORKER_MESSAGE: async (payload) => {
                    await this.#backgroundWorkerMessage(payload);
                },
            },
        });
        this.websocket = new WebSocket(websocketUrl.href, [], {
            WebSocket: WebsocketFactory(this.options.client.accessToken),
            connectionTimeout: 10000,
            maxRetries: 64,
            minReconnectionDelay: 1000,
            maxReconnectionDelay: 5000,
            reconnectionDelayGrowFactor: 1.4,
            maxEnqueuedMessages: 1250,
        });
        this.websocket.addEventListener("open", async (event) => {
            logger.debug("WebSocket opened", { event });
        });
        this.websocket.addEventListener("close", (event) => {
            logger.debug("WebSocket closed", { event });
        });
        this.websocket.addEventListener("error", (event) => {
            logger.debug(`${chalkError("WebSocketError:")} ${event.error.message}`);
        });
        this.websocket.addEventListener("message", this.#handleWebsocketMessage.bind(this));
    }
    async init() {
        logger.debug("initialized worker runtime", { options: this.options });
    }
    async shutdown() {
        try {
            if (this.websocket.readyState === WebSocket.OPEN ||
                this.websocket.readyState === WebSocket.CONNECTING) {
                this.websocket.close();
            }
        }
        catch (error) {
            logger.debug("Error while shutting down worker runtime", { error });
        }
    }
    async initializeWorker(manifest, options) {
        if (this.lastBuild && this.lastBuild.contentHash === manifest.contentHash) {
            eventBus.emit("workerSkipped");
            return;
        }
        const env = await this.#getEnvVars();
        const backgroundWorker = new BackgroundWorker(manifest, {
            env,
            cwd: this.options.config.workingDir,
        });
        await backgroundWorker.initialize();
        if (!backgroundWorker.manifest) {
            throw new Error("Could not initialize worker");
        }
        const issues = validateWorkerManifest(backgroundWorker.manifest);
        if (issues.length > 0) {
            issues.forEach((issue) => logger.error(issue));
            return;
        }
        const sourceFiles = resolveTaskSourceFiles(manifest.sources, backgroundWorker.manifest.tasks);
        const backgroundWorkerBody = {
            localOnly: true,
            metadata: {
                packageVersion: manifest.packageVersion,
                cliPackageVersion: manifest.cliPackageVersion,
                tasks: backgroundWorker.manifest.tasks,
                contentHash: manifest.contentHash,
                sourceFiles,
            },
            supportsLazyAttempts: true,
        };
        const backgroundWorkerRecord = await this.options.client.createBackgroundWorker(this.options.config.project, backgroundWorkerBody);
        if (!backgroundWorkerRecord.success) {
            throw new Error(backgroundWorkerRecord.error);
        }
        backgroundWorker.serverWorker = backgroundWorkerRecord.data;
        this.backgroundWorkerCoordinator.registerWorker(backgroundWorker);
        this.lastBuild = manifest;
        eventBus.emit("backgroundWorkerInitialized", backgroundWorker);
    }
    async #getEnvVars() {
        const environmentVariablesResponse = await this.options.client.getEnvironmentVariables(this.options.config.project);
        const processEnv = gatherProcessEnv();
        const dotEnvVars = resolveDotEnvVars(undefined, this.options.args.envFile);
        const OTEL_IMPORT_HOOK_INCLUDES = getInstrumentedPackageNames(this.options.config).join(",");
        const stripEmptyValues = (obj) => {
            return Object.fromEntries(Object.entries(obj).filter(([, value]) => typeof value === "string" ? !!value.trim() : !!value));
        };
        return {
            ...stripEmptyValues(processEnv),
            ...stripEmptyValues(environmentVariablesResponse.success ? environmentVariablesResponse.data.variables : {}),
            ...stripEmptyValues(dotEnvVars),
            TRIGGER_API_URL: this.options.client.apiURL,
            TRIGGER_SECRET_KEY: this.options.client.accessToken,
            OTEL_EXPORTER_OTLP_COMPRESSION: "none",
            OTEL_RESOURCE_ATTRIBUTES: JSON.stringify({
                [SemanticInternalAttributes.PROJECT_DIR]: this.options.config.workingDir,
            }),
            OTEL_IMPORT_HOOK_INCLUDES,
        };
    }
    async #handleWebsocketMessage(event) {
        try {
            const data = JSON.parse(typeof event.data === "string" ? event.data : new TextDecoder("utf-8").decode(event.data));
            await this.websocketMessageHandler.handleMessage(data);
        }
        catch (error) {
            if (error instanceof Error) {
                logger.error("Error while handling websocket message", { error: error.message });
            }
            else {
                logger.error("Unkown error while handling websocket message, use `-l debug` for additional output");
                logger.debug("Error while handling websocket message", { error });
            }
        }
    }
    async #serverReady(payload) {
        for (const worker of this.backgroundWorkerCoordinator.currentWorkers) {
            await this.sender.send("READY_FOR_TASKS", {
                backgroundWorkerId: worker.id,
                inProgressRuns: worker.worker.inProgressRuns,
            });
        }
    }
    async #backgroundWorkerMessage(payload) {
        const message = payload.data;
        logger.debug(`Received message from worker ${payload.backgroundWorkerId}`, JSON.stringify({ workerMessage: message }));
        switch (message.type) {
            case "CANCEL_ATTEMPT": {
                // Need to cancel the attempt somehow here
                this.backgroundWorkerCoordinator.cancelRun(payload.backgroundWorkerId, message.taskRunId);
                break;
            }
            case "EXECUTE_RUN_LAZY_ATTEMPT": {
                await this.#executeTaskRunLazyAttempt(payload.backgroundWorkerId, message.payload);
            }
        }
    }
    async #executeTaskRunLazyAttempt(id, payload) {
        const attemptResponse = await this.options.client.createTaskRunAttempt(payload.runId);
        if (!attemptResponse.success) {
            throw new Error(`Failed to create task run attempt: ${attemptResponse.error}`);
        }
        const execution = attemptResponse.data;
        const completion = await this.backgroundWorkerCoordinator.executeTaskRun(id, { execution, traceContext: payload.traceContext, environment: payload.environment }, payload.messageId);
        return { execution, completion };
    }
}
function WebsocketFactory(apiKey) {
    return class extends wsWebSocket {
        constructor(address, options) {
            super(address, { ...(options ?? {}), headers: { Authorization: `Bearer ${apiKey}` } });
        }
    };
}
function gatherProcessEnv() {
    const $env = {
        ...env,
        NODE_ENV: "development",
    };
    // Filter out undefined values
    return Object.fromEntries(Object.entries($env).filter(([key, value]) => value !== undefined));
}
function validateWorkerManifest(manifest) {
    const issues = [];
    if (!manifest.tasks || manifest.tasks.length === 0) {
        issues.push("No tasks defined. Make sure you are exporting tasks.");
    }
    // Check for any duplicate task ids
    const taskIds = manifest.tasks.map((task) => task.id);
    const duplicateTaskIds = taskIds.filter((id, index) => taskIds.indexOf(id) !== index);
    if (duplicateTaskIds.length > 0) {
        issues.push(createDuplicateTaskIdOutputErrorMessage(duplicateTaskIds, manifest.tasks));
    }
    return issues;
}
function createDuplicateTaskIdOutputErrorMessage(duplicateTaskIds, tasks) {
    const duplicateTable = duplicateTaskIds
        .map((id) => {
        const $tasks = tasks.filter((task) => task.id === id);
        return `\n\n${chalkTask(id)} was found in:${tasks
            .map((task) => `\n${task.filePath} -> ${task.exportName}`)
            .join("")}`;
    })
        .join("");
    return `Duplicate ${chalkTask("task id")} detected:${duplicateTable}`;
}
//# sourceMappingURL=workerRuntime.js.map