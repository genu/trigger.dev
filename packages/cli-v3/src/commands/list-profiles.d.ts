import { Command } from "commander";
import { z } from "zod";
declare const ListProfilesOptions: z.ZodObject<{
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
type ListProfilesOptions = z.infer<typeof ListProfilesOptions>;
export declare function configureListProfilesCommand(program: Command): Command;
export declare function listProfilesCommand(options: unknown): Promise<void>;
export declare function listProfiles(options: ListProfilesOptions): Promise<void>;
export {};
