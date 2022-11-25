const { resolve } = require('path');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const { IS_BUILD, RUN_PORT } = require('./env');

// CPU核shu
const threads = os.cpus().length;

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
    // chunk的名称
    chunkFilename: 'js/[name].chunk.[contenthash:8].js',
    // 静态资源打包路径
    assetModuleFilename: 'assets/[name].[contenthash:8][ext][query]',
    // 清空上一次打包内容
    clean: IS_BUILD,
  },

  // 加载器
  module: {
    rules: [
      {
        oneOf: [
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
            // generator: {
            //   // 文件输出目录
            //   filename: 'images/[name]_[hash:8][ext][query]',
            // },
          },
          // 处理其他资源
          {
            test: /\.(ttf|woff2?|mp4|mp3|avi)$/,
            type: 'asset/resource',
            // generator: {
            //   // 文件输出目录
            //   filename: 'media/[name]_[hash:8][ext][query]',
            // },
          },
          // 处理js资源
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              // 开启多进程
              {
                loader: 'thread-loader',
                options: {
                  workers: threads,
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false, // 关闭缓存压缩
                }
              }
            ]
          }
        ]
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
      context: resolve(__dirname, '../demo'),
      exclude: "node_modules",
      cache: true, // 开启ESLint缓存
      threads, // 开启多进程
    }),
    // 提出css文件
    IS_BUILD && new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash:8].css',
      chunkFilename: 'styles/[name].chunk.[contenthash:8].css',
    }),
    IS_BUILD && new PreloadWebpackPlugin({
      rel: 'prefetch',
      // rel: 'preload',
      // as: 'script'
    })
  ].filter(Boolean),

  // 优化配置
  optimization: {
    minimize: IS_BUILD,
    splitChunks: {
      chunks: 'all',
      // 以下为默认配置
      // chunks: 'async', // 需分割的模块
      // minSize: 20000, // 代码分割最小的大小
      // minRemainingSize: 0, // 类似minSize，最后确保提出的文件大小不能为0
      // minChunks: 1, // 至少被引用的次数，满足条件才会被分割
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件最大数量
      // maxInitialRequests: 30, // 入口js 文件最大并行数量
      // enforceSizeThreshold: 50000, // 超过500kb一定要单独打包
      // cacheGroups: {
      //   defaultVendors: {
      //     test: /[\\/]node_modules[\\/]/,
      //     priority: -10, // 权重，越大越高
      //     reuseExistingChunk: true, // 如果当前chunk包含已从主 bundle 中拆分出的模块，则它将被重用，而不是重新生成新的模块
      //   },
      //   default: {
      //     minChunks: 2, // 这里的minChunks权重最高
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
    },
    minimizer: [
      // 样式压缩
      IS_BUILD && new CssMinimizerPlugin(),
      // js压缩
      IS_BUILD && new TerserWebpackPlugin({ parallel: threads }),
      // 图片压缩
      IS_BUILD && new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ].filter(Boolean),
    runtimeChunk: {
      name: (entrypoint) => `runtime.${entrypoint.name}`
    }
  },

  // 开发服务器
  devServer: {
    host: 'localhost',
    port: RUN_PORT,
    open: true, 
    hot: true,
  },

  // 模式
  mode: IS_BUILD ? 'production' : 'development',

  // 生成sourcemap配置
  devtool: IS_BUILD ? 'source-map' : 'cheap-module-source-map',
};