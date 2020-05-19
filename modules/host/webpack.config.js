const path = require('path');
const fs = require('fs');
const polyfillLibrary = require("polyfill-library");
const generate = require('generate-file-webpack-plugin');

const polyfillsConfig = require('./polyfills');

const distDir = path.resolve(__dirname, '../../dist2');
const moduleDir = path.resolve(__dirname, '.');

const bootstrap = {
    entry: {'host/bootstrap': path.resolve(moduleDir, 'src/bootstrap.ts')},
    output: {
        path: distDir,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            { // typescript
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /\bnode_modules\b/
            }
        ]
    },
    plugins: [
        generate({
            file: path.resolve(distDir, 'host/polyfills.js'),
            content: () => {
                const opts = {
                    uaString: 'none',
                    unknown: 'polyfill',
                    minify: true,
                    features: {}
                };
                polyfillsConfig.include.forEach(include => {
                    opts.features[include] = { flags: ['gated'] };
                });

                return polyfillLibrary
                    .getPolyfillString(opts)
                    .then(otherPolyfills => {
                        const jsonPolyfill = fs.readFileSync(require.resolve('json2/json.js'));
                        return jsonPolyfill + '\n' + otherPolyfills;
                    });
            }
        })
    ]
};

const script = {
    entry: {'host/script.bundle': path.resolve(moduleDir, 'src/script.ts')},
    output: {
        path: distDir,
        filename: '[name].js',
        library: 'script'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            { // typescript
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /\bnode_modules\b/
            }
        ]
    },
};

module.exports = [bootstrap, script];