import { Options as TerminalLinkOptions } from "terminal-link";
export declare const isInteractive: boolean;
export declare const green = "#4FFF54";
export declare const purple = "#735BF3";
export declare function chalkGreen(text: string): string;
export declare function chalkPurple(text: string): string;
export declare function chalkGrey(text: string): string;
export declare function chalkError(text: string): string;
export declare function chalkWarning(text: string): string;
export declare function chalkSuccess(text: string): string;
export declare function chalkLink(text: string): string;
export declare function chalkWorker(text: string): string;
export declare function chalkTask(text: string): string;
export declare function chalkRun(text: string): string;
export declare function logo(): string;
export declare function prettyPrintDate(date?: Date): string;
export declare function prettyError(header: string, body?: string, footer?: string): void;
export declare function prettyWarning(header: string, body?: string, footer?: string): void;
export declare function cliLink(text: string, url: string, options?: TerminalLinkOptions): string;
