import { Command } from "commander";
export declare function configureInitCommand(program: Command): Command;
export declare function initCommand(dir: string, options: unknown): Promise<void>;
