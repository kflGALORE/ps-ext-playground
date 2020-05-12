const path = require('path');
const fs = require('fs');
const copy = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const handlebars = require('handlebars');
const psExtensionConfig = require('./ps-ext.config.js');
const polyfillsConfig = require('./src/host/polyfills');
const polyfillLibrary = require("polyfill-library");
const generate = require('generate-file-webpack-plugin');

const projectDir = path.resolve(__dirname, '.');

const common = {
    output: {
        path: path.resolve(projectDir, 'dist/'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            { // typescript
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /\bnode_modules\b/
            },
            { // handlebars
                test: /\.hbs$/,
                use: 'handlebars-loader'
            },
            { // styles
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            { // fonts
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    }
};
const client = {
    entry: {'client/app.bundle': path.resolve(projectDir, 'src/client/app.ts')},
    plugins: [
        new copy([
            {
                from: path.resolve(projectDir, 'src/client/index.html'),
                to: path.resolve(projectDir, 'dist/client/index.html')
            }
        ])
    ],
    devServer: {
        contentBase: path.resolve(projectDir, 'dist/client'),
        openPage: '?mode=development'
    }
};
const host = {
    entry: {'host/script.bundle': path.resolve(projectDir, 'src/host/script.ts')},
    output: {
        library: 'script'
    },
    plugins: [
        new copy([
            {
                from: path.resolve(projectDir, 'src/host/bootstrap.js'),
                to: path.resolve(projectDir, 'dist/host/bootstrap.js')
            }
        ]),
        generate({
            file: path.resolve(projectDir, 'dist/host/polyfills.js'),
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
const csxs = {
    plugins: [
        generate({
            file: path.resolve(projectDir, 'dist/CSXS/manifest.xml'),
            content: () => {
                return template(path.resolve(projectDir, 'src/CSXS/manifest.xml.hbs'))(psExtensionConfig);
            }
        }),
        generate({
            file: path.resolve(projectDir, 'dist/.debug'),
            content: () => {
                return template(path.resolve(projectDir, 'src/CSXS/.debug.hbs'))(psExtensionConfig);
            }
        })
    ]
};

const merged = merge(common, client, host, csxs);

module.exports = merged;

function template(file) {
    return handlebars.compile(fs.readFileSync(path.resolve(__dirname, file)).toString());
}
