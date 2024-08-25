import type { BackgroundWorkerSourceFileMetadata, TaskFile, TaskManifest } from "@trigger.dev/core/v3/schemas";
export declare function resolveFileSources(files: TaskFile[], baseDir: string): Promise<Record<string, {
    contents: string;
    contentHash: string;
}>>;
export declare function resolveTaskSourceFiles(sources: Record<string, {
    contents: string;
    contentHash: string;
}>, tasks: TaskManifest[]): Array<BackgroundWorkerSourceFileMetadata>;
