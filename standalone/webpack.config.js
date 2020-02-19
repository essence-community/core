const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function () {
  const config = {
    mode: 'production',
    target: 'electron-renderer',
    entry: {
      app: [path.join(__dirname, 'src', 'app', 'index.tsx')]
    },
    output: {
      filename: 'app.js',
      path: path.join(__dirname, 'build', 'app')
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
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
    },
    plugins: [new HtmlWebpackPlugin({
      title: 'Install CORE',
      template: path.join(__dirname, 'public', 'index.html')
    })]
  }
  return config
}
