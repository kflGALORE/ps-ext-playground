const client = 'client';
const ext = require('../../ps-ext');

const merge = require('webpack-merge');
const copy = require('copy-webpack-plugin');

const webpack = {
    client: {
        entry: {'app.bundle': ext.src(client, 'app.ts')},
        output: {
            path: ext.dist(client)
        },
        plugins: [
            new copy([
                {
                    from: ext.src(client, 'index.html'),
                    to: ext.dist(client, 'index.html')
                }
            ])
        ],
        module: {
            rules: [
                ext.webpack.module.handlebars,
                ext.webpack.module.styles,
                ext.webpack.module.fonts
            ]
        }
    },
    devServer: {
        devServer: {
            contentBase: ext.dist(client),
            openPage: '?mode=development'
        }
    }
};

module.exports = [merge(ext.webpack.config.common, webpack.client, webpack.devServer)];