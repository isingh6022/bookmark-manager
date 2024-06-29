import webpack from 'webpack';

const devConfig = {
  mode: 'development',
  devtool: 'source-map',
  stats: {
    errorDetails: true
  },
  optimization: {
    runtimeChunk: 'single'
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_MODE: '"development"'
    })
  ]

  // devServer: {
  //   proxy: {
  //     '/data': 'http://localhost:8001'
  //   }
  // }
};

export { devConfig };
