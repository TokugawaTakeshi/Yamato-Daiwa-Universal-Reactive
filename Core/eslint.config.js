const YamatoDaiwaStyleGuides = require("@yamato-daiwa/style_guides/ECMAScript");


module.exports = [

  {
    ignores: [
      "Distributable/*",
      "Tests/Build/*"
    ]
  },

  ...YamatoDaiwaStyleGuides,

  {
    files: [
      "Source/Decorators/EventHandler.ts",
      "Source/Types/EventHandlersDataMap.ts",
      "Source/GeneralizedView.ts"
    ],
    rules: {
      "@typescript-eslint/no-redeclare": "off"
    }
  }

];
