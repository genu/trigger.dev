type Result = {
    success: true;
    alreadyExisted: boolean;
} | {
    success: false;
    error: string;
};
export declare function createFileFromTemplate(params: {
    templatePath: string;
    replacements: Record<string, string>;
    outputPath: string;
    override?: boolean;
}): Promise<Result>;
export declare function replaceAll(input: string, replacements: Record<string, string>): string;
export {};
