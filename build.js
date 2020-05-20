const path = require('path');
const fs = require('fs');

const psExtensionConfig = require('./ps-ext.config.js');

const distDir = path.resolve(__dirname, 'dist');
const modulesDir = path.resolve(__dirname, 'modules');

exports.dist = (module, file) => {
    let filePath = `${module}`;
    if (file) {
        filePath = filePath + `/${file}`;
    }

    return path.resolve(distDir, `${filePath}`);
};

exports.src = (module, file) => {
    let filePath = `${module}/src`;
    if (file) {
        filePath = filePath + `/${file}`;
    }

    return path.resolve(modulesDir, `${filePath}`);
};

exports.file = {
    read: (file) => {
        return fs.readFileSync(file).toString();
    },
    write: (file, content) => {
        const dir = path.dirname(file);
        if (! fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        fs.writeFileSync(file, content);
    }
};

exports.config = psExtensionConfig;

exports.webpack = {
    config: {
        common: {
            output: {
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
            }
        }
    },
    module: {
        handlebars: {
            test: /\.hbs$/,
            use: 'handlebars-loader'
        },
        styles: {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
        },
        fonts: {
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
    }
};
