export function buildManifestToJSON(manifest) {
    const { deploy, build, ...rest } = manifest;
    return {
        ...rest,
        deploy: {},
        build: {},
    };
}
//# sourceMappingURL=buildManifest.js.map