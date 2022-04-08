var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var { CleanWebpackPlugin } = require("clean-webpack-plugin");
var path = require("path");
var ESLintPlugin = require("eslint-webpack-plugin");
require("dotenv").config();

module.exports = (env) => {
    let mode = "";
    let devtool = "";
    if (env && env.prod) {
        // prod config
        mode = "production";
        devtool = "cheap-module-source-map";
    } else {
        // dev config
        mode = "development";
        devtool = "inline-source-map";
    }

    return {
        entry: {
            app: "./src/client/index.tsx"
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        mode,
        devtool,
        devServer: {
            open: true,
            port: process.env.CLIENT_PORT
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
            path: path.join(__dirname, "./dist/client"),
            filename: "[name].[fullhash].js",
            chunkFilename: "[name].bundle.js"
        },
        plugins: [
            new ESLintPlugin({}),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuild: ["./dist"]
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, "./src/client/index.html")
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    CLIENT_PORT: JSON.stringify(process.env.CLIENT_PORT),
                    SERVER_PORT: JSON.stringify(process.env.SERVER_PORT)
                }
            })
        ]
    };
};
