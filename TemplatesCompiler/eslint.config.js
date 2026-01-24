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
  }

];
