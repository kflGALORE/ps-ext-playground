const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const handlebars = require('handlebars');
const chalk = require('chalk');

const psExtensionConfig = require('./ps-ext.config.js');

// ---------------------------------------------------------------------------------------------------------------------
// Directories
// ---------------------------------------------------------------------------------------------------------------------
const distDir = path.resolve(__dirname, 'dist');
const modulesDir = path.resolve(__dirname, 'modules');

exports.distRoot = (file) => {
    if (file) {
        return path.resolve(distDir, `${file}`);
    }
    return distDir;
};

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

exports.installDir = () => {
    let extensionsDir;
    if (process.platform.toLowerCase().startsWith('win')) {
        extensionsDir = process.env.APPDATA + '\\Adobe\\CEP\\extensions\\';
    } else {
        extensionsDir = process.env.HOME + '/Library/Application Support/Adobe/CEP/extensions/';
    }

    return extensionsDir + psExtensionConfig.id;
};
// ---------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------------
// Utilities for handling files
// ---------------------------------------------------------------------------------------------------------------------
const file = {
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

exports.file = file;
// ---------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------------
// Utilities for handling directories
// ---------------------------------------------------------------------------------------------------------------------
exports.dir = {
    empty: (dir) => {
        fse.emptyDirSync(dir);
        return dir;
    },
    copy: (srcDir, targetDir) => {
        fse.copySync(srcDir, targetDir);
    }
};
// ---------------------------------------------------------------------------------------------------------------------

exports.config = psExtensionConfig;

// ---------------------------------------------------------------------------------------------------------------------
// Webpack support
// ---------------------------------------------------------------------------------------------------------------------
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
// ---------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------------
// Handlebars support
// ---------------------------------------------------------------------------------------------------------------------
exports.handlebars = {
    renderTemplate: (templateFile, targetFile) => {
        const template = handlebars.compile(file.read(templateFile));
        file.write(targetFile, template(psExtensionConfig));

        console.log(
            chalk.green(`${path.relative(distDir, targetFile)} [rendered]`) +
            ` [from: ${path.basename(templateFile)}]`
        );
    }
};
// ---------------------------------------------------------------------------------------------------------------------
