import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const devServer = (isDev) => (isDev ? {
  devServer: {
    open: true,
    hot: true,
    port: 8080,
    watchFiles: ['index.html'],
  },
} : {});

const outputDirPath = path.join(path.resolve(), './dist');

export default ({ develop }) => ({
  devtool: 'source-map',
  mode: develop ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: outputDirPath,
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html' }),
    new MiniCssExtractPlugin({
      filename: './styles/styles.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  ...devServer(develop),
});
