const { join } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const precss = require('precss');
const postcssPresetEnv = require('postcss-preset-env');

const devMode = process.env.NODE_ENV === 'development';

const miniCssLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    publicPath: '../',
  },
};

const rules = [
  {
    test: /.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
  },
  {
    test: /\.s?css$/,
    use: [
      devMode ? 'style-loader' : miniCssLoader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 2,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins() {
            return [
              precss,
              postcssPresetEnv(),
            ];
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },
  {
    test: /\.(woff2|woff|ttf|eot|svg)(\?.*$|$)/,
    loader: 'file-loader?name=fonts/[name].[ext]',
    include: [
      join(__dirname, 'src'),
      join(__dirname, 'node_modules'),
    ],
  },
  {
    test: /\.(jpg|jpeg|gif|png|ico|svg)(\?.*$|$)$/,
    loader: 'file-loader?name=img/[name].[hash].[ext]',
  },
];

module.exports = rules;
