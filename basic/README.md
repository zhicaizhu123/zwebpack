# 基础配置

## 5大核心概念
1. entry（入口）
   指定Webpack从哪个文件开始大包，可以支持一个或多个文件入口。
2. output（输出）
   指定Webpack打包完的文件输出到哪里，如何命名等。
3. loader（加载器）
   Webpack本身只能处理js、json等资源，其他资源需要借助loader才能解析。
4. plugins（插件）
   扩展Webpack的功能。
5. mode（模式）
   - 生产环境：development
   - 开发环境：production

## 准备webpack配置文件
在根目录新建`webback.config.js`文件

基本配置：
```javascript
const { resolve } = require('path')

module.exports = {
  // 入口
  entry: resolve(__dirname, '../demo/basic/index.js'),

  // 输出
  output: {
    // 文件输出目录
    path: resolve(__dirname, 'dist'),
    // 文件输出名称
    filename: 'js/[name].[chunkhash:8].js',
  },

  // 加载器
  module: {
    rules: [
      // loader配置
    ]
  },

  // plugins
  plugins: [
    // 插件配置列表
  ],

  // 模式
  mode: 'development'
}
```

## 处理样式资源
> webpack 本身是不识别样式资源的，我们需要借助loader帮助webpack解析样式资源。
> **loader加载顺序为从右到左，从下到上依次处理。**
> [Loader官方文档]()

### 处理CSS资源
1. 安装依赖
  ```bash
  yarn add -D css-loader style-loader
  ```
2. 在相应的文件引入CSS资源
  ```javascript
  import 'path/to/index.css'
  ``` 
3. 配置：
  ```javascript
  ...
  module: {
    rules: [
      // loader配置
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
  ...
  ```

### 处理Less资源
1. 安装依赖
  ```bash
  yarn add -D less less-loader css-loader style-loader
  ```
2. 在相应的文件引入CSS资源
  ```javascript
  import 'path/to/index.css'
  ``` 
3. 配置：
  ```javascript
  ...
  module: {
    rules: [
      // loader配置
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ]
      }
    ]
  }
  ...
  ```

### 处理Sass资源
1. 安装依赖
  ```bash
  yarn add -D sass sass-loader css-loader style-loader
  ```
2. 在相应的文件引入CSS资源
  ```javascript
  import 'path/to/index.css'
  ``` 
3. 配置：
  ```javascript
  ...
  module: {
    rules: [
      // loader配置
      {
        test: /\.s(c|a)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  }
  ...
  ```

### 处理图片资源
过去在`Webpack4`中，我们需要使用`file-loader`和`url-loader`处理图片资源。

但是在`Webpack5`中，已经将这两个`loader`内置到`Webpack`中，我们只需要简单配置即可处理图片资源。

配置：
```javascript
...
  module: {
    rules: [
      // loader配置
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        parser: {
          defaultUrlCondition: {
            // 小于10kb会对图片进行处理
            maxSize: 10 * 1024
          }
        },
        generator: {
          // 文件输出目录
          filename: 'images/[name]_[hash:6][ext][query]',
        }
      }
    ]
  }
...
```

### 处理其他资源
在`Webpack5`中，我们可以通过loader的`type: 'asset'`，原封不动输出资源，所以我们可以利用这个属性处理不需要进行处理的资源。

配置：
```javascript
...
  module: {
    rules: [
      // loader配置
      {
        test: /\.(ttf|woff2?|mp4|mp3|avi)$/,
        type: 'asset',
        generator: {
          // 文件输出目录
          filename: 'media/[name]_[hash:6][ext][query]',
        }
      }
    ]
  }
...
```


### 自动清空上次打包资源
设置`Webpack`内容的`clean: true`则可以清空上次打包内容。

配置：
```javascript
output: {
  // 清空上一次打包内容
  clean: true,
}
```
