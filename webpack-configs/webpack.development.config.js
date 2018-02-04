import webpack from 'webpack';
import Config from 'webpack-config';
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

let HtmlReloadPlugin = require('reload-html-webpack-plugin');
let WebpackNotifierPlugin = require('webpack-notifier');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const PROXY = `http://${HOST}:${PORT}`;

export default new Config().extend('webpack-configs/webpack.base.config.js').merge({
    devtool: 'inline-source-map',

    output: {
        publicPath: '/'
    },

    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    },

    node: {
        fs: "empty"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                use: [
                    { loader: "babel-loader" }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { importLoaders: 1/*, sourceMap: true */} },
                    { loader: "postcss-loader", options: { /*sourceMap: true */} },
                    { loader: 'less-loader', options: {/* sourceMap: true */} }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: "postcss-loader", options: {/*sourceMap: true */} },
                    { loader: 'css-loader', options: { importLoaders: 1/*, sourceMap: true */} }
                ]
            },
            /* images */
            {
                test: /\.(png|jpg|svg)$/,
                include: [
                    path.resolve(__dirname, "./../images")
                ],
                exclude: [
                    path.resolve(__dirname, "./../svg-sprite")
                ],
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[name].[ext]',
                            outputPath: './../images/',
                        }
                    }
                ]
            },
            /* fonts */
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
        ]
    },

    plugins: [
        new HtmlReloadPlugin(),
        new WebpackNotifierPlugin(),
        new BrowserSyncPlugin(
            // BrowserSync options
            {
                host: '10.6.206.59',
                port: 3000,
                proxy: PROXY
            },
            // plugin options
            {
                reload: false
            }
        )
    ]
});