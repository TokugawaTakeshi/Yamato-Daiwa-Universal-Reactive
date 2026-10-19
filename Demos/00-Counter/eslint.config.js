const YamatoDaiwaStyleGuides = require("@yamato-daiwa/style_guides/ECMAScript");


module.exports = [

  {
    ignores: [
      "Build"
    ]
  },

  ...YamatoDaiwaStyleGuides,


  /* ━━━ Global Variables ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  {

    files: [
      "**/*.ts",
      "Project.d.ts"
    ],

    languageOptions: {
      globals: {
        __IS_LOCAL_DEVELOPMENT_BUILDING_MODE__YDA__: "readonly",
        __IS_PRODUCTION_BUILDING_MODE__YDA__: "readonly",
        __PROJECT_ROOT_DIRECTORY__ALWAYS_FORWARD_SLASHES_PATH_SEPARATORS__YDA__: "readonly"

      }
    },

    rules: {

      "no-underscore-dangle": [
        "warn",
        {
          allow: [
            "__IS_LOCAL_DEVELOPMENT_BUILDING_MODE__YDA__",
            "__IS_PRODUCTION_BUILDING_MODE__YDA__",
            "__PROJECT_ROOT_DIRECTORY__ALWAYS_FORWARD_SLASHES_PATH_SEPARATORS__YDA__"
          ]
        }
      ]

    }

  }

];
