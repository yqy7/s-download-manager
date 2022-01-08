const webpack = require('webpack')
const {VueLoaderPlugin} = require('vue-loader/dist/index')
const {resolve} = require('path')
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin')

const Components = require('unplugin-vue-components/webpack')
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers')
const IconsResolver = require('unplugin-icons/resolver')
const Icons = require('unplugin-icons/webpack')

const WebextensionPlugin = require('webpack-webextension-plugin')

module.exports = {
  webpack: (config, {dev, vendor}) => {
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
        },
        exclude: /node_modules/
      },
      { // 这里修复element-plus带来的问题
        test: /\.mjs$/,
        resolve: {fullySpecified: false},
        include: /node_modules/,
        type: "javascript/auto"
      });

    config.plugins.push(
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
      }),
      new VueLoaderPlugin(),
      Components({
        resolvers: [ElementPlusResolver(), IconsResolver({
          prefix: 'icon'
        })],
      }),
      Icons({
        compiler: 'vue3'
      })
    )

    // for (let i = 0; i < config.plugins.length; i++) {
    //   if (config.plugins[i] instanceof WebextensionPlugin) {
    //     config.plugins[i].autoreload = false;
    //   }
    // }

    config.resolve.extensions.push('.vue', '.ts');

    config.entry = GlobEntriesPlugin.getEntries(
      [
        resolve('app', '?(scripts)/popup.ts'),
        resolve('app', '?(scripts)/background.ts'),
        resolve('app', '?(scripts)/options.ts'),
        resolve('app', '?(scripts)/contentscript.ts'),
      ]
    )

    // config.devtool = 'inline-source-map';
    console.log(config)
    return config
  }
}
