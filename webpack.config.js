const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: [
        './main.js',
        './scss/styles.scss'
    ],
    output: {
        path: path.join(__dirname, 'www'),
        filename: 'bundle.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        "env",
                        "react"
                    ]
                }
            },
        }, {
            test: [/\.css$/, /\.scss$/],
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                        sourceMap: false
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        sourceMap: false
                    }
                }]
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin(`css/styles.min.css`),
        new WebpackNotifierPlugin({alwaysNotify: true})
    ],
    resolve: {
        modules: [
            path.join(__dirname, 'node_modules'),
        ],
    },
};