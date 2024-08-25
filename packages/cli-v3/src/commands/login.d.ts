import { Command } from "commander";
import { z } from "zod";
import { LoginResult } from "../utilities/session.js";
export declare const LoginCommandOptions: z.ZodObject<{
    logLevel: z.ZodDefault<z.ZodEnum<["debug", "info", "log", "warn", "error", "none"]>>;
    skipTelemetry: z.ZodDefault<z.ZodBoolean>;
    profile: z.ZodDefault<z.ZodString>;
    apiUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    logLevel: "error" | "debug" | "info" | "warn" | "none" | "log";
    apiUrl: string;
    skipTelemetry: boolean;
    profile: string;
}, {
    apiUrl: string;
    logLevel?: "error" | "debug" | "info" | "warn" | "none" | "log" | undefined;
    skipTelemetry?: boolean | undefined;
    profile?: string | undefined;
}>;
export type LoginCommandOptions = z.infer<typeof LoginCommandOptions>;
export declare function configureLoginCommand(program: Command): Command;
export declare function loginCommand(options: unknown): Promise<LoginResult>;
export type LoginOptions = {
    defaultApiUrl?: string;
    embedded?: boolean;
    profile?: string;
};
export declare function login(options?: LoginOptions): Promise<LoginResult>;
