import path from 'path';
import webpack from 'webpack';

const proConfig = {
  mode: 'production',
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    // clean: true,
    assetModuleFilename: 'assets/[hash][ext]'
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_MODE: '"production"'
    })
  ]

  // devtool: 'cheap-module-source-map'
  // devtool: 'hidden-source-map'
};

export { proConfig };
