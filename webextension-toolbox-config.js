// 配置webextension-toolbox中的webpack

const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { resolve } = require('path')
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin')

module.exports = {
  webpack: (config, { dev, vendor }) => {
    // Perform customizations to webpack config

    // Important: return the modified config
    config.module.rules.push({
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.ts$/,
      loader: 'ts-loader',
      options: {
        appendTsSuffixTo: [/\.vue$/]
      }
    });

    config.plugins.push(new VueLoaderPlugin());

    config.resolve.extensions.push('.vue', '.ts');
    config.resolve.alias = {
      'vue$': 'vue/dist/vue.esm.js'
    }

    config.entry = GlobEntriesPlugin.getEntries(
      [
        // resolve('app', '*.{js,mjs,jsx,ts,tsx}'),
        // resolve('app', '?(scripts)/*.{js,mjs,jsx,ts,tsx}')
        resolve('app', '?(scripts)/popup.ts'),
        resolve('app', '?(scripts)/background.ts'),
        resolve('app', '?(scripts)/options.ts'),
        resolve('app', '?(scripts)/contentscript.ts'),
      ]
    )
    console.log(config.entry());

    config.devtool = 'inline-source-map';

    console.log(config)
    return config
  }
}
