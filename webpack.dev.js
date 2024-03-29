const path = require('path')
const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')

module.exports = merge(common, {
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'main-bundle-[hash].js',
      publicPath: '/'
    },
    mode: 'development',
    module: {
      rules: [{
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }, {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }, {
          loader: 'sass-loader'
        }]
      }]
    },
    devServer: {
      static: path.join(__dirname, 'dist'),
      devMiddleware: {
        writeToDisk: true,
      },
      historyApiFallback: true, 
      port: 8080
    },
    plugins: [
      new DefinePlugin({
        'process.env.API_URL': JSON.stringify('http://localhost:5050/api'),
        'process.env.PLACE': JSON.stringify('development')
      }), 
      new HtmlWebpackPlugin({
        template: './template.dev.html'
      })
    ]
  })