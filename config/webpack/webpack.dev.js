const devConfig = {
  mode: 'development',
  devtool: 'source-map',
  stats: {
    errorDetails: true
  },
  optimization: {
    runtimeChunk: 'single'
  }
  // devServer: {
  //   proxy: {
  //     '/data': 'http://localhost:8001'
  //   }
  // }
};

export { devConfig };
