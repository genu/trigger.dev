import { ExecutorToWorkerMessageCatalog, ServerBackgroundWorker, TaskRunExecutionPayload, TaskRunExecutionResult, WorkerManifest } from "@trigger.dev/core/v3";
import { Evt } from "evt";
import { InferSocketMessageSchema } from "@trigger.dev/core/v3/zodSocket";
export type OnWaitForDurationMessage = InferSocketMessageSchema<typeof ExecutorToWorkerMessageCatalog, "WAIT_FOR_DURATION">;
export type OnWaitForTaskMessage = InferSocketMessageSchema<typeof ExecutorToWorkerMessageCatalog, "WAIT_FOR_TASK">;
export type OnWaitForBatchMessage = InferSocketMessageSchema<typeof ExecutorToWorkerMessageCatalog, "WAIT_FOR_BATCH">;
export type TaskRunProcessOptions = {
    workerManifest: WorkerManifest;
    serverWorker: ServerBackgroundWorker;
    env: Record<string, string>;
    payload: TaskRunExecutionPayload;
    messageId: string;
    cwd?: string;
};
export declare class TaskRunProcess {
    #private;
    readonly options: TaskRunProcessOptions;
    private _ipc?;
    private _child;
    private _childPid?;
    private _attemptPromises;
    private _attemptStatuses;
    private _currentExecution;
    private _gracefulExitTimeoutElapsed;
    private _isBeingKilled;
    private _isBeingCancelled;
    private _stderr;
    private _flushingProcess?;
    onTaskRunHeartbeat: Evt<string>;
    onExit: Evt<{
        code: number | null;
        signal: NodeJS.Signals | null;
        pid?: number;
    }>;
    onIsBeingKilled: Evt<TaskRunProcess>;
    onReadyToDispose: Evt<TaskRunProcess>;
    onWaitForDuration: Evt<OnWaitForDurationMessage>;
    onWaitForTask: Evt<OnWaitForTaskMessage>;
    onWaitForBatch: Evt<OnWaitForBatchMessage>;
    constructor(options: TaskRunProcessOptions);
    cancel(): Promise<void>;
    cleanup(kill?: boolean): Promise<void>;
    get runId(): string;
    get isTest(): boolean;
    get payload(): {
        execution: {
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
        };
        traceContext: Record<string, unknown>;
        environment?: Record<string, string> | undefined;
    };
    initialize(): Promise<void>;
    startFlushingProcess(): Promise<void>;
    execute(): Promise<TaskRunExecutionResult>;
    taskRunCompletedNotification(completion: TaskRunExecutionResult): void;
    waitCompletedNotification(): void;
    kill(signal?: number | NodeJS.Signals, timeoutInMs?: number): Promise<void>;
    get isBeingKilled(): boolean | undefined;
    get pid(): number | undefined;
}
