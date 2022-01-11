const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const srcDir = path.join(__dirname, 'src');

module.exports = {
  entry: './src/index.js',
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        include: srcDir,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        include: srcDir,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'tetris',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
