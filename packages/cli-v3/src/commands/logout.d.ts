import { Command } from "commander";
import { z } from "zod";
declare const LogoutCommandOptions: z.ZodObject<{
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
type LogoutCommandOptions = z.infer<typeof LogoutCommandOptions>;
export declare function configureLogoutCommand(program: Command): Command;
export declare function logoutCommand(options: unknown): Promise<void>;
export declare function logout(options: LogoutCommandOptions): Promise<void>;
export {};
