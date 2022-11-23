const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { IS_BUILD, RUN_PORT } = require('./env');

// 获取处理样式的loader
function getStyleLoader(pre) {
  return [
    IS_BUILD ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    'postcss-loader',
    pre,
  ].filter(Boolean);
}

module.exports = {
  // 入口，相对和绝对目录
  entry: resolve(__dirname, '../demo/basic/index.js'),

  // 输出
  output: {
    // 文件输出目录
    path: resolve(__dirname, 'dist'),
    // 文件输出名称
    filename: 'js/[name].[chunkhash:8].js',
    // 清空上一次打包内容
    clean: IS_BUILD,
  },

  // 加载器
  module: {
    rules: [
      // css loader配置
      {
        test: /\.css$/,
        use: getStyleLoader(),
      },
      // less-loader配置
      {
        test: /\.less$/,
        use: getStyleLoader('less-loader'),
      },
      // sass-loader 配置
      {
        test: /\.s(c|a)ss$/,
        use: getStyleLoader('sass-loader'),
      },
      // 处理图片资源
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            // 小于10kb会对图片转为base64格式
            maxSize: 10 * 1024,
          },
        },
        generator: {
          // 文件输出目录
          filename: 'images/[name]_[hash:8][ext][query]',
        },
      },
      // 处理其他资源
      {
        test: /\.(ttf|woff2?|mp4|mp3|avi)$/,
        type: 'asset/resource',
        generator: {
          // 文件输出目录
          filename: 'media/[name]_[hash:8][ext][query]',
        },
      },
      // 处理js资源
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  // plugins
  plugins: [
    // html插件
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../demo/basic/index.html')
    }),
    // ESLint 代码检验
    new ESLintWebpackPlugin({
      context: resolve(__dirname, '../demo')
    }),
    // 提出css文件
    IS_BUILD && new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash:8].css'
    }),
  ].filter(Boolean),

  // 优化配置
  optimization: {
    minimize: IS_BUILD,
    minimizer: [
      // 样式压缩
      IS_BUILD && new CssMinimizerPlugin(),
    ].filter(Boolean),
  },

  // 开发服务器
  devServer: {
    host: 'localhost',
    port: RUN_PORT,
    open: true,
    hot: true,
  },

  // 模式
  mode: IS_BUILD ? 'production' : 'development'
};