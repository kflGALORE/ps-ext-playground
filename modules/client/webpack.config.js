const client = 'client';
const env = require('../../build');

const merge = require('webpack-merge');
const copy = require('copy-webpack-plugin');

const webpack = {
    client: {
        entry: {'app.bundle': env.src(client, 'app.ts')},
        output: {
            path: env.dist(client)
        },
        plugins: [
            new copy([
                {
                    from: env.src(client, 'index.html'),
                    to: env.dist(client, 'index.html')
                }
            ])
        ],
        module: {
            rules: [
                env.webpack.module.handlebars,
                env.webpack.module.styles,
                env.webpack.module.fonts
            ]
        }
    },
    devServer: {
        devServer: {
            contentBase: env.dist(client),
            openPage: '?mode=development'
        }
    }
};

module.exports = [merge(env.webpack.config.common, webpack.client, webpack.devServer)];