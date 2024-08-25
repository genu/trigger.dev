import { Command } from "commander";
import { z } from "zod";
export declare const CommonCommandOptions: z.ZodObject<{
    apiUrl: z.ZodOptional<z.ZodString>;
    logLevel: z.ZodDefault<z.ZodEnum<["debug", "info", "log", "warn", "error", "none"]>>;
    skipTelemetry: z.ZodDefault<z.ZodBoolean>;
    profile: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    logLevel: "error" | "debug" | "info" | "warn" | "none" | "log";
    skipTelemetry: boolean;
    profile: string;
    apiUrl?: string | undefined;
}, {
    apiUrl?: string | undefined;
    logLevel?: "error" | "debug" | "info" | "warn" | "none" | "log" | undefined;
    skipTelemetry?: boolean | undefined;
    profile?: string | undefined;
}>;
export type CommonCommandOptions = z.infer<typeof CommonCommandOptions>;
export declare function commonOptions(command: Command): Command;
export declare class SkipLoggingError extends Error {
}
export declare class SkipCommandError extends Error {
}
export declare class OutroCommandError extends SkipCommandError {
}
export declare function handleTelemetry(action: () => Promise<void>): Promise<void>;
export declare const tracer: import("@opentelemetry/api").Tracer;
export declare function wrapCommandAction<T extends z.AnyZodObject, TResult>(name: string, schema: T, options: unknown, action: (opts: z.output<T>) => Promise<TResult>): Promise<TResult>;
export declare function installExitHandler(): void;
