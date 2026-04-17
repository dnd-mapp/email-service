const { resolve } = require('path');
const { readFileSync } = require('fs');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');

const isProduction = process.env['NODE_ENV'] === 'production';

/**
 * @param options {import('webpack').Configuration}
 * @returns {import('webpack').Configuration}
 */
function webpackConfig(options) {
    const manifestContents = readFileSync('package.json', { encoding: 'utf8' });
    const parsedManifest = JSON.parse(manifestContents);

    delete parsedManifest.dependencies;
    delete parsedManifest.devDependencies;
    delete parsedManifest.devEngines;
    delete parsedManifest.scripts;
    delete parsedManifest.packageManager;

    parsedManifest.dependencies = {
        // Will use the installed version as defined in the pnpm-lock file.
        '@fastify/static': '',
        '@dotenvx/dotenvx': '',
        'prisma': '7.7.0',
        'tsx': '',
    };

    return {
        devtool: isProduction ? false : 'inline-source-map',
        entry: resolve(__dirname, 'src/main.ts'),
        externals: [nodeExternals()],
        externalsPresets: {
            node: true,
        },
        mode: 'none',
        module: {
            ...options.module,
        },
        node: {
            __dirname: false,
            __filename: false,
        },
        optimization: {
            nodeEnv: false,
        },
        output: {
            clean: true,
            filename: 'main.js',
            path: resolve(__dirname, 'dist/email-service'),
        },
        plugins: [
            ...(isProduction
                ? [
                      new GeneratePackageJsonPlugin(parsedManifest, {
                          excludeDependencies: ['node:path', 'node:url', 'node:buffer'],
                      }),
                  ]
                : []),
        ],
        resolve: {
            extensions: ['.ts', '.js'],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: 'tsconfig.app.json',
                    extensions: ['.ts', '.js'],
                }),
            ],
        },
        target: 'node',
    };
}

module.exports = webpackConfig;
