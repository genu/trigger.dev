import { z } from "zod";
export type ESMRequireError = {
    type: "esm-require-error";
    moduleName: string;
};
export type BuildError = ESMRequireError | string;
export declare function parseBuildErrorStack(error: unknown): BuildError | undefined;
export declare function logESMRequireError(parsedError: ESMRequireError): void;
export type PackageNotFoundError = {
    type: "package-not-found-error";
    packageName: string;
};
export type NoMatchingVersionError = {
    type: "no-matching-version-error";
    packageName: string;
};
export type NpmInstallError = PackageNotFoundError | NoMatchingVersionError | string;
export declare function parseNpmInstallError(error: unknown): NpmInstallError;
export declare function logTaskMetadataParseError(zodIssues: z.ZodIssue[], tasks: any): void;
