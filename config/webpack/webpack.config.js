import { baseConfig } from './webpack.common.js';
import { merge } from 'webpack-merge';
import { proConfig } from './webpack.prod.js';
import { devConfig } from './webpack.dev.js';

function getEvnConf(env) {
  env = (env + '').toLowerCase();
  if (env !== 'dev' && env !== 'prod') {
    throw `env = ${env} is not an acceptable option (dev | prod).`;
  }

  return env === 'dev' ? devConfig : proConfig;
}

function configGen(envVars) {
  const { env } = envVars;
  const envConfig = getEvnConf(env);

  return merge(baseConfig, envConfig);
}

export default configGen;
