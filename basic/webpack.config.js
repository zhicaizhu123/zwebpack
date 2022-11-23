const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

// 获取处理样式的loader
function getStyleLoader(pre) {
  return [
    'style-loader',
    'css-loader',
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
    clean: true,
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
          filename: 'images/[name]_[hash:6][ext][query]',
        },
      },
      // 处理其他资源
      {
        test: /\.(ttf|woff2?|mp4|mp3|avi)$/,
        type: 'asset',
        generator: {
          // 文件输出目录
          filename: 'media/[name]_[hash:6][ext][query]',
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
    new ESLintWebpackPlugin({
      context: resolve(__dirname, '../demo')
    })
  ],

  // 开发服务器
  devServer: {
    host: 'localhost',
    port: '3000',
    open: true,
    hot: true,
  },

  // 模式
  mode: 'development'
};