import pathModule from "node:path";
// Takes a relative path (like .) and resolves it to a full path (like /Users/username/Projects/my-triggers)
export const resolvePath = (input) => {
    return pathModule.resolve(process.cwd(), input);
};
// Takes an absolute path and derives the relative path from the current working directory
export const relativePath = (input) => {
    return pathModule.relative(process.cwd(), input);
};
//# sourceMappingURL=parseNameAndPath.js.map