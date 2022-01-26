var webpack = require("webpack");
var htmlWebpackPlugin = require("html-webpack-plugin");
var cleanWebpackPlugin = require("clean-webpack-plugin");
var path = require("path");
var settings = require("./settings");

module.exports = {
    entry: {
        app: "./src/client/index.tsx"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        open: true,
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    output: {
        path: path.join(__dirname, "../../dist/client"),
        publicPath: "http://localhost:3000/",
        filename: "[name].[fullhash].js",
        chunkFilename: "[name].bundle.js"
    },
    plugins: [
        new cleanWebpackPlugin.CleanWebpackPlugin({
            cleanOnceBeforeBuild: ["../../dist"]
        }),
        new htmlWebpackPlugin({
            template: path.join(__dirname, "../src/client/index.html"),
            filename: "index.html"
        }),
        new webpack.DefinePlugin(settings)
    ]
};
