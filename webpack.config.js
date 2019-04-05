const path = require('path');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    open: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  entry: { index: './src/index.js' },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};