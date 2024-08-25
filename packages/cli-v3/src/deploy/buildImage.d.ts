import { BuildManifest, BuildRuntime } from "@trigger.dev/core/v3/schemas";
export interface BuildImageOptions {
    selfHosted: boolean;
    buildPlatform: string;
    noCache?: boolean;
    push: boolean;
    registry?: string;
    loadImage?: boolean;
    registryHost: string;
    authAccessToken: string;
    imageTag: string;
    deploymentId: string;
    deploymentVersion: string;
    contentHash: string;
    externalBuildId?: string;
    externalBuildToken?: string;
    externalBuildProjectId?: string;
    compilationPath: string;
    projectId: string;
    projectRef: string;
    extraCACerts?: string;
    apiUrl: string;
    apiKey: string;
    buildEnvVars?: Record<string, string | undefined>;
    deploymentSpinner?: any;
}
export declare function buildImage(options: BuildImageOptions): Promise<BuildImageResults>;
export interface DepotBuildImageOptions {
    registryHost: string;
    auth: string;
    imageTag: string;
    buildId: string;
    buildToken: string;
    buildProjectId: string;
    cwd: string;
    projectId: string;
    deploymentId: string;
    deploymentVersion: string;
    contentHash: string;
    projectRef: string;
    buildPlatform: string;
    apiUrl: string;
    apiKey: string;
    loadImage?: boolean;
    noCache?: boolean;
    extraCACerts?: string;
    buildEnvVars?: Record<string, string | undefined>;
}
type BuildImageSuccess = {
    ok: true;
    image: string;
    logs: string;
    digest?: string;
};
type BuildImageFailure = {
    ok: false;
    error: string;
    logs: string;
};
type BuildImageResults = BuildImageSuccess | BuildImageFailure;
export type GenerateContainerfileOptions = {
    runtime: BuildRuntime;
    build: BuildManifest["build"];
    image: BuildManifest["image"];
    indexScript: string;
    entrypoint: string;
};
export declare function generateContainerfile(options: GenerateContainerfileOptions): Promise<string>;
export {};
