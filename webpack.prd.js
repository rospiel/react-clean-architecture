const path = require('path')
const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')

module.exports = merge(common, {
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'main-bundle-[hash].js',
      publicPath: ''
    },
    mode: 'production',
    module: {
      rules: [{
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }, {
        test: /\.scss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
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
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      axios: 'axios', 
      recoil: 'Recoil'
    },
    plugins: [
      new DefinePlugin({
        'process.env.API_URL': JSON.stringify('https://every-cougars-wink.loca.lt/api'), 
        'process.env.PLACE': JSON.stringify('production')
      }), 
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './template.prd.html' 
      }),
      new HtmlWebpackPlugin({
        filename: '404.html',
        template: './404.html', 
      }),
      new MiniCssExtractPlugin({
        filename: 'main-bundle-[hash].css'
      })
    ]
  })