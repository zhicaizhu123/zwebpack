module.exports = {
  extends: ['eslint:recommended'],
  env: {
    es6: true,
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
    "semi": 2,
  }
};