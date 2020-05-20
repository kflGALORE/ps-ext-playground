const host = 'host';
const env = require('../../build');

const polyfillLibrary = require("polyfill-library");
const merge = require('webpack-merge');
const generate = require('generate-file-webpack-plugin');

const polyfillsConfig = require('./polyfills');

const webpack = {
    bootstrap: {
        entry: {'bootstrap': env.src(host, 'bootstrap.ts')},
        output: {
            path: env.dist(host)
        },
        plugins: [
            generate({
                file: env.dist(host, 'polyfills.js'),
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
                            const jsonPolyfill = env.file.read(require.resolve('json2/json.js'));
                            return jsonPolyfill + '\n' + otherPolyfills;
                        });
                }
            })
        ]
    },
    script: {
        entry: {'script.bundle': env.src(host, 'script.ts')},
        output: {
            path: env.dist(host),
            library: 'script'
        }
    }
};

module.exports = [merge(env.webpack.config.common, webpack.bootstrap), merge(env.webpack.config.common, webpack.script)];