
/**
 * Commands to include libraries in this project
 * 
 * npm i -D postcss-loader sass-loader node-sass autoprefixer cssnano postcss-import postcss-cssnext
 * 
 * npm i -D babel-core babel-loader
 * 
 * npm i -D babel-polyfill babel-preset-env babel-preset-react babel-preset-stage-0
**/

const path = require('path');

const LiveReload = require('webpack-livereload-plugin');

const htmlWebpackPlugin = require('html-webpack-plugin');

const cleanWebpackPlugin = require('clean-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './index.js', //can be also written as ./src/index.js, giving context to avoid making it static
    mode: 'development',
    output: {
        filename: '[name].bundle.js', //name of the output file
        path: path.resolve(__dirname, 'public') //name of the output folder
    },
    context: path.resolve(__dirname, 'src'), //this is to generalize the entry point folder as src/index.js
    plugins: [
        new LiveReload(), //adding support for live reload
        new cleanWebpackPlugin(['public']), //cleans public folder each time during build, to remove unsed assets etc.
        new htmlWebpackPlugin({ //install new plugin html-webpack-plugin and configure it here
            template: 'index.html'
        }),
        new ExtractTextPlugin({
            filename: './styles/main.css'
        })
    ],
    devServer: { //config to open site in a new tab automatically after running the dev server
        contentBase: path.resolve(__dirname, 'public/assets'),
        stats: 'errors-only',
        open: true,
        port: 8080,
        compress: true
    },
    module: {
        rules: [{ //configure a file-loader for static images, give output folder as assets
            test: /\.(jpg|png|gif|svg)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './assets/'
                    }
                }
            ]
        },
        // { //configure a css-loader for loading and handling css files
        //     //configure a style-loader for linking css files to build
        //     //executes from right to left so css-loader gets run first
        //     test: /\.css$/,
        //     use: ['style-loader','css-loader']
        //     // using extract plugin to extract css files into a separate folder
        //     // use: extractPlugin.extract({
        //     //     use: ["css-loader"],
        //     //     fallback: 'style-loader'
        //     // })
        // },
        {
            //this is required to make css as a seprate file in public
            test: /\.css$/,
            use: ExtractTextPlugin.extract(
            {
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader', 'postcss-loader'] //adding sass-loader and postcss-loader as loaders for other css preprocessors
            })
        },{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'stage-0', 'react']
                }
            }
        }]
    }
}