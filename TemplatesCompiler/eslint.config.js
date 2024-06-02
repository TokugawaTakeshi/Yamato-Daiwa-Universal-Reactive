const YamatoDaiwaStyleGuides = require("@yamato-daiwa/style_guides/ECMAScript");


module.exports = [

  {
    ignores: [
      "Distributable/*",
      "Tests/**/*.expected.js"
    ]
  },

  ...YamatoDaiwaStyleGuides,

  {
    languageOptions: {
      parserOptions: {
        project: "tsconfig.eslint.json"
      }
    }
  },

  {
    files: [ "Tests/**/*.test.ts" ],
    rules: {

      /* A higher version of Node.js is required for developers. */
      "n/no-unsupported-features/node-builtins": [
        "error",
        {
          version: ">=22.0.0"
        }
      ]

    }
  }

];
