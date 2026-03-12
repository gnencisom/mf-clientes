const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;
const Dotenv = require("dotenv-webpack");
const path = require("path");
const deps = require("./package.json").dependencies;

const isProduction = process.env.NODE_ENV === "production";

// ============================================
// CONFIGURACIÓN DE OUTPUT DINÁMICO
// ============================================
const getOutputConfig = () => {
    const baseUrl = isProduction
        ? process.env.PROD_PUBLIC_URL || "http://localhost:3001"
        : process.env.DEV_PUBLIC_URL || "http://localhost:3001";

    return {
        publicPath: baseUrl + "/",
        filename: isProduction ? "[name].[contenthash].js" : "[name].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    };
};

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

    output: getOutputConfig(),

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
                use: ["style-loader", "css-loader", "postcss-loader"],
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
                    requiredVersion: deps.react,
                    eager: true
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: deps["react-dom"],
                    eager: true
                },
                "react-router-dom": {
                    singleton: true,
                    requiredVersion: deps["react-router-dom"],
                    eager: true,
                }
            },
        }),

        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),

        new Dotenv({
            path: isProduction ? "./.env" : "./.env.development",
            systemvars: true,
        }),
    ],
};