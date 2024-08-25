import { Command } from "commander";
import { z } from "zod";
declare const DevCommandOptions: z.ZodObject<{
    logLevel: z.ZodDefault<z.ZodEnum<["debug", "info", "log", "warn", "error", "none"]>>;
    apiUrl: z.ZodOptional<z.ZodString>;
    skipTelemetry: z.ZodDefault<z.ZodBoolean>;
    profile: z.ZodDefault<z.ZodString>;
    debugOtel: z.ZodDefault<z.ZodBoolean>;
    config: z.ZodOptional<z.ZodString>;
    projectRef: z.ZodOptional<z.ZodString>;
    skipUpdateCheck: z.ZodDefault<z.ZodBoolean>;
    envFile: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    logLevel: "error" | "debug" | "info" | "warn" | "none" | "log";
    skipTelemetry: boolean;
    profile: string;
    debugOtel: boolean;
    skipUpdateCheck: boolean;
    apiUrl?: string | undefined;
    config?: string | undefined;
    projectRef?: string | undefined;
    envFile?: string | undefined;
}, {
    logLevel?: "error" | "debug" | "info" | "warn" | "none" | "log" | undefined;
    apiUrl?: string | undefined;
    skipTelemetry?: boolean | undefined;
    profile?: string | undefined;
    debugOtel?: boolean | undefined;
    config?: string | undefined;
    projectRef?: string | undefined;
    skipUpdateCheck?: boolean | undefined;
    envFile?: string | undefined;
}>;
export type DevCommandOptions = z.infer<typeof DevCommandOptions>;
export declare function configureDevCommand(program: Command): Command;
export declare function devCommand(options: DevCommandOptions): Promise<void>;
export {};
