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

## 处理js文件
`Webpack` 对 `js` 处理是有限的，只能编译 `js` 中的 `ES` 模块化语法，不能编译其他语法，导致 `js` 不能在 IE 等浏览器运行，所以我们希望做一些兼容处理。

另外，团队对代码格式是有严格要求的，我们不能由肉眼去检测代码格式，需要使用专业的工具来检测。

- 针对 `js` 兼容性处理，我们使用 `Babel` 来完成。
- 针对代码格式，我们需要使用 `ESLint` 来完成

### ESLint
使用 ESLint 关键是设置 ESLint 配置文件，在配置文件里面配置各种 rules 规则，将来运行 ESLint 时就这些规则检测代码规范。

#### 配置文件
- 在项目根目录新建配置文件。
- 文件格式：`.eslitrc` 或 `.eslintrc.js` 或 `.eslintrc.json`

ESLint 会自动查找和读取上述的配置文件
    
#### 具体配置
以 `.eslintrc.js` 为例：
```javascript
module.exports = {
    // 解析选项
    parserOptions: {},
    // 具体的检查规则
    rules: {},
    // 继承其他规则
    extends: []
    // ...
}
```

1. `parserOptions` 解析选项
  ```javascript
  parserOptions: {
      ecmaVersion: 8, // ES 语法版本
      sourceType: 'module', // ES 模块化
      // ... 
  }
  ```
2. `rules` 具体规则
   - `"off" | 0`： 关闭规则
   - `"warm" | 1`： 开启规则，使用警告级别的错误，不会导致程序退出
   - `"error" | 2`： 开启规则，使用错误级别的错误，触发时回导致程序退出

  ```javascript
  rules: {
      semi: "error", // 禁止使用分号
      // ...
  }
  ```
  [具体rules规则](https://eslint.bootcss.com/docs/rules/)    

3. `extends` 继承其他规则
- ESLint 官方规则：`eslint:recommended`
- Vue Cli 官方规则：`plugin:vue/essential`
- React Cli 官方规则：`react-app`

4. 在根目录新增`.eslintignore` 跳过不需要检查的文件
5. VSCode 安装 ESLint 插件

#### 在Webpack中使用
- 安装依赖
```bash
yarn i -D eslint-webpack-plugin eslint
```
- 在 Webpack 配置文件引入插件
```javascript
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
// ...
plugins: [
 new ESLintWebpackPlugin({
   context: resolve(__dirname, 'src')
 }),
 // ...
]
```
- 新建.eslintrc.js
```javascript
module.exports = {
  extends: ['eslint:recommended'],
  env: {
    es6: true, // 开启es6语法
    node: true, // 开启node全局变量
    browser: true, // 开启浏览器全局变量
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  rules: {
    "no-var": 2, // 不能使用 var 定义变量
    // ...
  }
}
```

### Babel
JavaScript编辑器。

主要用于将 ES6 语法编译成向后兼容的JavaScript语法，以便能够运行在当前和旧版本的浏览器上。

#### 配置文件
- 在项目根目录新建配置文件。
- 文件格式：`.babelrc` 或 `.babelrc.js` 或 `.babelrc.json`或`babel.config.js` 或 `babel.config.json`

Babel 会自动查找和读取上述的配置文件

#### 具体配置
以 `babel.config.js` 为例：
```javascript
module.exports = {
    // 预设
    presets: [],
}
```
`presets` 预设是一组 `Babel` 插件，扩展 `Babel` 功能
- `@babel/preset-env`：智能预设，允许使用最新的 `JavaScript`
- `@babel/preset-react`：用来编译 `React jsx` 语法
- `@babel/preset-typescript`：用来编译 `TypeScript` 语法

#### 在Webpack使用
- 安装依赖
```bash
yarn i -D @babel/core @babel/preset-env babel-loader
```
- 在 Webpack 配置文件引入插件
```javascript
module: {
    rules: [
        {
            test: /\.jsx$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
        }
    ]
}
```
- 在根目录新建 babel.config.js 文件
```javascript
module.exports = {
  presets: ['@babel/preset-env']
}
```