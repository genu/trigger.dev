import { Command } from "commander";
import { z } from "zod";
type WhoAmIResult = {
    success: true;
    data: {
        userId: string;
        email: string;
        dashboardUrl: string;
    };
} | {
    success: false;
    error: string;
};
declare const WhoamiCommandOptions: z.ZodObject<{
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
type WhoamiCommandOptions = z.infer<typeof WhoamiCommandOptions>;
export declare function configureWhoamiCommand(program: Command): Command;
export declare function whoAmICommand(options: unknown): Promise<WhoAmIResult>;
export declare function whoAmI(options?: WhoamiCommandOptions, embedded?: boolean): Promise<WhoAmIResult>;
export {};
