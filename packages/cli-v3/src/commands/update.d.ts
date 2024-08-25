import { Command } from "commander";
import { PackageJson } from "pkg-types";
import { z } from "zod";
export declare const UpdateCommandOptions: z.ZodObject<Pick<{
    apiUrl: z.ZodOptional<z.ZodString>;
    logLevel: z.ZodDefault<z.ZodEnum<["debug", "info", "log", "warn", "error", "none"]>>;
    skipTelemetry: z.ZodDefault<z.ZodBoolean>;
    profile: z.ZodDefault<z.ZodString>;
}, "logLevel" | "skipTelemetry">, "strip", z.ZodTypeAny, {
    logLevel: "error" | "debug" | "info" | "warn" | "none" | "log";
    skipTelemetry: boolean;
}, {
    logLevel?: "error" | "debug" | "info" | "warn" | "none" | "log" | undefined;
    skipTelemetry?: boolean | undefined;
}>;
export type UpdateCommandOptions = z.infer<typeof UpdateCommandOptions>;
export declare function configureUpdateCommand(program: Command): Command;
export declare function updateCommand(dir: string, options: UpdateCommandOptions): Promise<void>;
export declare function updateTriggerPackages(dir: string, options: UpdateCommandOptions, embedded?: boolean, requireUpdate?: boolean): Promise<boolean>;
export declare function getPackageJson(absoluteProjectPath: string): Promise<{
    packageJson: PackageJson;
    readonlyPackageJson: PackageJson;
    packageJsonPath: string;
}>;
