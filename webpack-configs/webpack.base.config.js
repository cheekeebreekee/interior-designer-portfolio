import webpack from 'webpack';
const path = require('path');
const fs = require('fs');
let HtmlWebpackPlugin = require('html-webpack-plugin');

/* ------------------------------------------------------------------------------ */
/**
 * Generate entry points object. We construct this object according to files in pages/ directory
 * @param entryPointsDir
 * @returns {Object}
 */
function generateEntryPoints (entryPointsDir) {
    const templates = fs.readdirSync(path.resolve(__dirname, '../', entryPointsDir));
    return templates.reduce( (acc, item) => {
       return {
           ...acc,
           [item]: `./pages/${item}/${item}.js`
       }
    }, {} );
}
/**
 * Generate array of HtmlWebpackPlugin objects to have multiple html-pages after assembly
 * @param templateDir
 * @returns {Object}
 */
function generateHtmlPlugins (templateDir) {
    const templates = fs.readdirSync(path.resolve(__dirname, '../', templateDir));
    return templates.map(item => {
        return new HtmlWebpackPlugin({
            inject: 'body',
            minify: false,
            filename: `${item}.html`,
            chunks: [ `${item}`, 'common' ],
            template: path.resolve(__dirname, '../', `pages/${item}/${item}.hbs`)
        })
    });
}
/* ------------------------------------------------------------------------------ */

module.exports = {
    entry: 
        // common: './components/common.js',
        generateEntryPoints('./pages')
    ,

    output: {
        filename: 'js/[name].js',
        path: path.join(__dirname, './../release'),
        publicPath: './'
    },

    module: {
        rules: [
            /* handlebars */
            {
                test: /\.hbs$/,
                use: [
                    {
                      loader: "handlebars-loader"
                    }
                ]
            },
            /* svg sprites */
            {
                test: /\.svg$/,
                include: [
                    path.resolve(__dirname, "./../svg-sprite")
                ],
                loader: 'svg-sprite-loader'
            }
        ]
    },

    plugins: [
        function() {
            this.plugin('watch-run', function(watching, callback) {
                console.log('* Begin compile at ' + new Date());
                callback();
            })
        },
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/common.js',
            minChunks: 2
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        ...generateHtmlPlugins('./pages')
    ],

    externals: {
        jquery: 'jQuery'
    }
};