const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const webpack = require('webpack')
// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)
  // If you want to add a new alias to the config.
  config.resolve.alias['crypto'] = 'crypto-browserify'
  config.resolve.alias['stream'] = 'stream-browserify'
  config.resolve.alias['process'] = 'process'
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process',
      Buffer: ['buffer', 'Buffer'],
    }),
  )
  // Maybe you want to turn off compression in dev mode.
  if (config.mode === 'development') {
    config.devServer.compress = false
  }

  // Or prevent minimizing the bundle when you build.
  if (config.mode === 'production') {
    config.optimization.minimize = false
  }

  // Finally return the new config for the CLI to use.
  return config
}
