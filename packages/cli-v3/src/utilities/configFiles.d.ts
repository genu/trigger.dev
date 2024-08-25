import { z } from "zod";
export declare const UserAuthConfigSchema: z.ZodObject<{
    accessToken: z.ZodOptional<z.ZodString>;
    apiUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    accessToken?: string | undefined;
    apiUrl?: string | undefined;
}, {
    accessToken?: string | undefined;
    apiUrl?: string | undefined;
}>;
export type UserAuthConfig = z.infer<typeof UserAuthConfigSchema>;
declare const UserAuthConfigFileSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    accessToken: z.ZodOptional<z.ZodString>;
    apiUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    accessToken?: string | undefined;
    apiUrl?: string | undefined;
}, {
    accessToken?: string | undefined;
    apiUrl?: string | undefined;
}>>;
type UserAuthConfigFile = z.infer<typeof UserAuthConfigFileSchema>;
export declare function writeAuthConfigProfile(config: UserAuthConfig, profile?: string): void;
export declare function readAuthConfigProfile(profile?: string): UserAuthConfig | undefined;
export declare function deleteAuthConfigProfile(profile?: string): void;
export declare function readAuthConfigFile(): UserAuthConfigFile | undefined;
export declare function writeAuthConfigFile(config: UserAuthConfigFile): void;
export {};
