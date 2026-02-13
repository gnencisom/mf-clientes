const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    entry: "./src/index.tsx",
    mode: isProduction ? "production" : "development",

    devServer: !isProduction ? {
        port: 3001,
        historyApiFallback: true,
        static: [
            {
                directory: path.join(__dirname, "public"),
                serveIndex: false,
            },
        ],
        open: true,
        hot: true,
        client: {
            overlay: {
                errors: true,
                warnings: true,
            },
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
        },
    } : undefined,

    output: {
        publicPath: isProduction
            ? "http://localhost:3001/"
            : "http://localhost:3001/",
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
        extensions: [".tsx", ".ts", ".js"],
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },

    plugins: [
        new ModuleFederationPlugin({
            name: "Clientes",
            filename: "remoteEntry.js",
            exposes: {
                "./ClientesApp": "./src/ClientesApp",
            },
            shared: {
                react: {
                    singleton: true,
                    requiredVersion: "19.1.0",
                    eager: true
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: "19.1.0",
                    eager: true
                },
                "react-router-dom": {
                    singleton: true,
                    requiredVersion: "7.6.1",
                    eager: true,
                }
            },
        }),

        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
};