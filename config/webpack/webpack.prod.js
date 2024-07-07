import path from 'path';

const proConfig = {
  mode: 'production',
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    // clean: true,
    assetModuleFilename: 'assets/[hash][ext]'
  }
  // devtool: 'cheap-module-source-map'
  // devtool: 'hidden-source-map'
};

export { proConfig };
