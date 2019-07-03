const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const optimization = {
  splitChunks: {
    chunks: 'all',
    maxSize: 800000,
  },
  minimizer: [
    new TerserPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
    }),
    new OptimizeCSSAssetsPlugin(),
  ],
};

module.exports = optimization;
