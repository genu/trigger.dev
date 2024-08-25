import { BuildManifest, CreateBackgroundWorkerResponse, ServerBackgroundWorker, TaskRunExecution, TaskRunExecutionPayload, TaskRunExecutionResult, TaskRunFailedExecutionResult, WorkerManifest } from "@trigger.dev/core/v3";
import { Evt } from "evt";
import { TaskRunProcess } from "../executions/taskRunProcess.js";
export type CurrentWorkers = BackgroundWorkerCoordinator["currentWorkers"];
export declare class BackgroundWorkerCoordinator {
    #private;
    onTaskCompleted: Evt<{
        backgroundWorkerId: string;
        completion: TaskRunExecutionResult;
        worker: BackgroundWorker;
        execution: TaskRunExecution;
    }>;
    onTaskFailedToRun: Evt<{
        backgroundWorkerId: string;
        worker: BackgroundWorker;
        completion: TaskRunFailedExecutionResult;
    }>;
    onWorkerRegistered: Evt<{
        worker: BackgroundWorker;
        id: string;
        record: CreateBackgroundWorkerResponse;
    }>;
    /**
     * @deprecated use onWorkerTaskRunHeartbeat instead
     */
    onWorkerTaskHeartbeat: Evt<{
        id: string;
        backgroundWorkerId: string;
        worker: BackgroundWorker;
    }>;
    onWorkerTaskRunHeartbeat: Evt<{
        id: string;
        backgroundWorkerId: string;
        worker: BackgroundWorker;
    }>;
    onWorkerDeprecated: Evt<{
        worker: BackgroundWorker;
        id: string;
    }>;
    private _backgroundWorkers;
    constructor();
    get currentWorkers(): {
        id: string;
        worker: BackgroundWorker;
    }[];
    cancelRun(id: string, taskRunId: string): Promise<void>;
    registerWorker(worker: BackgroundWorker): Promise<void>;
    close(): void;
    executeTaskRun(id: string, payload: TaskRunExecutionPayload, messageId: string): Promise<{
        id: string;
        error: {
            message: string;
            type: "BUILT_IN_ERROR";
            name: string;
            stackTrace: string;
        } | {
            type: "CUSTOM_ERROR";
            raw: string;
        } | {
            type: "STRING_ERROR";
            raw: string;
        } | {
            code: "COULD_NOT_FIND_EXECUTOR" | "COULD_NOT_FIND_TASK" | "COULD_NOT_IMPORT_TASK" | "CONFIGURED_INCORRECTLY" | "TASK_ALREADY_RUNNING" | "TASK_EXECUTION_FAILED" | "TASK_EXECUTION_ABORTED" | "TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE" | "TASK_PROCESS_SIGKILL_TIMEOUT" | "TASK_RUN_CANCELLED" | "TASK_OUTPUT_ERROR" | "HANDLE_ERROR_ERROR" | "GRACEFUL_EXIT_TIMEOUT" | "TASK_RUN_CRASHED" | "TASK_RUN_HEARTBEAT_TIMEOUT";
            type: "INTERNAL_ERROR";
            message?: string | undefined;
            stackTrace?: string | undefined;
        };
        ok: false;
        retry?: {
            timestamp: number;
            delay: number;
            error?: unknown;
        } | undefined;
        skippedRetrying?: boolean | undefined;
        usage?: {
            durationMs: number;
        } | undefined;
    } | {
        id: string;
        ok: true;
        outputType: string;
        output?: string | undefined;
        usage?: {
            durationMs: number;
        } | undefined;
    } | undefined>;
}
export type BackgroundWorkerOptions = {
    env: Record<string, string>;
    cwd: string;
};
export declare class BackgroundWorker {
    #private;
    build: BuildManifest;
    params: BackgroundWorkerOptions;
    onTaskRunHeartbeat: Evt<string>;
    private _onClose;
    deprecated: boolean;
    manifest: WorkerManifest | undefined;
    serverWorker: ServerBackgroundWorker | undefined;
    _taskRunProcesses: Map<string, TaskRunProcess>;
    private _taskRunProcessesBeingKilled;
    private _closed;
    constructor(build: BuildManifest, params: BackgroundWorkerOptions);
    deprecate(): void;
    close(): void;
    get inProgressRuns(): Array<string>;
    get workerManifestPath(): string;
    get buildManifestPath(): string;
    initialize(): Promise<void>;
    taskRunCompletedNotification(completion: TaskRunExecutionResult): Promise<void>;
    cancelRun(taskRunId: string): Promise<void>;
    executeTaskRun(payload: TaskRunExecutionPayload, messageId: string): Promise<TaskRunExecutionResult>;
}
