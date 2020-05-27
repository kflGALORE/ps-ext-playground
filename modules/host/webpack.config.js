const host = 'host';
const ext = require('../../ps-ext');

const polyfillLibrary = require("polyfill-library");
const merge = require('webpack-merge');
const generate = require('generate-file-webpack-plugin');

const polyfillsConfig = require('./polyfills');

const webpack = {
    bootstrap: {
        entry: {'bootstrap': ext.src(host, 'bootstrap.ts')},
        output: {
            path: ext.dist(host)
        },
        plugins: [
            generate({
                file: ext.dist(host, 'polyfills.js'),
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
                            const jsonPolyfill = ext.file.read(require.resolve('json2/json.js'));
                            return jsonPolyfill + '\n' + otherPolyfills;
                        });
                }
            })
        ]
    },
    script: {
        entry: {'script.bundle': ext.src(host, 'script.ts')},
        output: {
            path: ext.dist(host),
            library: 'script'
        }
    }
};

module.exports = [merge(ext.webpack.config.common, webpack.bootstrap), merge(ext.webpack.config.common, webpack.script)];