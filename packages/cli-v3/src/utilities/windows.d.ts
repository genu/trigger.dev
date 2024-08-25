export declare const isWindows: boolean;
export declare function escapeImportPath(path: string): string;
export declare const spinner: () => {
    start: (msg?: string) => void;
    stop: (msg?: string, code?: number) => void;
    message: (msg?: string) => void;
};
