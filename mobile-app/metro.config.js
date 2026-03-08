const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('glb', 'gltf', 'png', 'jpg', 'obj', 'mtl');
config.resolver.sourceExts.push('js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs');

// Custom resolver to fix expo-three extensionless imports for three.js examples
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (
        moduleName &&
        moduleName.includes('three/examples/jsm/loaders/') &&
        !moduleName.endsWith('.js')
    ) {
        try {
            return context.resolveRequest(context, moduleName + '.js', platform);
        } catch (e) {
            // Fallback to default if .js append fails
        }
    }
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
