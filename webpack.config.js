const path = require('path');

// module.exports = {
//   entry: './src/index.js',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist'),
//     publicPath: '/dist/',
//   },
//   devServer: {
//     static: {
//       directory: path.resolve(__dirname, 'public'),
//     },
//     compress: true,
//     port: 8080,
//   },
// };
//本地可用的先备份一下

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname,'./'),
    },
    compress: true,
    port: 8080,
  },
};