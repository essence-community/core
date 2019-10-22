const path = require("path");
const webpack = require("webpack");

module.exports = function (dir) {
    const config = {
        mode: 'production',
        target: "electron-renderer",
        entry: {
            app: [__dirname + "/install_app/app/index.tsx"]
        },
        output: {
            filename: "app.js",
            path: __dirname + "/install_app/build/app",
        },
        devtool: "source-map",
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"]
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react",
                                "@babel/preset-typescript",
                                // "@emotion/babel-preset-css-prop"
                            ],
                            plugins: [
                                // "@babel/proposal-class-properties",
                                // "@babel/proposal-object-rest-spread",
                                // "@babel/plugin-transform-runtime"
                            ]
                        }
                    }
                }
            ]
        }
    }
    return config;
}