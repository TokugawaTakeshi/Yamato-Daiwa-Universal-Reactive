const YamatoDaiwaStyleGuides = require("@yamato-daiwa/style_guides/ECMAScript");


module.exports = [

  {
    ignores: [
      "Distributable/*",
      "Tests/Build/*"
    ]
  },

  ...YamatoDaiwaStyleGuides

];
