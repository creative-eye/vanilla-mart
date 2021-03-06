const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (jsBundleHash) => {
    return {
        target: 'web',
        entry: {
            app: ['webpack/hot/dev-server', './src/js/app.js'],
        },
        devServer: { inline: true },
        publicPath: './',
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: '[name]-[hash].js',
            sourceMapFileName: '[name].js.map',
            chunkFilename: '[name]-[chunkhash].js',
        },
        module: {
            loaders: [
                {
                    test: /\.js$/i,
                    exclude: /(node_modules)/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015']
                    },
                },
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass']
                }
            ],
        },
        devtool: 'sourcemap',
        debug: true,
        plugins: [
            new HtmlWebpackPlugin({
                defaultTitle: 'Crossover mart',
                template: path.join(__dirname, '../src/index.html'),
                inject: 'true',
            }),
            new webpack.HotModuleReplacementPlugin(),
        ],
    };
  };
