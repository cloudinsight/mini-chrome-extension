module.exports = {
  entry: {
    options: './src/options',
    popup: './src/popup',
    background: './src/background'
  },
  output: {
    'path': './lib',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        loader: 'babel'
      }
    ]
  }
}
