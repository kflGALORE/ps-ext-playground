const path = require('path');
const copy = require('copy-webpack-plugin');

const distDir = path.resolve(__dirname, '../../dist2');
const moduleDir = path.resolve(__dirname, '.');


module.exports = {
    entry: {'client/app.bundle': path.resolve(moduleDir, 'src/app.ts')},
    output: {
        path: distDir, // dist(module)
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    plugins: [
        new copy([
            {
                from: path.resolve(moduleDir, 'src/index.html'), // src(module, 'index.html')
                to: path.resolve(distDir, 'client/index.html') // dist('client'/index.html') vs dist(module, 'index.html')
            }
        ])
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
    },
    devServer: {
        contentBase: path.resolve(distDir, 'client'),
        openPage: '?mode=development'
    }
};