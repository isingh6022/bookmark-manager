import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { customPaths } from '../paths.js';

const baseConfig = {
  entry: {
    // script: path.resolve('src', 'scripts', 'scripts.ts'),
    bundle: path.resolve('src', 'index.tsx')
  },
  resolve: {
    extensionAlias: {
      '.js': ['.ts', '.js', '.jsx', '.tsx'],
      '.mjs': ['.mts', '.mjs']
    },
    extensions: ['.ts', '.js'],
    alias: customPaths
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: { configFile: path.resolve('tsconfig.json') }
          }
        ]
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline'
      }
    ]
  },
  performance: {
    // bundle size limits for warnings.
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve('src', 'index.html'),
      inject: 'body'
    })
  ]
};

export { baseConfig };
