const path = require("path");

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: "./src/index.tsx",
    output: {
        path: path.join(__dirname, "/dist"), // the bundle output path
        filename: "samagam.js", // the name of the bundle
        publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public' }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }, {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: [/node_modules/],
                loader: "file-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: [/node_modules/],
                loader: "file-loader"
            },
            {
                test: /\.(pdf)$/i,
                exclude: [/node_modules/],
                loader: "file-loader",
                options: {
                    name: '[name].[ext]',
                },
            },
        ]
    },    
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
    devServer: {
        port: 8080,
        hot: true,
        historyApiFallback: true,
    },
};
module.exports = config;
