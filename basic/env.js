const { resolve } = require('path');
const dotEnv = require('dotenv');
const minimist = require('minimist');

/**
 * 获取命令参数
 * @returns 
 */
 function getArgs() {
  return minimist(process.argv.slice(2));
}


/**
 * 根据.env文件配置环境变量
 */
 function configEnvVariable() {
  const args = getArgs();
  // 是否为启动本地开发服务器
  const IS_BUILD = !args._.length;
  const modeSuffix = args.env ? `.${args.env}` : '';
  const envFilePath = resolve(__dirname, `.env${modeSuffix}`);
  dotEnv.config({ path: envFilePath });
  return Object.assign({}, process.env, { IS_BUILD });
}

module.exports = configEnvVariable();
