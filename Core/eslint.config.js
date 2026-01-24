const YamatoDaiwaStyleGuides = require("@yamato-daiwa/style_guides/ECMAScript");


module.exports = [

  {
    ignores: [
      "index.js",
      "client.js",
      "server.js",
      "GeneratedTypes/*"
    ]
  },

  ...YamatoDaiwaStyleGuides,

  {
    files: [
      "Source/Common/Decorators/EventHandler.ts",
      "Source/Common/Types/EventHandlersDataMap.ts",
      "Source/Common/GeneralizedView.ts"
    ],
    rules: {
      "@typescript-eslint/no-redeclare": "off"
    }
  }

];
