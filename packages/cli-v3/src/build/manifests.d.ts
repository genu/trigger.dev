import { BuildManifest } from "@trigger.dev/core/v3/schemas";
export declare function copyManifestToDir(manifest: BuildManifest, source: string, destination: string): Promise<BuildManifest>;
