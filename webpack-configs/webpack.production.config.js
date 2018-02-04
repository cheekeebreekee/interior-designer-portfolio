import webpack from 'webpack';
import Config from 'webpack-config';
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const pathsToClean = [
    './../release/*.*',
    './../release/**/*.*'
]

const cleanOptions = {
    verbose: true,
    allowExternal: true
}

console.log(__dirname);

export default new Config().extend('webpack-configs/webpack.base.config.js').merge({
    devtool: 'source-map',

    module: {
        rules: [
            /* js */
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                use: [
                    { loader: "babel-loader" },
                    // { loader: 'eslint-loader' }
                ]
            },
            /* less */
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1/*, sourceMap: true, minimize: true */} },
                        { loader: "postcss-loader", options: { /*sourceMap: true*/ } },
                        { loader: 'less-loader', options: { /*sourceMap: true*/ } }
                    ]
                })
            },
            /* css */
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1, /*sourceMap: true, minimize: true*/ } },
                        { loader: "postcss-loader", options: { /*sourceMap: true*/ } }
                    ]
                })
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
                            outputPath: 'images/',
                            publicPath: '../'
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
                            outputPath: 'fonts/',
                            publicPath: '../'
                        }
                    }
                ]
            },
        ]
    },

    plugins: [
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/common.js',
            minChunks: 2
        }),
        new ExtractTextPlugin({
            filename: "css/[name].css"
        })
    ]
});