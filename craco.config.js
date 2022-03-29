const CracoLessPlugin = require('craco-less');
const CracoAlias = require("craco-alias");
const { WatchIgnorePlugin, IgnorePlugin, ProvidePlugin } = require("webpack");

module.exports = {
  webpack: {
    plugins:{
      add: [
        new IgnorePlugin({ // moment.js optimize
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        }),
      ]
    },
    configure: (webpackConfig) => {
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          // scss module pattern edit
          const moduleScssRule = rule.oneOf.filter(r => r.test && !r.exclude && new RegExp(r.test).test('*.module.scss'))[0];
          const moduleScssPattern = /\.(module|m).(scss|sass)/
          moduleScssRule.test = moduleScssPattern;
          // css-loader options.modules.exportLocalsConvention = "camelCase"
          moduleScssRule.use[1].options.modules.exportLocalsConvention = "camelCase";
          // scss exclude module pattern edit
          const scssRule = rule.oneOf.filter(r => r.test && r.exclude && new RegExp(r.test).test('*.scss') && new RegExp(r.exclude).test('*.module.scss'))[0];
          scssRule.exclude = moduleScssPattern;
        }
      });
      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: "./src",
        // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
        tsConfigPath: "./tsconfig.extend.json"
      }
    },
    // antd theme color edit
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#BA5428' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ]
};